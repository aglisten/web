import type { ObjectExpression, Program } from "oxc-parser";

import type { HandleExpressionResult } from "#/modules/processor/modules/variables/collector/expr";
import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";

import { handleExpression } from "#/modules/processor/modules/variables/collector/expr";
import { handleKeyValue } from "##/processor/variables/collector/key-value";

type HandleObjectValueOptions = {
    program: Program;
    id: string;
    selector: string;
    key: string;
    object: ObjectExpression;
};

type HandleObjectValueResult = {
    keyValues: VariableKeyValue[];
};

const handleObjectValue = (
    options: HandleObjectValueOptions,
): HandleObjectValueResult => {
    const keyValues: VariableKeyValue[] = [];

    for (const prop of options.object.properties) {
        // { ...xxx }
        if (prop.type === "SpreadElement") {
            throw new TypeError(`variables: spread element is not supported`);
        }

        let selector: string = "";

        // { [xxx]: "xxx" }
        if (prop.computed === true) {
            if (prop.key.type !== "Literal" && prop.key.type !== "Identifier") {
                throw new TypeError(
                    `variables: computed property key is not supported`,
                );
            }

            const result: HandleExpressionResult = handleExpression({
                program: options.program,
                expr: prop.key,
            });

            selector = result.key;
        }

        // { "xxxx": "xxx" }
        else if (prop.key.type === "Literal") {
            if (prop.key.value) {
                selector = prop.key.value.toString();
            }
        }

        // { xxx: "xxx" }
        else if (prop.key.type === "Identifier") {
            selector = prop.key.name;
        }

        // unsupported
        else {
            throw new TypeError(`variables: ${prop.key.type} is not supported`);
        }

        if (selector === "default") {
            selector = ":root";
        }

        const result: HandleKeyValueResult = handleKeyValue({
            program: options.program,
            id: options.id,
            selector,
            key: options.key,
            value: prop.value,
        });

        keyValues.push(...result.keyValues);
    }

    return {
        keyValues,
    };
};

export type { HandleObjectValueOptions, HandleObjectValueResult };
export { handleObjectValue };
