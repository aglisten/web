import type { Specifier } from "@ammolite/compiler/collector";
import type { CompilerContext } from "@ammolite/compiler/contexts/compiler";

import { parse } from "@ammolite/compiler/ast/parse";
import { collect } from "@ammolite/compiler/collector";
import { createCompilerContext } from "@ammolite/compiler/contexts/compiler";
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

        const context: CompilerContext = createCompilerContext({
            test: true,
            file,
            program,
        });

        const { isImported, namespaces, specifiers } = collect({
            context,
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

        const context: CompilerContext = createCompilerContext({
            test: true,
            file,
            program,
        });

        const { isImported, namespaces, specifiers } = collect({
            context,
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
