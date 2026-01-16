import type {
    CallExpression,
    Directive,
    IdentifierReference,
    MemberExpression,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { TransformIdentResult } from "#/modules/preprocessor/preprocess/transform/ident";
import type { TransformMemberExprResult } from "#/modules/preprocessor/preprocess/transform/member";

import { cloneDeep } from "es-toolkit";

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

const preprocessVarDecl = (
    options: PreprocessVarDeclOptions,
): PreprocessVarDeclResult => {
    const result: Program = cloneDeep(options.program);

    for (let i: number = 0; i < result.body.length; i++) {
        const body: Directive | Statement | undefined = result.body[i];

        if (!body) continue;

        if (body.type !== "VariableDeclaration") continue;

        for (let j: number = 0; j < body.declarations.length; j++) {
            const decl: VariableDeclarator | undefined = body.declarations[j];

            if (!decl) continue;

            if (!decl.init) continue;

            if (decl.init.type !== "CallExpression") continue;

            const call: CallExpression = decl.init;

            const id: string =
                decl.id.type === "Identifier"
                    ? decl.id.name
                    : `${SIGNATURE}_vd_${i}_${j}`;

            // const abc = x.y();
            if (call.callee.type === "MemberExpression") {
                const member: MemberExpression = call.callee;

                if (member.object.type !== "Identifier") continue;

                if (!options.namespaces.includes(member.object.name)) continue;

                if (member.property.type !== "Identifier") continue;

                if (!options.includedFunctions.includes(member.property.name))
                    continue;

                const resultTransform: TransformMemberExprResult =
                    transformMemberExpr({
                        id,
                        member,
                        arguments: call.arguments,
                    });

                decl.init = resultTransform.object;
            }

            // const abc = x();
            else if (call.callee.type === "Identifier") {
                const ident: IdentifierReference = call.callee;

                if (!options.includedFunctions.includes(ident.name)) continue;

                const resultTransform: TransformIdentResult = transformIdent({
                    id,
                    ident,
                    arguments: call.arguments,
                });

                decl.init = resultTransform.object;
            }
        }
    }

    return {
        program: result,
    };
};

export type { PreprocessVarDeclOptions, PreprocessVarDeclResult };
export { preprocessVarDecl };
