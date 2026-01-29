import type { Specifier } from "@aglisten/compiler/collector";

import { parse } from "@aglisten/compiler/ast/parse";
import { collect } from "@aglisten/compiler/collector";
import { describe, expect, it } from "vitest";

const file = "index.ts" as const;

describe("collector tests (specifier, cjs)", (): void => {
    it("should collect the information", (): void => {
        const code = `
            const { x, y } = require("p");

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
            const { x, y: z } = require("p");

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

    it("should collect the spread information", (): void => {
        const code = `
            const { x, ...y } = require("p");

            x.y({
                display: "block",
            });

            y.z({
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
                "y",
                "z",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([
            "y",
        ]);
        expect(specifiers).toEqual([
            {
                imported: "x",
                local: "x",
            },
        ] satisfies Specifier[]);
    });
});
