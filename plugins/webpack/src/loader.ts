import type { CompileResult } from "@aglisten/compiler";
import type { CreateRuntimeOptions } from "@aglisten/runtime";
import type { Format, Partial } from "ts-vista";
import type { LoaderContext } from "webpack";

import { compile } from "@aglisten/compiler";
import {
    INCLUDED_FUNCTIONS_DEFAULT,
    PACKAGE_NAME_DEFAULT,
} from "@aglisten/runtime/helper";

/**
 * Options for the loader.
 */
type LoaderOptions = Format<
    Partial<Pick<CreateRuntimeOptions, "cwd" | "include" | "exclude">>
>;

/**
 * Webpack loader function.
 */
function loader(this: LoaderContext<LoaderOptions>, source: string): void {
    const options: LoaderOptions = this.getOptions();

    // @ts-expect-error
    const callback: (
        error: unknown | null,
        result?: string,
        sourceMap?: string,
    ) => void = this.async();

    try {
        compile({
            packageName: PACKAGE_NAME_DEFAULT,
            includedFunctions: INCLUDED_FUNCTIONS_DEFAULT,
            cwd: options.cwd ?? process.cwd(),
            include: options.include ?? [],
            exclude: options.exclude ?? [],
            file: this.resourcePath,
            code: source,
        }).then((result: CompileResult | undefined): void => {
            if (result) {
                callback(null, result.code);
            } else {
                callback(null, source);
            }
        });
    } catch (er: unknown) {
        callback(er);
    }
}

export type { LoaderOptions };
export default loader;
