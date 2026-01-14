import type {
    CallExpression,
    Directive,
    IdentifierReference,
    MemberExpression,
    Node,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { TransformIdentResult } from "#/modules/preprocessor/preprocess/transform/ident";
import type { TransformMemberExprResult } from "#/modules/preprocessor/preprocess/transform/member";

import { cloneDeep } from "es-toolkit";
import { walk } from "oxc-walker";

import { SIGNATURE } from "#/consts";
import { transformIdent } from "#/modules/preprocessor/preprocess/transform/ident";
import { transformMemberExpr } from "#/modules/preprocessor/preprocess/transform/member";

type PreprocessVarDeclOptions = {
    program: Program;
    namespaces: string[];
    includedFunctions: string[];
    specifiers: Specifier[];
};

type PreprocessVarDeclResult = {
    program: Program;
};

const preprocessVarDecl = async (
    options: PreprocessVarDeclOptions,
): Promise<PreprocessVarDeclResult> => {
    const result: Program = cloneDeep(options.program);

    walk(result, {
        enter: async (node: Node): Promise<void> => {
            if (node.type !== "Program") return void 0;

            for (let i: number = 0; i < node.body.length; i++) {
                const body: Directive | Statement | undefined = node.body[i];

                if (!body) return void 0;

                if (body.type !== "VariableDeclaration") return void 0;

                for (let j: number = 0; j < body.declarations.length; j++) {
                    const decl: VariableDeclarator | undefined =
                        body.declarations[j];

                    if (!decl) return void 0;

                    if (!decl.init) return void 0;

                    if (decl.init.type !== "CallExpression") return void 0;

                    const call: CallExpression = decl.init;

                    const id: string =
                        decl.id.type === "Identifier"
                            ? decl.id.name
                            : `${SIGNATURE}_vd_${i}_${j}`;

                    // const abc = x.y();
                    if (call.callee.type === "MemberExpression") {
                        const member: MemberExpression = call.callee;

                        if (member.object.type !== "Identifier") return void 0;

                        if (!options.namespaces.includes(member.object.name))
                            return void 0;

                        if (member.property.type !== "Identifier")
                            return void 0;

                        if (
                            !options.includedFunctions.includes(
                                member.property.name,
                            )
                        )
                            return void 0;

                        const resultTransform: TransformMemberExprResult =
                            await transformMemberExpr({
                                id,
                                member,
                                arguments: call.arguments,
                            });

                        decl.init = resultTransform.object;
                    }

                    // const abc = x();
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

                        decl.init = resultTransform.object;
                    }
                }
            }
        },
    });

    return {
        program: result,
    };
};

export type { PreprocessVarDeclOptions, PreprocessVarDeclResult };
export { preprocessVarDecl };
