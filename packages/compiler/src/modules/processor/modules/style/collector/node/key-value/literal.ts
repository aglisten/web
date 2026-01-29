import type {
    BigIntLiteral,
    BooleanLiteral,
    NullLiteral,
    NumericLiteral,
    RegExpLiteral,
    StringLiteral,
} from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";

import { createStyleNodeTitle } from "##/processor/style/collector/title";

type HandleLiteralValueOptions = {
    selectors: string[];
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
    styleNodes: StyleNode[];
};

const handleLiteralValue = (
    options: HandleLiteralValueOptions,
): HandleLiteralValueResult => {
    if (options.literal.value === null) {
        throw new TypeError(`style: null is not supported`);
    }

    const { title } = createStyleNodeTitle({
        selectors: options.selectors,
        key: options.key,
        value: options.literal.value.toString(),
    });

    return {
        styleNodes: [
            {
                title,
                selectors: options.selectors,
                key: options.key,
                value: options.literal.value.toString(),
            },
        ],
    };
};

export type { HandleLiteralValueOptions, HandleLiteralValueResult };
export { handleLiteralValue };
