type KeyValues = {
    [key: string]: string[];
};

// Turn class name into keyValues
const getKeyValues = (input: string): KeyValues => {
    /**
     * From: "abcdf abcde efghi"
     * To: ["abcdf", "abcde", "efghi"]
     */
    const array: string[] = input.split(" ");

    /**
     * From: ["abcdf", "abcde", "efghi"]
     * To: { "abcd": ["abcdf", "abcde"], "efgh": ["efghi"] }
     */
    return array.reduce((result: KeyValues, value: string) => {
        if (value.length < 4) {
            throw new Error(`Invalid class: ${value}`);
        }

        // get fixed length title
        const title: string = value.slice(0, 4);

        // create if not exists
        if (!result[title]) result[title] = [];

        // push
        result[title].push(value);

        return result;
    }, {} as KeyValues);
};

// Turn keyValues back to class name
const getClassFromKeyValues = (keyValues: KeyValues): string => {
    const result: string[] = [];

    for (const key in keyValues) {
        const values: string[] = keyValues[key] ?? [];
        result.push(values.join(" "));
    }

    return result.join(" ");
};

/**
 * Merge multiple styles.
 *
 * ### Example
 *
 * ```ts
 * import { style, merge } from "ammolite";
 *
 * const styleA: string = style({
 *     backgroundColor: "red",
 * });
 *
 * const styleB: string = style({
 *     backgroundColor: "blue",
 * });
 *
 * // background-color: blue;
 * const containerA: string = merge(styleA, styleB);
 * ```
 */
const merge = (...styles: string[]): string => {
    const keyValues: KeyValues = styles.reduce(
        (result: KeyValues, style: string): KeyValues => {
            const kvs: KeyValues = getKeyValues(style);

            for (const key in kvs) {
                if (kvs[key]) result[key] = kvs[key];
            }

            return result;
        },
        {} as KeyValues,
    );

    return getClassFromKeyValues(keyValues);
};

export { merge };
