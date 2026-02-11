import type {
    CompileResult,
    CreateRuntimeOptions,
    Runtime,
} from "@aglisten/runtime";
import type { Format, Partial } from "ts-vista";
import type { LoaderContext } from "webpack";

import { createRuntime } from "@aglisten/runtime";

let runtime: Runtime | null = null;

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
    this.cacheable(true);

    const options: LoaderOptions = this.getOptions();

    // @ts-expect-error
    const callback: (
        error: unknown | null,
        result?: string,
        sourceMap?: string,
    ) => void = this.async();

    try {
        if (!runtime) {
            runtime = createRuntime({
                cwd: options.cwd,
                include: options.include,
                exclude: options.exclude,
            });
        }

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

export default loader;
export type { LoaderOptions };
