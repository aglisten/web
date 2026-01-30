import type {
    CompileResult,
    DynamicCompileOptions,
    PresetCompileOptions,
    UserCompileOptions,
} from "@aglisten/compiler";
import type { Targets } from "lightningcss";
import type { Format, Partial } from "ts-vista";

import { compile } from "@aglisten/compiler";
import browserslist from "browserslist";
import { toMerged } from "es-toolkit";
import { browserslistToTargets, transform } from "lightningcss";

import { INCLUDED_FUNCTIONS_DEFAULT, PACKAGE_NAME_DEFAULT } from "#/helper";

const OPTIONS_DEFAULT: ResolvedOptions = {
    packageName: PACKAGE_NAME_DEFAULT,
    includedFunctions: INCLUDED_FUNCTIONS_DEFAULT,
    cwd: process.cwd(),
    include: [],
    exclude: [],
    targets: void 0,
    minify: false,
};

type CompleteCreateRuntimeOptions = Format<
    PresetCompileOptions &
        UserCompileOptions & {
            /**
             * Browserslist targets for the CSS output.
             */
            targets: string | Targets;
            /**
             * Whether minify the CSS output.
             */
            minify: boolean;
        }
>;

type ResolvedOptions = Format<Partial<CompleteCreateRuntimeOptions, "targets">>;

type CreateRuntimeOptions = Format<Partial<CompleteCreateRuntimeOptions>>;

type CompileOptions = DynamicCompileOptions;

const createRuntime = (coreOptions: CreateRuntimeOptions) => {
    const coreOpts: ResolvedOptions = toMerged(OPTIONS_DEFAULT, coreOptions);

    const targets: Targets | undefined =
        typeof coreOpts.targets === "string"
            ? browserslistToTargets(browserslist(coreOpts.targets))
            : coreOpts.targets;

    const cache: Map<string, CompileResult> = new Map();

    let isTransformed: boolean = false;

    let cssCache: string = "";

    return {
        isImported: async (options: CompileOptions): Promise<boolean> => {
            const result: CompileResult | undefined = await compile(
                toMerged(coreOpts, options),
            );

            if (!result) return false;

            isTransformed = false;
            cache.set(options.file, result);

            return true;
        },
        compile: async (options: CompileOptions): Promise<CompileResult> => {
            if (cache.has(options.file))
                return cache.get(options.file) as CompileResult;

            const result: CompileResult | undefined = await compile(
                toMerged(coreOpts, options),
            );

            if (!result) {
                return {
                    code: options.code,
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

export type { CreateRuntimeOptions, CompileOptions, CompileResult, Runtime };
export { createRuntime };
