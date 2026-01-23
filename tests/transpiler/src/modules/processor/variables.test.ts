import { parse } from "@aglisten/transpiler/ast/parse";
import { process } from "@aglisten/transpiler/processor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCSS } from "#/functions/minify/css";

describe("processor variables tests", (): void => {
    it("should process the variables function", (): void => {
        const file = "index.ts" as const;

        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "variables",
                arguments: [
                    {
                        blue: "#0000ff",
                    },
                ],
            };
        ` as const;

        const output = `:root{--vg71dl:#00f}` as const;

        const { program } = parse({
            file,
            code,
        });

        const { css } = process({
            program,
            programRef: program,
            classNamePrefix: "",
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });

    it("should process the variables function with multiple type of selectors", (): void => {
        const file = "index.ts" as const;

        const code = `
            const htmlMax = "html[theme=max]";
            const htmlDark = "html[theme=dark]" as const;

            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "variables",
                arguments: [
                    {
                        blue: {
                            default: "#90d5ff",
                            [htmlMax]: "#0000ff",
                            [htmlDark]: "#111184",
                        },
                    },
                ],
            };
        ` as const;

        const output =
            `:root{--vg71dl:#90d5ff}html[theme=max]{--vg71dl:#0000ff}html[theme=dark]{--vg71dl:#111184}` as const;

        const { program } = parse({
            file,
            code,
        });

        const { css } = process({
            program,
            programRef: program,
            classNamePrefix: "",
        });

        expect(minifyCSS(file, css).code).toBe(minifyCSS(file, output).code);
    });
});
