import type { MinifyCodeResult } from "#/functions/minify/code";

import { codegen } from "@aglisten/transpiler/ast/codegen";
import { parse } from "@aglisten/transpiler/ast/parse";
import { preprocess } from "@aglisten/transpiler/preprocessor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCode } from "#/functions/minify/code";

describe("preprocessor variable declaration tests (specifier)", (): void => {
    it("should preprocess the function", (): void => {
        const file = "index.ts" as const;

        const code = `
            import { x } from "p";

            const block = x({
                display: "block",
            });
        ` as const;

        const output = `
            import { x } from "p";

            const block = {
                ${SIGNATURE}: true,
                id: "block",
                kind: "x",
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

        const { program: preprocessed } = preprocess({
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
        const file = "index.ts" as const;

        const code = `
            import { x } from "p";

            const block = x("html", {
                display: "block",
            });
        ` as const;

        const output = `
            import { x } from "p";

            const block = {
                ${SIGNATURE}: true,
                id: "block",
                kind: "x",
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

        const { program: preprocessed } = preprocess({
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
