import type {
    Expression,
    Program,
    TemplateElement,
    TemplateLiteral,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";

type ExpressionToStringOptions = {
    context: CompilerContext;
    program: Program;
    expression: Expression;
};

const expressionToString = (options: ExpressionToStringOptions): string => {
    const expr: Expression = options.expression;

    // to string
    if (expr.type === "Literal") {
        if (expr.value === null) return "";
        return expr.value.toString();
    }
    // find inline expression
    else if (expr.type === "Identifier") {
        const inlineExpr: Expression | undefined = findInlineExpression({
            context: options.context,
            program: options.program,
            name: expr.name,
        });

        if (!inlineExpr) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: expr.start,
                    end: expr.end,
                },
                message: `Inline expression not found: ${expr.name}`,
            });
        }

        const result: string = expressionToString({
            context: options.context,
            program: options.program,
            expression: inlineExpr,
        });

        return result;
    }
    // as const
    else if (expr.type === "TSAsExpression") {
        return expressionToString({
            context: options.context,
            program: options.program,
            expression: expr.expression,
        });
    }
    // unsupported
    else {
        throw new CompileError({
            context: options.context,
            span: {
                start: expr.start,
                end: expr.end,
            },
            message: `Unsupported expression type: ${expr.type}`,
        });
    }
};

type CollectTemplateLiteralOptions = {
    context: CompilerContext;
    program: Program;
    template: TemplateLiteral;
};

type CollectTemplateLiteralResult = {
    str: string;
};

const collectTemplateLiteral = (
    options: CollectTemplateLiteralOptions,
): CollectTemplateLiteralResult => {
    let str: string = "";

    const template: TemplateLiteral = options.template;

    for (let i: number = 0; i < template.quasis.length; i++) {
        // append quasi

        const quasi: TemplateElement | undefined = template.quasis[i];

        if (!quasi) continue;

        str += quasi.value.cooked ?? quasi.value.raw;

        // append expression

        const expression: Expression | undefined = template.expressions[i];

        if (!expression) continue;

        str += expressionToString({
            context: options.context,
            program: options.program,
            expression,
        });
    }

    return {
        str,
    };
};

export type { CollectTemplateLiteralOptions, CollectTemplateLiteralResult };
export { collectTemplateLiteral };
