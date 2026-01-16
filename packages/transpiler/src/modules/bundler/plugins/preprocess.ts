import type { Plugin, TransformResult } from "rolldown";

import type { CodegenResult } from "#/ast/codegen";
import type { ParseResult } from "#/ast/parse";
import type { PreprocessResult } from "#/modules/preprocessor";

import { codegen } from "#/ast/codegen";
import { parse } from "#/ast/parse";
import { collect } from "#/modules/collector";
import { preprocess } from "#/modules/preprocessor";

type FilePreprocessorOptions = {
    packageName: string;
    file: string;
    includedFunctions: string[];
};

const filePreprocessor = (options: FilePreprocessorOptions): Plugin => {
    return {
        name: "@aglisten/transpiler/file-preprocessor",
        transform: (code: string, file: string): TransformResult => {
            // avoid duplicated preprocess
            if (file === options.file) return void 0;

            const parseResult: ParseResult = parse({
                file,
                code,
            });

            const { isImported, namespaces, specifiers } = collect({
                program: parseResult.program,
                packageName: options.packageName,
                includedFunctions: options.includedFunctions,
            });

            if (!isImported) return void 0;

            const preprocessed: PreprocessResult = preprocess({
                program: parseResult.program,
                namespaces,
                includedFunctions: options.includedFunctions,
                specifiers,
            });

            const codegenResult: CodegenResult = codegen({
                file,
                program: preprocessed.program,
            });

            return {
                code: codegenResult.code,
                map: codegenResult.map,
            };
        },
    };
};

export type { FilePreprocessorOptions };
export { filePreprocessor };
