import type { Expression, IdentifierReference, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNode } from "##/processor/style/@types";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";
import { createStyleNodeTitle } from "##/processor/style/collector/title";

type HandleIdentValueOptions = {
    context: CompilerContext;
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
        context: options.context,
        program: options.program,
        name,
    });

    if (!expr) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.ident.start,
                end: options.ident.end,
            },
            message: `Inline expression not found: ${name}`,
        });
    }

    if (expr.type === "Literal") {
        if (expr.value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: options.ident.start,
                    end: options.ident.end,
                },
                message: `Unsupported expression type: ${expr.type}`,
            });
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
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            value: expr,
        });
    }
};

export type { HandleIdentValueOptions, HandleIdentValueResult };
export { handleIdentValue };
