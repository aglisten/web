import type {
    Directive,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";

import { cloneDeep } from "es-toolkit";

import { createEmptyVarDecl } from "#/modules/processor/functions/empty-var-decl";
import { getInfo } from "#/modules/processor/functions/get-info";

type MutateCssOptions = {
    program: Program;
};

type MutateCssResult = {
    program: Program;
};

const mutateCss = (options: MutateCssOptions): MutateCssResult => {
    const program: Program = cloneDeep(options.program);

    for (let i: number = 0; i < program.body.length; i++) {
        const body: Directive | Statement | undefined = program.body[i];

        if (!body) continue;

        if (body.type !== "VariableDeclaration") continue;

        for (let j: number = 0; j < body.declarations.length; j++) {
            const decl: VariableDeclarator | undefined = body.declarations[j];

            if (!decl) continue;

            const info: GetInfoResult | undefined = getInfo({
                decl,
            });

            if (!info) continue;

            if (info.kind !== "css") continue;

            body.declarations[j] = createEmptyVarDecl({
                id: info.id,
            });
        }
    }

    return {
        program,
    };
};

export type { MutateCssOptions, MutateCssResult };
export { mutateCss };
