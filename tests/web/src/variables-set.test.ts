import type { VariablesSetter } from "ammolite";

import { setVariables } from "ammolite";
import { describe, expect, it } from "vitest";

describe("web setVariables tests", (): void => {
    it("should set variable", (): void => {
        const colors = {
            blue: "var(--abc)",
        };

        const result: VariablesSetter = setVariables(colors, {
            blue: "#0000ff",
        });

        expect(result.attrs).toBe("--abc:#0000ff;");

        expect(result.props).toStrictEqual({
            "--abc": "#0000ff",
        });
    });

    it("should set variables", (): void => {
        const colors = {
            blue: "var(--abc)",
            red: "var(--efg)",
        };

        const result: VariablesSetter = setVariables(colors, {
            blue: "#0000ff",
            red: "#ff0000",
        });

        expect(result.attrs).toBe("--abc:#0000ff;--efg:#ff0000;");

        expect(result.props).toStrictEqual({
            "--abc": "#0000ff",
            "--efg": "#ff0000",
        });
    });
});
