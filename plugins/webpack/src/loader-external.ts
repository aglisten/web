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

    const callback: ReturnType<LoaderContext<LoaderOptions>["async"]> =
        this.async();

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
        .then((result: CompileResult | undefined): void => {
            if (!result) return callback(void 0, source);
            return callback(void 0, result.code, {
                ...result.map,
                file: this.resourcePath,
            });
        })
        .catch((err: unknown): void => {
            if (err instanceof Error) return callback(err);
            return callback(new Error(String(err)));
        });
}

export default loader;
export type { LoaderOptions };
