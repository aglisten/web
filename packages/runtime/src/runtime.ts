import type {
    CompileResult,
    DynamicCompileOptions,
    PresetCompileOptions,
    UserCompileOptions,
} from "@aglisten/compiler";
import type { Targets } from "lightningcss";

import { compile } from "@aglisten/compiler";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";

type CreateRuntimeOptions = PresetCompileOptions &
    UserCompileOptions & {
        targets?: string | Targets;
    };

type CompileOptions = DynamicCompileOptions;

const createRuntime = (coreOptions: CreateRuntimeOptions) => {
    const targets: Targets | undefined =
        typeof coreOptions.targets === "string"
            ? browserslistToTargets(browserslist(coreOptions.targets))
            : coreOptions.targets;

    const cache: Map<string, CompileResult> = new Map();

    let isTransformed: boolean = false;

    let cssCache: string = "";

    return {
        isImported: async (options: CompileOptions): Promise<boolean> => {
            const result: CompileResult | undefined = await compile({
                ...coreOptions,
                ...options,
            });

            if (!result) return false;

            isTransformed = false;
            cache.set(options.file, result);

            return true;
        },
        compile: async (options: CompileOptions): Promise<CompileResult> => {
            if (cache.has(options.file))
                return cache.get(options.file) as CompileResult;

            const result: CompileResult | undefined = await compile({
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

            cache.forEach((result: CompileResult): void => {
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

export type { CreateRuntimeOptions, CompileOptions, Runtime };
export { createRuntime };
