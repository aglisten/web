import type { CSS } from "#/@types/style";

import { TransformError } from "#/errors/transform";

/**
 * Create a style for an element.
 *
 * ### Example
 *
 * ```ts
 * import { style } from "ammolite";
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
    throw new TransformError("style");
};

export { style };
