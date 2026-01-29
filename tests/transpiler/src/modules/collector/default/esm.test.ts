import type { Specifier } from "@aglisten/transpiler/collector";

import { parse } from "@aglisten/transpiler/ast/parse";
import { collect } from "@aglisten/transpiler/collector";
import { describe, expect, it } from "vitest";

const file = "index.ts" as const;

describe("collector tests (default namespace, esm)", (): void => {
    it("should collect the information", (): void => {
        const code = `
            import x from "p";

            x.y({
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
            ],
        });

        expect(isImported).toBe(true);
        expect(namespaces).toEqual([
            "x",
        ]);
        expect(specifiers).toEqual([] satisfies Specifier[]);
    });
});
