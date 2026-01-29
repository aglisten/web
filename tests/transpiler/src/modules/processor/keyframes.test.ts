import { parse } from "@aglisten/transpiler/ast/parse";
import { process } from "@aglisten/transpiler/processor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCSS } from "#/functions/minify/css";

const file = "index.ts" as const;

describe("processor keyframes tests", (): void => {
    it("should process the keyframes function", (): void => {
        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "keyframes",
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

        const { css } = process({
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the keyframes function with string key", (): void => {
        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "keyframes",
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

        const { css } = process({
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the keyframes function with from and to", (): void => {
        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "keyframes",
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

        const { css } = process({
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the keyframes function with external value", (): void => {
        const code = `
            const zero = "rotate(0deg)" as const;

            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "keyframes",
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

        const { css } = process({
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the keyframes function with shorthand", (): void => {
        const code = `
            const transform = "rotate(0deg)" as const;

            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "keyframes",
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

        const { css } = process({
            program,
            programRef: program,
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });
});
