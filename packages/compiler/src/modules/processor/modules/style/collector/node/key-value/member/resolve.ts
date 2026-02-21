import type {
    Expression,
    MemberExpression,
    ObjectExpression,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { collectMemberPath } from "##/processor/style/collector/node/key-value/member/collect";

type FindInObjectOptions = {
    context: CompilerContext;
    key: string;
    object: ObjectExpression;
};

const findInObject = (options: FindInObjectOptions): Expression => {
    for (let i: number = 0; i < options.object.properties.length; i++) {
        const prop: ObjectPropertyKind | undefined =
            options.object.properties[i];

        if (!prop) continue;

        if (prop.type === "SpreadElement") {
            // TODO: support spread element
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.start,
                    end: prop.end,
                },
                message: `Unsupported property type: ${prop.type}`,
            });
        }

        let isMatched: boolean = false;

        if (prop.key.type === "Identifier") {
            if (prop.key.name === options.key) {
                isMatched = true;
            }
        } else if (prop.key.type === "Literal") {
            if (prop.key.value === options.key) {
                isMatched = true;
            }
        }

        if (isMatched) return prop.value;
    }

    throw new CompileError({
        context: options.context,
        span: {
            start: options.object.start,
            end: options.object.end,
        },
        message: `Missing property in object`,
    });
};

type ResolvePathToExprOptions = {
    context: CompilerContext;
    program: Program;
    member: MemberExpression;
    path: readonly string[];
};

type ResolvePathToExprResult = {
    expr: Expression;
};

const resolvePathToExpr = (
    options: ResolvePathToExprOptions,
): ResolvePathToExprResult => {
    if (options.path.length === 0) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.member.start,
                end: options.member.end,
            },
            message: `Empty member path`,
        });
    }

    const rootName: string | undefined = options.path[0];

    if (!rootName) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.member.start,
                end: options.member.end,
            },
            message: `Empty member path`,
        });
    }

    let currentExpr: Expression | undefined = findInlineExpression({
        context: options.context,
        program: options.program,
        name: rootName,
    });

    if (!currentExpr) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.member.start,
                end: options.member.end,
            },
            message: `Inline expression not found: ${name}`,
        });
    }

    let current: number = 1;

    while (current < options.path.length) {
        const segment: string | undefined = options.path[current];

        if (!segment) break;

        if (currentExpr.type === "ObjectExpression") {
            currentExpr = findInObject({
                context: options.context,
                object: currentExpr,
                key: segment,
            });

            current++;
        } else if (currentExpr.type === "Identifier") {
            const name: string = currentExpr.name;

            currentExpr = findInlineExpression({
                context: options.context,
                program: options.program,
                name,
            });

            if (!currentExpr) {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: options.member.start,
                        end: options.member.end,
                    },
                    message: `Inline expression not found: ${name}`,
                });
            }
        } else if (currentExpr.type === "MemberExpression") {
            const { path: innerPath } = collectMemberPath({
                context: options.context,
                program: options.program,
                member: currentExpr,
            });

            const newPath: string[] = innerPath;

            newPath.push(...options.path.slice(current));

            return resolvePathToExpr({
                context: options.context,
                program: options.program,
                member: currentExpr,
                path: newPath,
            });
        }
        // unsupported
        else {
            throw new CompileError({
                context: options.context,
                span: {
                    start: options.member.start,
                    end: options.member.end,
                },
                message: `Unsupported expression type: ${currentExpr.type}`,
            });
        }
    }

    return {
        expr: currentExpr,
    };
};

export type { ResolvePathToExprOptions, ResolvePathToExprResult };
export { resolvePathToExpr };
