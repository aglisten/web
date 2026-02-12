import type { CompileResult, Runtime } from "@aglisten/runtime";
import type { LoaderContext } from "webpack";

type InternalLoaderOptions = {
    runtime: Runtime;
};

function loader(
    this: LoaderContext<InternalLoaderOptions>,
    source: string,
): void {
    this.cacheable(true);

    const { runtime } = this.getOptions();

    const callback: ReturnType<LoaderContext<InternalLoaderOptions>["async"]> =
        this.async();

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
export type { InternalLoaderOptions };
