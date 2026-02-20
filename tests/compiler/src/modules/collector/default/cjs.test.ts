import type { Specifier } from "@ammolite/compiler/collector";
import type { CompilerContext } from "@ammolite/compiler/contexts/compiler";

import { parse } from "@ammolite/compiler/ast/parse";
import { collect } from "@ammolite/compiler/collector";
import { createCompilerContext } from "@ammolite/compiler/contexts/compiler";
import { describe, expect, it } from "vitest";

const file = "index.ts" as const;

describe("collector tests (default namespace, cjs)", (): void => {
    it("should collect the information", (): void => {
        const code = `
            const x = require("p");

            x.y({
                display: "block",
            });

            x.z({
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
                "y",
                "z",
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([
            "x",
        ]);
        expect(specifiers).toEqual([] satisfies Specifier[]);
    });
});
