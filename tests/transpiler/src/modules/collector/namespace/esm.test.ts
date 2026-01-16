import type { Specifier } from "@aglisten/transpiler/collector";

import { parse } from "@aglisten/transpiler/ast/parse";
import { collect } from "@aglisten/transpiler/collector";
import { describe, expect, it } from "vitest";

describe("collector tests (namespace, esm)", (): void => {
    it("should collect the information", (): void => {
        const code = `
            import * as x from "p";

            x.y({
                display: "block",
            });

            x.z({
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
