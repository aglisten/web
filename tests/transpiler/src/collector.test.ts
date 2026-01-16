import type { Specifier } from "@aglisten/transpiler/collector";

import { parse } from "@aglisten/transpiler/ast/parse";
import { collect } from "@aglisten/transpiler/collector";
import { describe, expect, it } from "vitest";

describe("collector tests", (): void => {
    it("should collect the default namespace information", (): void => {
        const code = `
            import x from "p";

            x.y({
                display: "block",
            });
        ` as const;

        const { program } = parse({
            file: "index.ts",
            code,
        });

        const { isImported, namespaces, specifiers } = collect({
            program,
            packageName: "p",
            includedFunctions: [
                "y",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([
            "x",
        ]);
        expect(specifiers).toEqual([] satisfies Specifier[]);
    });

    it("should collect the namespace information", (): void => {
        const code = `
            import * as x from "p";

            x.y({
                display: "block",
            });
        ` as const;

        const { program } = parse({
            file: "index.ts",
            code,
        });

        const { isImported, namespaces, specifiers } = collect({
            program,
            packageName: "p",
            includedFunctions: [
                "y",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([
            "x",
        ]);
        expect(specifiers).toEqual([] satisfies Specifier[]);
    });

    it("should collect the specifier information", (): void => {
        const code = `
            import { x } from "p";

            x({
                display: "block",
            });
        ` as const;

        const { program } = parse({
            file: "index.ts",
            code,
        });

        const { isImported, namespaces, specifiers } = collect({
            program,
            packageName: "p",
            includedFunctions: [
                "x",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([]);
        expect(specifiers).toEqual([
            {
                imported: "x",
                local: "x",
            },
        ] satisfies Specifier[]);
    });
});
