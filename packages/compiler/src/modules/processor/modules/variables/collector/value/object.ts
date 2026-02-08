import type { ObjectExpression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { HandleExpressionResult } from "#/modules/processor/modules/variables/collector/expr";
import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";

import { CompileError } from "#/errors/compile";
import { handleExpression } from "#/modules/processor/modules/variables/collector/expr";
import { handleKeyValue } from "##/processor/variables/collector/key-value";

type HandleObjectValueOptions = {
    context: CompilerContext;
    info: VarDeclInfo;
    program: Program;
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
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.start,
                    end: prop.end,
                },
                message: `Unsupported property type: ${prop.type}`,
            });
        }

        let selector: string = "";

        // { [xxx]: "xxx" }
        if (prop.computed === true) {
            if (prop.key.type !== "Literal" && prop.key.type !== "Identifier") {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: prop.key.start,
                        end: prop.key.end,
                    },
                    message: `Unsupported computed property key type: ${prop.key.type}`,
                });
            }

            const result: HandleExpressionResult = handleExpression({
                context: options.context,
                program: options.program,
                expr: prop.key,
            });

            selector = result.str;
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
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key type: ${prop.key.type}`,
            });
        }

        if (selector === "default") {
            selector = ":root";
        }

        const result: HandleKeyValueResult = handleKeyValue({
            context: options.context,
            info: options.info,
            program: options.program,
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
