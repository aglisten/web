import type {
    CallExpression,
    Directive,
    IdentifierReference,
    MemberExpression,
    Node,
    Program,
    Statement,
} from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { TransformIdentResult } from "#/modules/preprocessor/preprocess/transform/ident";
import type { TransformMemberExprResult } from "#/modules/preprocessor/preprocess/transform/member";

import { cloneDeep } from "es-toolkit";
import { walk } from "oxc-walker";

import { SIGNATURE } from "#/consts";
import { transformIdent } from "#/modules/preprocessor/preprocess/transform/ident";
import { transformMemberExpr } from "#/modules/preprocessor/preprocess/transform/member";

type PreprocessCallExprOptions = {
    program: Program;
    namespaces: string[];
    includedFunctions: string[];
    specifiers: Specifier[];
};

type PreprocessCallExprResult = {
    program: Program;
};

const preprocessCallExpr = async (
    options: PreprocessCallExprOptions,
): Promise<PreprocessCallExprResult> => {
    const result: Program = cloneDeep(options.program);

    walk(result, {
        enter: async (node: Node): Promise<void> => {
            if (node.type !== "Program") return void 0;

            for (let i: number = 0; i < node.body.length; i++) {
                const body: Directive | Statement | undefined = node.body[i];

                if (!body) return void 0;

                if (body.type !== "ExpressionStatement") return void 0;

                if (body.expression.type !== "CallExpression") return void 0;

                const call: CallExpression = body.expression;

                const id: string = `${SIGNATURE}_ce_${i}`;

                // x.y();
                if (call.callee.type === "MemberExpression") {
                    const member: MemberExpression = call.callee;

                    // x
                    if (member.object.type !== "Identifier") return void 0;

                    if (!options.namespaces.includes(member.object.name))
                        return void 0;

                    // y
                    if (member.property.type === "Identifier") {
                        if (
                            !options.includedFunctions.includes(
                                member.property.name,
                            )
                        )
                            return void 0;
                    } else if (member.property.type === "Literal") {
                        if (
                            member.property.value === "" ||
                            member.property.value === null
                        ) {
                            return void 0;
                        }

                        if (
                            !options.includedFunctions.includes(
                                member.property.value.toString(),
                            )
                        )
                            return void 0;
                    }

                    const resultTransform: TransformMemberExprResult =
                        await transformMemberExpr({
                            id,
                            member,
                            arguments: call.arguments,
                        });

                    body.expression = resultTransform.object;
                }

                // x();
                else if (call.callee.type === "Identifier") {
                    const ident: IdentifierReference = call.callee;

                    if (!options.includedFunctions.includes(ident.name))
                        return void 0;

                    const resultTransform: TransformIdentResult =
                        await transformIdent({
                            id,
                            ident,
                            arguments: call.arguments,
                        });

                    body.expression = resultTransform.object;
                }
            }
        },
    });

    return {
        program: result,
    };
};

export type { PreprocessCallExprOptions, PreprocessCallExprResult };
export { preprocessCallExpr };
