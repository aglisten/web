import type { Program } from "oxc-parser";
import type { Format, Partial } from "ts-vista";

import type { CodegenResult } from "#/ast/codegen";

import { version } from "package.json";

import { codegen } from "#/ast/codegen";

type CreateCompilerContextBaseOptions = {
    /**
     * Whether in test mode.
     */
    test: boolean;
    /**
     * Current file.
     */
    file: string;
};

type CreateCompilerContextCodeOptions = Format<
    CreateCompilerContextBaseOptions & {
        /**
         * Current file code.
         */
        code: string;
    }
>;

type CreateCompilerContextProgramOptions = Format<
    CreateCompilerContextBaseOptions & {
        /**
         * Current file program.
         */
        program: Program;
    }
>;

/**
 * Options for `createCompilerContext` function.
 */
type CompleteCreateCompilerContextOptions =
    | CreateCompilerContextCodeOptions
    | CreateCompilerContextProgramOptions;

type CreateCompilerContextOptions = Format<
    Partial<CompleteCreateCompilerContextOptions, "test">
>;

/**
 * Compiler context.
 */
type CompilerContext = {
    /**
     * Compiler version.
     */
    version: string;
    /**
     * Whether in test mode.
     */
    isTest: boolean;
    /**
     * Current file.
     */
    file: string;
    /**
     * Current file code.
     */
    code: string;
};

const createCompilerContext = (
    options: CreateCompilerContextOptions,
): CompilerContext => {
    const isTest: boolean = options.test ?? false;

    if ("code" in options) {
        return {
            version,
            isTest,
            file: options.file,
            code: options.code,
        };
    }

    const codegenResult: CodegenResult = codegen({
        file: options.file,
        program: options.program,
    });

    return {
        version,
        isTest,
        file: options.file,
        code: codegenResult.code,
    };
};

type UpdateCompilerContextCodeOptions = Format<
    Partial<
        CreateCompilerContextBaseOptions & {
            /**
             * Current file code.
             */
            code: string;
        }
    >
>;

type UpdateCompilerContextProgramOptions = Format<
    Partial<
        CreateCompilerContextBaseOptions & {
            /**
             * Current file program.
             */
            program: Program;
        }
    >
>;

type UpdateCompilerContextOptions = Format<
    UpdateCompilerContextCodeOptions | UpdateCompilerContextProgramOptions
>;

const updateCompilerContext = (
    context: CompilerContext,
    options: UpdateCompilerContextOptions,
): CompilerContext => {
    let result: CompilerContext = context;

    if (options.file) {
        result = {
            ...result,
            file: options.file,
        };
    }

    if ("code" in options && options.code) {
        result = {
            ...result,
            code: options.code,
        };
    }

    if ("program" in options && options.program) {
        const codegenResult: CodegenResult = codegen({
            file: context.file ?? options.file,
            program: options.program,
        });

        return {
            ...context,
            code: codegenResult.code,
        };
    }

    if (typeof options.test === "boolean") {
        result = {
            ...result,
            isTest: options.test,
        };
    }

    return result;
};

export type { CreateCompilerContextOptions, CompilerContext };
export { createCompilerContext, updateCompilerContext };
