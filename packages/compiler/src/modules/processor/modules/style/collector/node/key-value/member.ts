import type {
    Expression,
    IdentifierName,
    MemberExpression,
    ObjectExpression,
    ObjectPropertyKind,
    PrivateIdentifier,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";

type WalkObjectOptions = {
    context: CompilerContext;
    member: MemberExpression;
};

const walkObject = (options: WalkObjectOptions): string[] => {
    const result: string[] = [];

    const object: Expression = options.member.object;

    // abc.efg
    if (object.type === "Identifier") {
        result.push(object.name);
    }
    // abc.efg.xyz
    else if (object.type === "MemberExpression") {
        result.push(
            ...walkObject({
                context: options.context,
                member: object,
            }),
        );
    }
    // unsupported
    else {
        throw new CompileError({
            context: options.context,
            span: {
                start: object.start,
                end: object.end,
            },
            message: `Unsupported object type: ${object.type}`,
        });
    }

    return result;
};

type ColelctMemberPathOptions = {
    context: CompilerContext;
    program: Program;
    member: MemberExpression;
};

type ColelctMemberPathResult = {
    path: string[];
};

const collectMemberPath = (
    options: ColelctMemberPathOptions,
): ColelctMemberPathResult => {
    const member: MemberExpression = options.member;
    const property: Expression | IdentifierName | PrivateIdentifier =
        member.property;

    const path: string[] = walkObject({
        context: options.context,
        member,
    });

    let last: string;

    if (property.type === "Identifier") {
        last = property.name;
    }
    // TODO: support more property type
    // unsupported
    else {
        throw new CompileError({
            context: options.context,
            span: {
                start: property.start,
                end: property.end,
            },
            message: `Unsupported property type: ${property.type}`,
        });
    }

    path.push(last);

    return {
        path,
    };
};

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
    path: string[];
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

    const name: string | undefined = options.path[0];

    if (!name) {
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

type HandleMemberValueOptions = {
    context: CompilerContext;
    program: Program;
    selectors: readonly string[];
    key: string;
    member: MemberExpression;
};

type HandleMemberValueResult = {
    plans: StyleNodePlan[];
};

const handleMemberValue = (
    options: HandleMemberValueOptions,
): HandleMemberValueResult => {
    const { path } = collectMemberPath({
        context: options.context,
        program: options.program,
        member: options.member,
    });

    const { expr } = resolvePathToExpr({
        context: options.context,
        program: options.program,
        member: options.member,
        path,
    });

    return handleKeyValue({
        context: options.context,
        program: options.program,
        selectors: options.selectors,
        key: options.key,
        value: expr,
    });
};

export type { HandleMemberValueOptions, HandleMemberValueResult };
export { handleMemberValue };
