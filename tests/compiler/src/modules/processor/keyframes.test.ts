import type { CompilerContext } from "@ammolite/compiler/contexts/compiler";

import { parse } from "@ammolite/compiler/ast/parse";
import { createCompilerContext } from "@ammolite/compiler/contexts/compiler";
import { process } from "@ammolite/compiler/processor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCSS } from "#/functions/minify/css";

const file = "index.ts" as const;

describe("processor keyframes tests", (): void => {
    it("should process the keyframes function", (): void => {
        const code = `
            const kf = {
                ${SIGNATURE}: true,
                id: "kf",
                variable: "kf",
                function: "keyframes",
                arguments: [
                    {
                        0: {
                            transform: "rotate(0deg)",
                        },
                        100: {
                            transform: "rotate(360deg)",
                        },
                    },
                ],
            };
        ` as const;

        const output = `
            @keyframes k5mwsoq0 {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
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

        expect(
            minifyCSS({
                source: css,
            }).code,
        ).toBe(
            minifyCSS({
                source: output,
            }).code,
        );
    });

    it("should process the keyframes function with string key", (): void => {
        const code = `
            const kf = {
                ${SIGNATURE}: true,
                id: "kf",
                variable: "kf",
                function: "keyframes",
                arguments: [
                    {
                        "0%": {
                            transform: "rotate(0deg)",
                        },
                        "100%": {
                            transform: "rotate(360deg)",
                        },
                    },
                ],
            };
        ` as const;

        const output = `
            @keyframes k5mwsoq0 {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
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

        expect(
            minifyCSS({
                source: css,
            }).code,
        ).toBe(
            minifyCSS({
                source: output,
            }).code,
        );
    });

    it("should process the keyframes function with from and to", (): void => {
        const code = `
            const kf = {
                ${SIGNATURE}: true,
                id: "kf",
                variable: "kf",
                function: "keyframes",
                arguments: [
                    {
                        from: {
                            transform: "rotate(0deg)",
                        },
                        to: {
                            transform: "rotate(360deg)",
                        },
                    },
                ],
            };
        ` as const;

        const output = `
            @keyframes k1p6vae2 {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
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

        expect(
            minifyCSS({
                source: css,
            }).code,
        ).toBe(
            minifyCSS({
                source: output,
            }).code,
        );
    });

    it("should process the keyframes function with external value", (): void => {
        const code = `
            const zero = "rotate(0deg)" as const;

            const kf = {
                ${SIGNATURE}: true,
                id: "kf",
                variable: "kf",
                function: "keyframes",
                arguments: [
                    {
                        0: {
                            transform: zero,
                        },
                        100: {
                            transform: "rotate(360deg)",
                        },
                    },
                ],
            };
        ` as const;

        const output = `
            @keyframes k5mwsoq0 {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
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

        expect(
            minifyCSS({
                source: css,
            }).code,
        ).toBe(
            minifyCSS({
                source: output,
            }).code,
        );
    });

    it("should process the keyframes function with shorthand", (): void => {
        const code = `
            const transform = "rotate(0deg)" as const;

            const kf = {
                ${SIGNATURE}: true,
                id: "kf",
                variable: "kf",
                function: "keyframes",
                arguments: [
                    {
                        0: {
                            transform,
                        },
                        100: {
                            transform: "rotate(360deg)",
                        },
                    },
                ],
            };
        ` as const;

        const output = `
            @keyframes k5mwsoq0 {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
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

        expect(
            minifyCSS({
                source: css,
            }).code,
        ).toBe(
            minifyCSS({
                source: output,
            }).code,
        );
    });
});
