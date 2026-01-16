import type { MinifyResult } from "oxc-minify";

import { codegen } from "@aglisten/transpiler/ast/codegen";
import { parse } from "@aglisten/transpiler/ast/parse";
import { preprocess } from "@aglisten/transpiler/preprocessor";
import { describe, expect, it } from "vitest";

import { minify } from "#/functions/minify";

describe("preprocessor tests", (): void => {
    it("should preprocess the call expression", (): void => {
        const file = "index.ts" as const;

        const code = `
            import { x } from "p";

            x({
                display: "block",
            });
        ` as const;

        const output = `
            import { x } from "p";

            const _aglisten_ce_1 = {
                _aglisten: true,
                id: "_aglisten_ce_1",
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

    it("should preprocess the variable declaration", (): void => {
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
                _aglisten: true,
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
