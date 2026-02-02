import type { Program } from "oxc-parser";

import type { Specifier } from "#/@types/specifier";
import type { CompilerContext } from "#/contexts/compiler";
import type { PreprocessCallExprResult } from "#/modules/preprocessor/preprocess/call-expr";
import type { PreprocessVarDeclResult } from "#/modules/preprocessor/preprocess/var-decl";

import { preprocessCallExpr } from "#/modules/preprocessor/preprocess/call-expr";
import { preprocessVarDecl } from "#/modules/preprocessor/preprocess/var-decl";

/**
 * Options for the `preprocess` function.
 */
type PreprocessOptions = {
    /**
     * Compiler context.
     */
    context: CompilerContext;
    /**
     * Program to preprocess.
     */
    program: Program;
    /**
     * Namespaces used by the CSS-in-JS package.
     */
    namespaces: readonly string[];
    /**
     * CSS-in-JS package functions to be preprocessed.
     */
    includedFunctions: readonly string[];
    /**
     * Specifiers used by the CSS-in-JS package.
     */
    specifiers: readonly Specifier[];
};

/**
 * Result of the `preprocess` function.
 */
type PreprocessResult = {
    program: Program;
};

/**
 * Preprocess function.
 */
const preprocess = (options: PreprocessOptions): PreprocessResult => {
    const resultCallExpr: PreprocessCallExprResult = preprocessCallExpr({
        context: options.context,
        program: options.program,
        namespaces: options.namespaces,
        includedFunctions: options.includedFunctions,
        specifiers: options.specifiers,
    });

    const resultVarDecl: PreprocessVarDeclResult = preprocessVarDecl({
        context: options.context,
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
