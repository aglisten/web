import type { Expression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { VariableKeyValue } from "##/processor/variables/@types";

import { CompileError } from "#/errors/compile";
import { handleIdentValue } from "##/processor/variables/collector/value/ident";
import { handleLiteralValue } from "##/processor/variables/collector/value/lit";
import { handleObjectValue } from "##/processor/variables/collector/value/object";

type HandleKeyValueOptions = {
    context: CompilerContext;
    info: VarDeclInfo;
    program: Program;
    selector: string;
    key: string;
    value: Expression;
};

type HandleKeyValueResult = {
    keyValues: VariableKeyValue[];
};

const handleKeyValue = (
    options: HandleKeyValueOptions,
): HandleKeyValueResult => {
    const value: Expression = options.value;

    // blue: "xxx"
    if (value.type === "Literal") {
        return handleLiteralValue({
            ...options,
            lit: value,
        });
    }
    // blue: x,
    else if (value.type === "Identifier") {
        return handleIdentValue({
            ...options,
            ident: value,
        });
    }
    // blue: { default: "xxx" },
    else if (value.type === "ObjectExpression") {
        return handleObjectValue({
            ...options,
            object: value,
        });
    }
    // blue: "xxx" as const
    else if (value.type === "TSAsExpression") {
        return handleKeyValue({
            ...options,
            value: value.expression,
        });
    }

    throw new CompileError({
        context: options.context,
        span: {
            start: value.start,
            end: value.end,
        },
        message: `Unsupported value type: ${value.type}`,
    });
};

export type { HandleKeyValueOptions, HandleKeyValueResult };
export { handleKeyValue };
