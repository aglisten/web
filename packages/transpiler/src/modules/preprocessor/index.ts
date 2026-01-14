import type { Program } from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { PreprocessCallExprResult } from "#/modules/preprocessor/preprocess/call-expr";
import type { PreprocessVarDeclResult } from "#/modules/preprocessor/preprocess/var-decl";

import { preprocessCallExpr } from "#/modules/preprocessor/preprocess/call-expr";
import { preprocessVarDecl } from "#/modules/preprocessor/preprocess/var-decl";

type PreprocessOptions = {
    program: Program;
    namespaces: string[];
    includedFunctions: string[];
    specifiers: Specifier[];
};

type PreprocessResult = {
    program: Program;
};

const preprocess = async (
    options: PreprocessOptions,
): Promise<PreprocessResult> => {
    const resultCallExpr: PreprocessCallExprResult = await preprocessCallExpr({
        program: options.program,
        namespaces: options.namespaces,
        includedFunctions: options.includedFunctions,
        specifiers: options.specifiers,
    });

    const resultVarDecl: PreprocessVarDeclResult = await preprocessVarDecl({
        program: resultCallExpr.program,
        namespaces: options.namespaces,
        includedFunctions: options.includedFunctions,
        specifiers: options.specifiers,
    });

    return {
        program: resultVarDecl.program,
    };
};

export type { PreprocessOptions, PreprocessResult };
export { preprocess };
