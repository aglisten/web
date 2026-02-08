import type { CompilerContext } from "@aglisten/compiler/contexts/compiler";

import type { MinifyCodeResult } from "#/functions/minify/code";

import { codegen } from "@aglisten/compiler/ast/codegen";
import { parse } from "@aglisten/compiler/ast/parse";
import { createCompilerContext } from "@aglisten/compiler/contexts/compiler";
import { preprocess } from "@aglisten/compiler/preprocessor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCode } from "#/functions/minify/code";

const file = "index.ts" as const;

describe("preprocessor call expression tests (default namespace)", (): void => {
    it("should preprocess the function", (): void => {
        const code = `
            import x from "p";

            x.y({
                display: "block",
            });
        ` as const;

        const output = `
            import x from "p";

            const call_1 = {
                ${SIGNATURE}: true,
                id: "call_1",
                variable: "call_1",
                function: "y",
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
            namespaces: [
                "x",
            ],
            includedFunctions: [
                "y",
            ],
            specifiers: [],
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
            import x from "p";

            x.y("html", {
                display: "block",
            });
        ` as const;

        const output = `
            import x from "p";

            const call_1 = {
                ${SIGNATURE}: true,
                id: "call_1",
                variable: "call_1",
                function: "y",
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
            namespaces: [
                "x",
            ],
            includedFunctions: [
                "y",
            ],
            specifiers: [],
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
