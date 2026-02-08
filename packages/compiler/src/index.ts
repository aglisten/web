import type { Format } from "ts-vista";

import type { CodegenResult } from "#/ast/codegen";
import type { ParseResult } from "#/ast/parse";
import type { CompilerContext } from "#/contexts/compiler";
import type {
    BundleResult,
    DynamicBundleOptions,
    PresetBundleOptions,
    UserBundleOptions,
} from "#/modules/bundler";
import type { PreprocessResult } from "#/modules/preprocessor";
import type { ProcessResult } from "#/modules/processor";

import { codegen } from "#/ast/codegen";
import { parse } from "#/ast/parse";
import { createCompilerContext } from "#/contexts/compiler";
import { bundle } from "#/modules/bundler";
import { collect } from "#/modules/collector";
import { preprocess } from "#/modules/preprocessor";
import { process } from "#/modules/processor";

type PresetCompileOptions = PresetBundleOptions;

type UserCompileOptions = UserBundleOptions;

type DynamicCompileOptions = DynamicBundleOptions;

/**
 * The options for the `compile` function.
 */
type CompileOptions = Format<
    PresetCompileOptions & UserCompileOptions & DynamicCompileOptions
>;

/**
 * The result of the `compile` function.
 */
type CompileResult = {
    /**
     * The transpiled code.
     */
    code: string;
    /**
     * The CSS of the transpiled code.
     */
    css: string;
    /**
     * The CSS of the transpiled code that separated by elements.
     */
    cssList: string[];
};

const compile = async (
    options: CompileOptions,
): Promise<CompileResult | undefined> => {
    const parsed: ParseResult = parse({
        file: options.file,
        code: options.code,
    });

    const context: CompilerContext = createCompilerContext({
        file: options.file,
        program: parsed.program,
    });

    const { isImported, namespaces, specifiers } = collect({
        context,
        program: parsed.program,
        packageName: options.packageName,
        includedFunctions: options.includedFunctions,
    });

    if (!isImported) return void 0;

    const preprocessed: PreprocessResult = preprocess({
        context,
        program: parsed.program,
        namespaces,
        includedFunctions: options.includedFunctions,
        specifiers,
    });

    const codegenPreprocessed: CodegenResult = codegen({
        file: options.file,
        program: preprocessed.program,
    });

    const bundled: BundleResult = await bundle({
        // preset
        file: options.file,
        code: codegenPreprocessed.code,
        packageName: options.packageName,
        includedFunctions: options.includedFunctions,
        // user
        cwd: options.cwd,
        include: options.include,
        exclude: options.exclude,
    });

    const parsedbundle: ParseResult = parse({
        file: options.file,
        code: bundled.code,
    });

    const processed: ProcessResult = process({
        context,
        program: preprocessed.program,
        programRef: parsedbundle.program,
    });

    const codegenResult: CodegenResult = codegen({
        file: options.file,
        program: processed.program,
    });

    return {
        code: codegenResult.code,
        css: processed.css,
        cssList: processed.cssList,
    };
};

export type {
    PresetCompileOptions,
    UserCompileOptions,
    DynamicCompileOptions,
    CompileOptions,
    CompileResult,
};
export { compile };
