import type { Expression, IdentifierReference, Program } from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";

import { findInlineExpression } from "#/ast/expr";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";
import { createStyleNodeTitle } from "##/processor/style/collector/title";

type HandleIdentValueOptions = {
    program: Program;
    selectors: string[];
    key: string;
    ident: IdentifierReference;
};

type HandleIdentValueResult = {
    styleNodes: StyleNode[];
};

const handleIdentValue = (
    options: HandleIdentValueOptions,
): HandleIdentValueResult => {
    const name: string = options.ident.name;

    const expr: Expression | undefined = findInlineExpression({
        program: options.program,
        name,
    });

    if (!expr) {
        throw new Error(`style: no inline expression found for ${name}`);
    }

    if (expr.type === "Literal") {
        if (expr.value === null) {
            throw new TypeError(`style: expression is null`);
        }

        const value: string = expr.value.toString();

        const { title } = createStyleNodeTitle({
            selectors: options.selectors,
            key: options.key,
            value,
        });

        return {
            styleNodes: [
                {
                    title,
                    selectors: options.selectors,
                    key: options.key,
                    value,
                },
            ],
        };
    } else {
        return handleKeyValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            value: expr,
        });
    }
};

export type { HandleIdentValueOptions, HandleIdentValueResult };
export { handleIdentValue };
