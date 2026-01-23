import type { Format } from "ts-vista";

import type { CodegenResult } from "#/ast/codegen";
import type { ParseResult } from "#/ast/parse";
import type {
    BundleResult,
    PresetBundleOptions,
    UserBundleOptions,
} from "#/modules/bundler";
import type { PreprocessResult } from "#/modules/preprocessor";
import type { ProcessResult } from "#/modules/processor";

import { codegen } from "#/ast/codegen";
import { parse } from "#/ast/parse";
import { bundle } from "#/modules/bundler";
import { collect } from "#/modules/collector";
import { preprocess } from "#/modules/preprocessor";
import { process } from "#/modules/processor";

type TranspileOptions = Format<PresetBundleOptions & UserBundleOptions>;

type TranspileResult = {
    /**
     * The transpiled code.
     */
    code: string;
};

const transpile = async (
    options: TranspileOptions,
): Promise<TranspileResult | undefined> => {
    const parsed: ParseResult = parse({
        file: options.file,
        code: options.code,
    });

    const { isImported, namespaces, specifiers } = collect({
        program: parsed.program,
        packageName: options.packageName,
        includedFunctions: options.includedFunctions,
    });

    if (!isImported) return void 0;

    const preprocessed: PreprocessResult = preprocess({
        program: parsed.program,
        namespaces,
        includedFunctions: options.includedFunctions,
        specifiers,
    });

    const bundled: BundleResult = await bundle({
        // preset
        file: options.file,
        code: options.code,
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
        program: preprocessed.program,
        programRef: parsedbundle.program,
    });

    const codegenResult: CodegenResult = codegen({
        file: options.file,
        program: processed.program,
    });

    return {
        code: codegenResult.code,
    };
};

export type { TranspileOptions, TranspileResult };
export { transpile };
