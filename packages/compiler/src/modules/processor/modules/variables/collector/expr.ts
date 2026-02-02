import type { Expression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { CollectTemplateLiteralResult } from "#/modules/processor/functions/template";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { collectTemplateLiteral } from "#/modules/processor/functions/template";

type HandleExpressionOptions = {
    context: CompilerContext;
    program: Program;
    expr: Expression;
};

type HandleExpressionResult = {
    str: string;
};

const handleExpression = (
    options: HandleExpressionOptions,
): HandleExpressionResult => {
    const expr: Expression = options.expr;

    // [xxx]
    if (expr.type === "Identifier") {
        const result: Expression | undefined = findInlineExpression({
            context: options.context,
            program: options.program,
            name: expr.name,
        });

        if (!result) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: expr.start,
                    end: expr.end,
                },
                message: `Inline expression not found: ${expr.name}`,
            });
        }

        return handleExpression({
            context: options.context,
            program: options.program,
            expr: result,
        });
    }
    // ["xxx"]
    else if (expr.type === "Literal") {
        if (expr.value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: expr.start,
                    end: expr.end,
                },
                message: `Unsupported expression value: null`,
            });
        }

        return {
            str: expr.value.toString(),
        };
    }
    // `xxx`
    else if (expr.type === "TemplateLiteral") {
        const collected: CollectTemplateLiteralResult = collectTemplateLiteral({
            context: options.context,
            program: options.program,
            template: expr,
        });

        return {
            str: collected.str,
        };
    }
    // xxx as xxx
    else if (expr.type === "TSAsExpression") {
        return handleExpression({
            context: options.context,
            program: options.program,
            expr: expr.expression,
        });
    } else {
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

export type { HandleExpressionOptions, HandleExpressionResult };
export { handleExpression };
