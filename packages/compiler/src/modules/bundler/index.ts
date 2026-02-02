import type {
    OutputChunk,
    RolldownBuild,
    RolldownOutput,
    SourceMap,
} from "rolldown";
import type { Format } from "ts-vista";

import { rolldown } from "rolldown";

import { entryOverrider } from "#/modules/bundler/plugins/entry";
import { externalResolver } from "#/modules/bundler/plugins/external";
import { filePreprocessor } from "#/modules/bundler/plugins/preprocess";

/**
 * Preset options for `bundle` function.
 */
type PresetBundleOptions = {
    /**
     * Name of the CSS-in-JS package.
     */
    packageName: string;
    /**
     * List of functions to be preprocessed.
     */
    includedFunctions: readonly string[];
};

/**
 * User defined options for `bundle` function.
 */
type UserBundleOptions = {
    /**
     * Current working directory.
     */
    cwd: string;
    /**
     * Array of packages/paths to include.
     *
     * Packages/paths in `include` option will be
     * overwritten by `exclude` option.
     */
    include: readonly string[];
    /**
     * Array of packages/paths to exclude.
     */
    exclude: readonly string[];
};

/**
 * Dynamic options for `bundle` function to bundle file.
 */
type DynamicBundleOptions = {
    /**
     * File to be bundled.
     */
    file: string;
    /**
     * preprocessed entry code.
     */
    code: string;
};

/**
 * Options for `bundle` function.
 */
type BundleOptions = Format<
    PresetBundleOptions & UserBundleOptions & DynamicBundleOptions
>;

/**
 * Result of `bundle` function.
 */
type BundleResult = {
    /**
     * Bundled code.
     */
    code: string;
    /**
     * Source map.
     */
    map: SourceMap | undefined;
};

/**
 * Bundle function to bundle entry file for reference.
 */
const bundle = async (options: BundleOptions): Promise<BundleResult> => {
    const bundled: RolldownBuild = await rolldown({
        input: options.file,
        cwd: options.cwd,
        logLevel: "silent",
        transform: {
            jsx: "preserve",
        },
        treeshake: false,
        plugins: [
            externalResolver({
                packageName: options.packageName,
                include: options.include,
                exclude: options.exclude,
            }),
            entryOverrider({
                file: options.file,
                code: options.code,
            }),
            filePreprocessor({
                packageName: options.packageName,
                file: options.file,
                includedFunctions: options.includedFunctions,
            }),
        ],
        experimental: {
            attachDebugInfo: "none",
        },
    });

    const result: RolldownOutput = await bundled.generate();

    const output: OutputChunk = result.output[0];

    return {
        code: output.code,
        map: output.map ?? void 0,
    };
};

export type {
    PresetBundleOptions,
    UserBundleOptions,
    DynamicBundleOptions,
    BundleOptions,
    BundleResult,
};
export { bundle };
