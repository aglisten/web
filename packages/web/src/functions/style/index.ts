import type { CSS } from "#/@types/style";

import { TranspileError } from "#/error";

/**
 * Create a style for an element.
 *
 * ```ts
 * import { style } from "@aglisten/web";
 *
 * const container: string = style({
 *     backgroundColor: "green",
 *     "@media screen and (max-width: 768px)": {
 *         backgroundColor: "cyan",
 *     },
 *     "@supports (hover: hover)": {
 *         backgroundColor: "yellow",
 *     },
 *     "&:active": {
 *         backgroundColor: "red",
 *     },
 *     "#child": {
 *         color: "white",
 *     },
 *     ".child": {
 *         color: "white",
 *     },
 * });
 * ```
 */
const style = (_css: CSS): string => {
    throw new TranspileError("style");
};

export { style };
