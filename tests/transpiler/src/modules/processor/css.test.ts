import { parse } from "@aglisten/transpiler/ast/parse";
import { process } from "@aglisten/transpiler/processor";
import { describe, expect, it } from "vitest";

import { SIGNATURE } from "#/consts";
import { minifyCSS } from "#/functions/minify/css";

describe("processor css tests", (): void => {
    it("should process the css function in literal", (): void => {
        const file = "index.ts" as const;

        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "css",
                arguments: [
                    "html { background-color: red; }",
                ],
            };
        ` as const;

        const output = `html{background-color:red}` as const;

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

    it("should process the css function in literal template", (): void => {
        const file = "index.ts" as const;

        const code = `
            const ${SIGNATURE}_ce_1 = {
                ${SIGNATURE}: true,
                id: "${SIGNATURE}_ce_1",
                kind: "css",
                arguments: [
                    \`
                        html {
                            background-color: red;    
                        }
                    \`,
                ],
            };
        ` as const;

        const output = `html{background-color:red}` as const;

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
