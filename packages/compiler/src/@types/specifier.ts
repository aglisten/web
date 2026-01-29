/**
 * Specifier type.
 *
 * ### Example
 *
 * Import a function from a package:
 *
 * ```ts
 * import { x } from "p";
 *
 * // x <- imported + local
 * ```
 *
 * Import a function with a local name from a package:
 *
 * ```ts
 * import { x as y } from "p";
 *
 * // x <- imported
 * // y <- local
 * ```
 */
type Specifier = {
    /**
     * The imported name from the package.
     */
    imported: string;
    /**
     * The local name that actually being used.
     */
    local: string;
};

export type { Specifier };
