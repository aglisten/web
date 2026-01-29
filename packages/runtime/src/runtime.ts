import type {
    DynamicTranspileOptions,
    PresetTranspileOptions,
    TranspileResult,
    UserTranspileOptions,
} from "@aglisten/transpiler";
import type { Targets } from "lightningcss";

import { transpile } from "@aglisten/transpiler";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";

type CreateRuntimeOptions = PresetTranspileOptions &
    UserTranspileOptions & {
        targets?: string | Targets;
    };

type TranspileOptions = DynamicTranspileOptions;

const createRuntime = (coreOptions: CreateRuntimeOptions) => {
    const targets: Targets | undefined =
        typeof coreOptions.targets === "string"
            ? browserslistToTargets(browserslist(coreOptions.targets))
            : coreOptions.targets;

    const cache: Map<string, TranspileResult> = new Map();

    let isTransformed: boolean = false;

    let cssCache: string = "";

    return {
        isImported: async (options: TranspileOptions): Promise<boolean> => {
            const result: TranspileResult | undefined = await transpile({
                ...coreOptions,
                ...options,
            });

            if (!result) return false;

            isTransformed = false;
            cache.set(options.file, result);

            return true;
        },
        transpile: async (
            options: TranspileOptions,
        ): Promise<TranspileResult> => {
            if (cache.has(options.file))
                return cache.get(options.file) as TranspileResult;

            const result: TranspileResult | undefined = await transpile({
                ...coreOptions,
                ...options,
            });

            if (!result) {
                return {
                    code: "",
                    css: "",
                };
            }

            isTransformed = false;
            cache.set(options.file, result);

            return {
                code: result.code,
                css: result.css,
            };
        },
        getCSS: async (): Promise<string> => {
            if (isTransformed && cssCache) return cssCache;

            let css: string = "";

            cache.forEach((result: TranspileResult): void => {
                css += result.css;
            });

            const { code: cssCode } = transform({
                filename: "index.css",
                code: new TextEncoder().encode(css),
                minify: true,
                targets,
            });

            const result: string = new TextDecoder().decode(cssCode);

            isTransformed = true;
            cssCache = result;

            return result;
        },
    };
};

type Runtime = ReturnType<typeof createRuntime>;

export type { CreateRuntimeOptions, TranspileOptions, Runtime };
export { createRuntime };
