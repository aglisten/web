import type {
    BigIntLiteral,
    BooleanLiteral,
    NullLiteral,
    NumericLiteral,
    RegExpLiteral,
    StringLiteral,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";

import { CompileError } from "#/errors/compile";

type HandleLiteralValueOptions = {
    context: CompilerContext;
    selectors: readonly string[];
    key: string;
    literal:
        | BooleanLiteral
        | NullLiteral
        | NumericLiteral
        | BigIntLiteral
        | RegExpLiteral
        | StringLiteral;
};

type HandleLiteralValueResult = {
    plans: StyleNodePlan[];
};

const handleLiteralValue = (
    options: HandleLiteralValueOptions,
): HandleLiteralValueResult => {
    if (options.literal.value === null) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.literal.start,
                end: options.literal.end,
            },
            message: `Unsupported literal value: null`,
        });
    }

    return {
        plans: [
            {
                selectors: [
                    ...options.selectors,
                ],
                key: options.key,
                values: [
                    options.literal.value.toString(),
                ],
            },
        ],
    };
};

export type { HandleLiteralValueOptions, HandleLiteralValueResult };
export { handleLiteralValue };
