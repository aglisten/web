import { merge } from "ammolite";
import { describe, expect, it } from "vitest";

describe("web styles merge tests", (): void => {
    it("should merge styles", (): void => {
        const stylesA: string = "abcd1234 efgh5678";

        const stylesB: string = "abcd4567";

        const result: string = merge(stylesA, stylesB);

        expect(result).toBe("abcd4567 efgh5678");
    });
});
