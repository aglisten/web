import { TranspileError } from "#/error";

type VariablesObject = Record<
    string,
    | string
    | number
    | {
          default: string | number;
          [selector: string]: string | number;
      }
>;

/**
 * Function to create variables.
 *
 * ## Example
 *
 * ```ts
 * import { variables } from "@aglisten/web";
 *
 * type Vars = {
 *     blue: string;
 *     bg: string;
 * };
 *
 * // Selector must be in the same file.
 * const htmlDark: string = "html[data-theme='dark']";
 *
 * const vars: Vars = variables({
 *     blue: "#1591ea",
 *     bg: {
 *         default: "#fff",
 *         [htmlDark]: "#000",
 *     },
 * });
 *
 * vars.blue // var(--abcd1234)
 * vars.bg // var(--efgh5678)
 * ```
 */
const variables = <V extends VariablesObject>(
    _vars: V,
): Record<keyof V, string> => {
    throw new TranspileError("variables");
};

export type { VariablesObject };
export { variables };
