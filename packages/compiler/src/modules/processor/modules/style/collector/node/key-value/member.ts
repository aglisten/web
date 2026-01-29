import type {
    Expression,
    IdentifierName,
    MemberExpression,
    ObjectExpression,
    ObjectPropertyKind,
    PrivateIdentifier,
    Program,
} from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";

import { findInlineExpression } from "#/ast/expr";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";

const walkObject = (member: MemberExpression): string[] => {
    const result: string[] = [];

    const object: Expression = member.object;

    // abc.efg
    if (object.type === "Identifier") {
        result.push(object.name);
    }
    // abc.efg.xyz
    else if (object.type === "MemberExpression") {
        result.push(...walkObject(object));
    }
    // unsupported
    else {
        throw new TypeError(`style: ${object.type} is not supported`);
    }

    return result;
};

type ColelctMemberPathOptions = {
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

    const path: string[] = walkObject(member);

    let last: string;

    if (property.type === "Identifier") {
        last = property.name;
    }
    // TODO: support more property type
    // unsupported
    else {
        throw new TypeError(`style: ${property.type} is not supported`);
    }

    path.push(last);

    return {
        path,
    };
};

type FindInObjectOptions = {
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
            throw new TypeError(`keyframes: spread element is not supported`);
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

    throw new Error("style: missing property in object for the style");
};

type ResolvePathToExprOptions = {
    program: Program;
    path: string[];
};

type ResolvePathToExprResult = {
    expr: Expression;
};

const resolvePathToExpr = (
    options: ResolvePathToExprOptions,
): ResolvePathToExprResult => {
    if (options.path.length === 0) {
        throw new Error("style: empty member path in the style");
    }

    const name: string | undefined = options.path[0];

    if (!name) {
        throw new Error("style: empty member path in the style");
    }

    let currentExpr: Expression | undefined = findInlineExpression({
        program: options.program,
        name,
    });

    if (!currentExpr) {
        throw new Error(`style: no inline expression found for ${name}`);
    }

    let current: number = 1;

    while (current < options.path.length) {
        const segment: string | undefined = options.path[current];

        if (!segment) break;

        if (currentExpr.type === "ObjectExpression") {
            currentExpr = findInObject({
                object: currentExpr,
                key: segment,
            });

            current++;
        } else if (currentExpr.type === "Identifier") {
            const name: string = currentExpr.name;

            currentExpr = findInlineExpression({
                program: options.program,
                name,
            });

            if (!currentExpr) {
                throw new Error(
                    `style: no inline expression found for ${name}`,
                );
            }
        } else if (currentExpr.type === "MemberExpression") {
            const { path: innerPath } = collectMemberPath({
                program: options.program,
                member: currentExpr,
            });

            const newPath: string[] = innerPath;

            newPath.push(...options.path.slice(current));

            return resolvePathToExpr({
                program: options.program,
                path: newPath,
            });
        }
        // unsupported
        else {
            throw new TypeError(`style: ${currentExpr.type} is not supported`);
        }
    }

    return {
        expr: null as any,
    };
};

type HandleMemberValueOptions = {
    program: Program;
    selectors: string[];
    key: string;
    member: MemberExpression;
};

type HandleMemberValueResult = {
    styleNodes: StyleNode[];
};

const handleMemberValue = (
    options: HandleMemberValueOptions,
): HandleMemberValueResult => {
    const { path } = collectMemberPath({
        program: options.program,
        member: options.member,
    });

    const { expr } = resolvePathToExpr({
        program: options.program,
        path,
    });

    return handleKeyValue({
        program: options.program,
        selectors: options.selectors,
        key: options.key,
        value: expr,
    });
};

export type { HandleMemberValueOptions, HandleMemberValueResult };
export { handleMemberValue };
