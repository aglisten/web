import type { Expression, Program } from "oxc-parser";

import { findInlineExpression } from "#/ast/expr";

type HandleExpressionOptions = {
    program: Program;
    expr: Expression;
};

type HandleExpressionResult = {
    key: string;
};

const handleExpression = (
    options: HandleExpressionOptions,
): HandleExpressionResult => {
    const expr: Expression = options.expr;

    // [xxx]
    if (expr.type === "Identifier") {
        const result: Expression | undefined = findInlineExpression({
            program: options.program,
            name: expr.name,
        });

        if (!result) {
            throw new TypeError(`variables: failed to find expression`);
        }

        return handleExpression({
            program: options.program,
            expr: result,
        });
    }
    // ["xxx"]
    else if (expr.type === "Literal") {
        if (expr.value === null) {
            throw new TypeError(`variables: expression is null`);
        }

        return {
            key: expr.value.toString(),
        };
    }
    // xxx as xxx
    else if (expr.type === "TSAsExpression") {
        return handleExpression({
            program: options.program,
            expr: expr.expression,
        });
    } else {
        throw new TypeError(
            `variables: ${expr.type} is not supported as a expression`,
        );
    }
};

export type { HandleExpressionOptions, HandleExpressionResult };
export { handleExpression };
