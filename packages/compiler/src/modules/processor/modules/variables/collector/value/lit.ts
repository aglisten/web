import type { Expression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { VariableKeyValue } from "##/processor/variables/@types";

import { CompileError } from "#/errors/compile";
import { fixedFnv1a } from "#/modules/processor/functions/hash";

type HandleLiteralValueOptions = {
    context: CompilerContext;
    program: Program;
    id: string;
    selector: string;
    key: string;
    lit: Expression;
};

type HandleLiteralValueResult = {
    keyValues: VariableKeyValue[];
};

const handleLiteralValue = (
    options: HandleLiteralValueOptions,
): HandleLiteralValueResult => {
    const keyValues: VariableKeyValue[] = [];

    if (options.lit.type !== "Literal") {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.lit.start,
                end: options.lit.end,
            },
            message: `Unsupported value type: ${options.lit.type}`,
        });
    }

    // blue: "xxx"

    let value: string = "";

    if (options.lit.value === null) {
        value = "null";
    } else {
        value = options.lit.value.toString();
    }

    const title: string = `v${fixedFnv1a(options.id, 2)}${fixedFnv1a(options.key, 3)}`;

    keyValues.push({
        title,
        selector: options.selector,
        key: options.key,
        value,
    });

    return {
        keyValues,
    };
};

export type { HandleLiteralValueOptions, HandleLiteralValueResult };
export { handleLiteralValue };
