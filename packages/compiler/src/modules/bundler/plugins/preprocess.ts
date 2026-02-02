import type { Plugin, TransformResult } from "rolldown";

import type { CodegenResult } from "#/ast/codegen";
import type { ParseResult } from "#/ast/parse";
import type { CompilerContext } from "#/contexts/compiler";
import type { PreprocessResult } from "#/modules/preprocessor";

import * as Path from "node:path";

import { codegen } from "#/ast/codegen";
import { parse } from "#/ast/parse";
import { createCompilerContext } from "#/contexts/compiler";
import { collect } from "#/modules/collector";
import { preprocess } from "#/modules/preprocessor";

type FilePreprocessorOptions = {
    packageName: string;
    file: string;
    includedFunctions: string[] | readonly string[];
};

const filePreprocessor = (options: FilePreprocessorOptions): Plugin => {
    return {
        name: "@aglisten/transpiler/file-preprocessor",
        transform: (code: string, file: string): TransformResult => {
            // avoid duplicated preprocess
            if (Path.resolve(file) === Path.resolve(options.file))
                return void 0;

            const parseResult: ParseResult = parse({
                file,
                code,
            });

            const context: CompilerContext = createCompilerContext({
                file,
                program: parseResult.program,
            });

            const { isImported, namespaces, specifiers } = collect({
                context,
                program: parseResult.program,
                packageName: options.packageName,
                includedFunctions: options.includedFunctions,
            });

            if (!isImported) return void 0;

            const preprocessed: PreprocessResult = preprocess({
                context,
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
