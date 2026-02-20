import type { Partial } from "ts-vista";

/** Variables setter. */
type VariablesSetter = {
    /** Inline styles as a single string. */
    attrs: string;
    /** Inline styles as an object with key-value pairs. */
    props: object;
};

/**
 * Set variables function.
 *
 * For setting a different values from the `variables` function.
 *
 * ### Example
 *
 * ```ts
 * import type { VariablesSetter } from "ammolite";
 *
 * import type { Vars } from "./vars";
 *
 * import { setVariables } from "ammolite";
 *
 * import { vars } from "./vars";
 *
 * const newTheme: VariablesSetter<Vars> = setVariables(vars, {
 *     // ...
 * });
 * ```
 */
const setVariables = <T extends Record<string, string>, PT extends Partial<T>>(
    vars: T,
    newVars: Partial<Record<keyof T, string | number>>,
): VariablesSetter => {
    const props: PT = {} as PT;

    for (let i: number = 0; i < Object.keys(newVars).length; i++) {
        const key: string | undefined = Object.keys(newVars)[i];

        if (!key) continue;

        const varKey: string | undefined = vars[key]?.replace(
            /var\((--[a-zA-Z0-9-_]+)\)/g,
            "$1",
        );

        if (!varKey) continue;

        (props as Record<string, string>)[varKey] = newVars[key] as string;
    }

    return {
        attrs: Object.keys(props)
            .map((key: string): string => `${key}:${props[key]};`)
            .join(""),
        props,
    };
};

export type { VariablesSetter };
export { setVariables };
