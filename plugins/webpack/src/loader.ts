import type {
    CompileResult,
    CreateRuntimeOptions,
    Runtime,
} from "@aglisten/runtime";
import type { Format, Partial } from "ts-vista";
import type { LoaderContext } from "webpack";

import { createRuntime } from "@aglisten/runtime";

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

    const callback: (
        error: unknown | null,
        result?: string,
        sourceMap?: string,
    ) => void = this.async;

    const runtime: Runtime = createRuntime({
        cwd: options.cwd,
        include: options.include,
        exclude: options.exclude,
    });

    try {
        runtime
            .compile({
                file: this.resourcePath,
                code: source,
            })
            .then((result: CompileResult): void => {
                callback(null, result.code);
            });
    } catch (er: unknown) {
        callback(er);
    }
}

export type { LoaderOptions };
export default loader;
