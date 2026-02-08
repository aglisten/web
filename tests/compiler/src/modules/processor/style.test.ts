import type { CompilerContext } from "@aglisten/compiler/contexts/compiler";

import { parse } from "@aglisten/compiler/ast/parse";
import { createCompilerContext } from "@aglisten/compiler/contexts/compiler";
import { process } from "@aglisten/compiler/processor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCSS } from "#/functions/minify/css";

const file = "index.ts" as const;

describe("processor style tests", (): void => {
    it("should process the style function", (): void => {
        const code = `
            const container = {
                ${SIGNATURE}: true,
                id: "container",
                variable: "container",
                function: "style",
                arguments: [
                    {
                        display: "block",
                    },
                ],
            };
        ` as const;

        const output = `
            .djcd17uu {
                display: block;
            }
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

        const { css } = process({
            context,
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the style function with multiple nodes", (): void => {
        const code = `
            const container = {
                ${SIGNATURE}: true,
                id: "container",
                variable: "container",
                function: "style",
                arguments: [
                    {
                        display: "block",
                        color: "blue",
                    },
                ],
            };
        ` as const;

        const output = `
            .djcd17uu {
                display: block;
            }

            .ch8s1cdl {
                color: #0000ff;
            }
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

        const { css } = process({
            context,
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the style function with shorthand", (): void => {
        const code = `
            const display = "block" as const;

            const container = {
                ${SIGNATURE}: true,
                id: "container",
                variable: "container",
                function: "style",
                arguments: [
                    {
                        display,
                    },
                ],
            };
        ` as const;

        const output = `
            .djcd17uu {
                display: block;
            }
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

        const { css } = process({
            context,
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the style function with fallback value", (): void => {
        const code = `
            const container = {
                ${SIGNATURE}: true,
                id: "container",
                variable: "container",
                function: "style",
                arguments: [
                    {
                        display: [
                            "block",
                            "flex",
                        ],
                    },
                ],
            };
        ` as const;

        const output = `
            .djcd17uu {
                display: block;
            }

            .djcd1agm {
                display: flex;
            }
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

        const { css } = process({
            context,
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });
});
