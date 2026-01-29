import type {
    Expression,
    Program,
    TemplateElement,
    TemplateLiteral,
} from "oxc-parser";

import { findInlineExpression } from "#/ast/expr";

type ExpressionToStringOptions = {
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
            program: options.program,
            name: expr.name,
        });

        if (!inlineExpr) {
            throw new Error(`no inline expression found`);
        }

        const result: string = expressionToString({
            program: options.program,
            expression: inlineExpr,
        });

        return result;
    }
    // as const
    else if (expr.type === "TSAsExpression") {
        return expressionToString({
            program: options.program,
            expression: expr.expression,
        });
    }
    // unsupported
    else {
        throw new TypeError(`css: ${expr.type} is not supported`);
    }
};

type CollectTemplateLiteralOptions = {
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
