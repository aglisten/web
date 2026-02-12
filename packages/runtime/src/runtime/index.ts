import type {
    DynamicCompileOptions,
    PresetCompileOptions,
    CompileResult as RawCompileResult,
    SourceMap,
    UserCompileOptions,
} from "@aglisten/compiler";
import type { Format, Partial } from "ts-vista";

import { compile } from "@aglisten/compiler";
import { transformCssList } from "@aglisten/compiler/processor/css";
import { toMerged } from "es-toolkit";

import { INCLUDED_FUNCTIONS_DEFAULT, PACKAGE_NAME_DEFAULT } from "#/helper";
import { getMD5 } from "#/runtime/hash";

const OPTIONS_DEFAULT: ResolvedOptions = {
    packageName: PACKAGE_NAME_DEFAULT,
    includedFunctions: INCLUDED_FUNCTIONS_DEFAULT,
    cwd: process.cwd(),
    include: [],
    exclude: [],
};

type CacheValues = {
    hash: string;
    result: RawCompileResult;
};

type CompleteCreateRuntimeOptions = Format<
    PresetCompileOptions & UserCompileOptions
>;

type ResolvedOptions = CompleteCreateRuntimeOptions;

type CreateRuntimeOptions = Format<Partial<CompleteCreateRuntimeOptions>>;

type CompileOptions = DynamicCompileOptions;

type CompileResult = {
    code: string;
    css: string;
    map: SourceMap;
};

const createRuntime = (coreOptions?: CreateRuntimeOptions) => {
    const coreOpts: ResolvedOptions = toMerged(
        OPTIONS_DEFAULT,
        coreOptions ?? {},
    );

    const cache: Map<string, CacheValues> = new Map();

    let cssCache: string = "";

    return {
        isImported: async (options: CompileOptions): Promise<boolean> => {
            const result: RawCompileResult | undefined = await compile(
                toMerged(coreOpts, options),
            );

            if (!result) return false;

            cache.set(options.file, {
                hash: getMD5(options.code),
                result,
            });

            return true;
        },
        compile: async (
            options: CompileOptions,
        ): Promise<CompileResult | undefined> => {
            if (cache.has(options.file)) {
                const vl: CacheValues | undefined = cache.get(options.file);

                if (vl && vl.hash === getMD5(options.code)) {
                    return {
                        code: vl.result.code,
                        css: vl.result.css,
                        map: vl.result.map,
                    };
                }
            }

            const result: RawCompileResult | undefined = await compile(
                toMerged(coreOpts, options),
            );

            if (!result) return void 0;

            cache.set(options.file, {
                hash: getMD5(options.code),
                result,
            });

            return {
                code: result.code,
                css: result.css,
                map: result.map,
            };
        },
        getCSS: async (): Promise<string> => {
            if (cssCache) return cssCache;

            const cssList: string[] = [];

            cache.forEach((vl: CacheValues): void => {
                cssList.push(...vl.result.cssList);
            });

            const css: string = transformCssList(cssList).join("");

            cssCache = css;

            return css;
        },
    };
};

type Runtime = ReturnType<typeof createRuntime>;

export type {
    CreateRuntimeOptions,
    CompileOptions,
    SourceMap,
    CompileResult,
    Runtime,
};
export { createRuntime };
