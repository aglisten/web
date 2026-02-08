import type {
    CallExpression,
    Directive,
    IdentifierReference,
    MemberExpression,
    Program,
    Statement,
    VariableDeclaration,
} from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { CompilerContext } from "#/contexts/compiler";
import type { TransformIdentResult } from "#/modules/preprocessor/preprocess/transform/ident";
import type { TransformMemberExprResult } from "#/modules/preprocessor/preprocess/transform/member";

import { cloneDeep } from "es-toolkit";

import { transformIdent } from "#/modules/preprocessor/preprocess/transform/ident";
import { transformMemberExpr } from "#/modules/preprocessor/preprocess/transform/member";

type PreprocessCallExprOptions = {
    context: CompilerContext;
    program: Program;
    namespaces: readonly string[];
    includedFunctions: readonly string[];
    specifiers: readonly Specifier[];
};

type PreprocessCallExprResult = {
    program: Program;
};

const preprocessCallExpr = (
    options: PreprocessCallExprOptions,
): PreprocessCallExprResult => {
    const result: Program = cloneDeep(options.program);

    for (let i: number = 0; i < result.body.length; i++) {
        const body: Directive | Statement | undefined = result.body[i];

        if (!body) continue;

        if (body.type !== "ExpressionStatement") continue;

        if (body.expression.type !== "CallExpression") continue;

        const call: CallExpression = body.expression;

        const va: string = `call_${i}`;

        // x.y();
        if (call.callee.type === "MemberExpression") {
            const member: MemberExpression = call.callee;

            // x
            if (member.object.type !== "Identifier") continue;

            if (!options.namespaces.includes(member.object.name)) continue;

            // y
            if (member.property.type === "Identifier") {
                if (!options.includedFunctions.includes(member.property.name))
                    continue;
            } else if (member.property.type === "Literal") {
                if (
                    member.property.value === "" ||
                    member.property.value === null
                ) {
                    continue;
                }

                if (
                    !options.includedFunctions.includes(
                        member.property.value.toString(),
                    )
                )
                    continue;
            }

            const resultTransform: TransformMemberExprResult =
                transformMemberExpr({
                    context: options.context,
                    va,
                    member,
                    arguments: call.arguments,
                });

            result.body[i] = {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: va,
                            start: 0,
                            end: 0,
                        },
                        init: resultTransform.object,
                        start: 0,
                        end: 0,
                    },
                ],
                start: body.start,
                end: body.end,
            } satisfies VariableDeclaration;
        }

        // x();
        else if (call.callee.type === "Identifier") {
            const ident: IdentifierReference = call.callee;

            if (!options.includedFunctions.includes(ident.name)) continue;

            const resultTransform: TransformIdentResult = transformIdent({
                context: options.context,
                va,
                ident,
                arguments: call.arguments,
            });

            result.body[i] = {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: va,
                            start: 0,
                            end: 0,
                        },
                        init: resultTransform.object,
                        start: 0,
                        end: 0,
                    },
                ],
                start: body.start,
                end: body.end,
            } satisfies VariableDeclaration;
        }
    }

    return {
        program: result,
    };
};

export type { PreprocessCallExprOptions, PreprocessCallExprResult };
export { preprocessCallExpr };
