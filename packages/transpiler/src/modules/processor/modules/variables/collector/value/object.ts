import type { ObjectExpression, Program } from "oxc-parser";

import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleKeyExprResult } from "##/processor/variables/collector/key/expr";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";

import { handleKeyExpr } from "##/processor/variables/collector/key/expr";
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

        let selector: string = ":root";

        // { [xxx]: "xxx" }
        if (prop.computed === true) {
            if (prop.key.type !== "Literal") {
                throw new TypeError(
                    `variables: computed property key is not supported`,
                );
            }

            const result: HandleKeyExprResult = handleKeyExpr({
                program: options.program,
                expr: prop.key,
            });

            if (result.key !== "default") {
                selector = result.key;
            }
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
            throw new TypeError(
                `variables: computed property key is not supported`,
            );
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
