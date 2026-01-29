import type { Specifier } from "@aglisten/transpiler/collector";

import { parse } from "@aglisten/transpiler/ast/parse";
import { collect } from "@aglisten/transpiler/collector";
import { describe, expect, it } from "vitest";

const file = "index.ts" as const;

describe("collector tests (specifier, esm)", (): void => {
    it("should collect the information", (): void => {
        const code = `
            import { x, y } from "p";

            x({
                display: "block",
            });

            y({
                display: "block",
            });
        ` as const;

        const { program } = parse({
            file,
            code,
        });

        const { isImported, namespaces, specifiers } = collect({
            program,
            packageName: "p",
            includedFunctions: [
                "x",
                "y",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([]);
        expect(specifiers).toEqual([
            {
                imported: "x",
                local: "x",
            },
            {
                imported: "y",
                local: "y",
            },
        ] satisfies Specifier[]);
    });

    it("should collect the information with alias", (): void => {
        const code = `
            import { x, y as z } from "p";

            x({
                display: "block",
            });

            z({
                display: "block",
            });
        ` as const;

        const { program } = parse({
            file,
            code,
        });

        const { isImported, namespaces, specifiers } = collect({
            program,
            packageName: "p",
            includedFunctions: [
                "x",
                "y",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([]);
        expect(specifiers).toEqual([
            {
                imported: "x",
                local: "x",
            },
            {
                imported: "y",
                local: "z",
            },
        ] satisfies Specifier[]);
    });
});
