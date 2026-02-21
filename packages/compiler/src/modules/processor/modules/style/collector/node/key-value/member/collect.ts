import type {
    Expression,
    IdentifierName,
    MemberExpression,
    PrivateIdentifier,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { CompileError } from "#/errors/compile";

type WalkObjectOptions = {
    context: CompilerContext;
    member: MemberExpression;
};

const walkObject = ({ member, context }: WalkObjectOptions): string[] => {
    const result: string[] = [];

    const object: Expression = member.object;

    // abc.efg
    if (object.type === "Identifier") {
        result.push(object.name);
    }
    // abc.efg.xyz
    else if (object.type === "MemberExpression") {
        result.push(
            ...walkObject({
                context,
                member: object,
            }),
        );

        if (object.property.type === "Identifier") {
            result.push(object.property.name);
        } else {
            throw new CompileError({
                context,
                span: {
                    start: object.property.start,
                    end: object.property.end,
                },
                message: `Unsupported property type: ${object.property.type}`,
            });
        }
    }
    // unsupported
    else {
        throw new CompileError({
            context,
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

export type { ColelctMemberPathOptions, ColelctMemberPathResult };
export { collectMemberPath };
