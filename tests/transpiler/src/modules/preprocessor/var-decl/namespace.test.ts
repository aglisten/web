import type { MinifyResult } from "oxc-minify";

import { codegen } from "@aglisten/transpiler/ast/codegen";
import { parse } from "@aglisten/transpiler/ast/parse";
import { preprocess } from "@aglisten/transpiler/preprocessor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minify } from "#/functions/minify";

describe("preprocessor variable declaration tests (namespace)", (): void => {
    it("should preprocess the function", (): void => {
        const file = "index.ts" as const;

        const code = `
            import * as x from "p";

            const block = x.y({
                display: "block",
            });
        ` as const;

        const output = `
            import * as x from "p";

            const block = {
                ${SIGNATURE}: true,
                id: "block",
                kind: "y",
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
            namespaces: [
                "x",
            ],
            includedFunctions: [
                "y",
            ],
            specifiers: [],
        });

        const preprocessedMinify: MinifyResult = minify(
            file,
            codegen({
                file,
                program: preprocessed,
            }).code,
        );

        const outputMinify: MinifyResult = minify(file, output);

        expect(preprocessedMinify.code).toBe(outputMinify.code);
    });

    it("should preprocess the function with multiple arguments", (): void => {
        const file = "index.ts" as const;

        const code = `
            import * as x from "p";

            const block = x.y("html", {
                display: "block",
            });
        ` as const;

        const output = `
            import * as x from "p";

            const block = {
                ${SIGNATURE}: true,
                id: "block",
                kind: "y",
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
            namespaces: [
                "x",
            ],
            includedFunctions: [
                "y",
            ],
            specifiers: [],
        });

        const preprocessedMinify: MinifyResult = minify(
            file,
            codegen({
                file,
                program: preprocessed,
            }).code,
        );

        const outputMinify: MinifyResult = minify(file, output);

        expect(preprocessedMinify.code).toBe(outputMinify.code);
    });
});
