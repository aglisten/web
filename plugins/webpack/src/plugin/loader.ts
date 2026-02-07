import type { CompileResult, Runtime } from "@aglisten/runtime";
import type { LoaderContext } from "webpack";

import { createHash } from "node:crypto";

const md5 = (code: string): string => {
    return createHash("md5").update(code).digest("hex");
};

type InternalLoaderOptions = {
    isDev: boolean;
    runtime: Runtime;
};

function loader(
    this: LoaderContext<InternalLoaderOptions>,
    source: string,
): void {
    const { isDev, runtime } = this.getOptions();

    // @ts-expect-error
    const callback: (
        error: unknown | null,
        result?: string,
        sourceMap?: string,
    ) => void = this.async();

    try {
        runtime
            .compile({
                file: this.resourcePath,
                code: source,
            })
            .then((result: CompileResult): void => {
                if (isDev) {
                    // check if the code has changed
                    if (result.code === source) {
                        callback(null, source);
                        return void 0;
                    }

                    // force update
                    callback(null, `// ${md5(source)}\n${result.code}`);
                } else {
                    callback(null, result.code);
                }
            });
    } catch (er: unknown) {
        callback(er);
    }
}

export type { InternalLoaderOptions };
export default loader;
