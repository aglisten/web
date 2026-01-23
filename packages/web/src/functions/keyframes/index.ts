import type { Keyframes } from "#/@types/style";

import { TranspileError } from "#/error";

/**
 * Create a keyframes.
 *
 * ```ts
 * import { keyframes } from "@aglisten/web";
 *
 * const fadeIn = keyframes({
 *     "0%": {
 *         opacity: 0,
 *     },
 *     "100%": {
 *         opacity: 1,
 *     },
 * });
 * ```
 */
const keyframes = (_keyframes: Keyframes): string => {
    throw new TranspileError("keyframes");
};

export { keyframes };
