import type { CompilerContext } from "@ammolite/compiler/contexts/compiler";

import type { MinifyCodeResult } from "#/functions/minify/code";

import { codegen } from "@ammolite/compiler/ast/codegen";
import { parse } from "@ammolite/compiler/ast/parse";
import { createCompilerContext } from "@ammolite/compiler/contexts/compiler";
import { preprocess } from "@ammolite/compiler/preprocessor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCode } from "#/functions/minify/code";

const file = "index.ts" as const;

describe("preprocessor call expression tests (specifier)", (): void => {
    it("should preprocess the function", (): void => {
        const code = `
            import { x } from "p";

            x({
                display: "block",
            });
        ` as const;

        const output = `
            import { x } from "p";

            const call_1 = {
                ${SIGNATURE}: true,
                id: "call_1",
                variable: "call_1",
                function: "x",
                arguments: [
                    {
                        display: "block",
                    },
                ],
            };
        ` as const;

        const { program } = parse({
            file,
            code,
        });

        const context: CompilerContext = createCompilerContext({
            test: true,
            file,
            program,
        });

        const { program: preprocessed } = preprocess({
            context,
            program,
            namespaces: [],
            includedFunctions: [
                "x",
            ],
            specifiers: [
                {
                    imported: "x",
                    local: "x",
                },
            ],
        });

        const preprocessedMinify: MinifyCodeResult = minifyCode(
            file,
            codegen({
                file,
                program: preprocessed,
            }).code,
        );

        const outputMinify: MinifyCodeResult = minifyCode(file, output);

        expect(preprocessedMinify.code).toBe(outputMinify.code);
    });

    it("should preprocess the function with multiple arguments", (): void => {
        const code = `
            import { x } from "p";

            x("html", {
                display: "block",
            });
        ` as const;

        const output = `
            import { x } from "p";

            const call_1 = {
                ${SIGNATURE}: true,
                id: "call_1",
                variable: "call_1",
                function: "x",
                arguments: [
                    "html",
                    {
                        display: "block",
                    },
                ],
            };
        ` as const;

        const { program } = parse({
            file,
            code,
        });

        const context: CompilerContext = createCompilerContext({
            test: true,
            file,
            program,
        });

        const { program: preprocessed } = preprocess({
            context,
            program,
            namespaces: [],
            includedFunctions: [
                "x",
            ],
            specifiers: [
                {
                    imported: "x",
                    local: "x",
                },
            ],
        });

        const preprocessedMinify: MinifyCodeResult = minifyCode(
            file,
            codegen({
                file,
                program: preprocessed,
            }).code,
        );

        const outputMinify: MinifyCodeResult = minifyCode(file, output);

        expect(preprocessedMinify.code).toBe(outputMinify.code);
    });
});
