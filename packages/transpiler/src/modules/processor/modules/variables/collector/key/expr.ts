import type { Expression, Program } from "oxc-parser";

import { findInlineExpression } from "#/ast/expr";

type HandleKeyExprOptions = {
    program: Program;
    expr: Expression;
};

type HandleKeyExprResult = {
    key: string;
};

const handleKeyExpr = (options: HandleKeyExprOptions): HandleKeyExprResult => {
    const expr: Expression = options.expr;

    // [blue]
    if (expr.type === "Identifier") {
        const result: Expression | undefined = findInlineExpression({
            program: options.program,
            name: expr.name,
        });

        if (!result) {
            throw new TypeError(`variables: failed to find key expression`);
        }

        return handleKeyExpr({
            program: options.program,
            expr: result,
        });
    }
    // ["blue"]
    else if (expr.type === "Literal") {
        if (expr.value === null) {
            throw new TypeError(`variables: key expression is null`);
        }

        return {
            key: expr.value.toString(),
        };
    } else {
        throw new TypeError(
            `variables: ${expr.type} is not supported as a key expression`,
        );
    }
};

export type { HandleKeyExprOptions, HandleKeyExprResult };
export { handleKeyExpr };
