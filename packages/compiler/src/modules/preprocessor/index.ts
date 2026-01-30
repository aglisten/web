import type { Program } from "oxc-parser";
import type { Format, Partial } from "ts-vista";

import type { Specifier } from "#/@types/specifier";
import type { PreprocessCallExprResult } from "#/modules/preprocessor/preprocess/call-expr";
import type { PreprocessVarDeclResult } from "#/modules/preprocessor/preprocess/var-decl";

import { preprocessCallExpr } from "#/modules/preprocessor/preprocess/call-expr";
import { preprocessVarDecl } from "#/modules/preprocessor/preprocess/var-decl";

type CompletePreprocessOptions = {
    /**
     * Whether enabling test mode.
     */
    test: boolean;
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
 * Options for the `preprocess` function.
 */
type PreprocessOptions = Format<Partial<CompletePreprocessOptions, "test">>;

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
    const test: boolean =
        typeof options.test === "boolean" ? options.test : false;

    const resultCallExpr: PreprocessCallExprResult = preprocessCallExpr({
        test,
        program: options.program,
        namespaces: options.namespaces,
        includedFunctions: options.includedFunctions,
        specifiers: options.specifiers,
    });

    const resultVarDecl: PreprocessVarDeclResult = preprocessVarDecl({
        test,
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
