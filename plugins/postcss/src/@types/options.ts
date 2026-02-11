import type { Format, Omit, Partial } from "ts-vista";

type CompleteInputOptions = {
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

type InputOptions = Format<Partial<CompleteInputOptions>>;

type CompletePluginOptions = {
    /**
     * Whether to emit the output file.
     *
     * By default, it is `true`.
     */
    emit: boolean;
    /**
     * Current working directory.
     *
     * By default, it is `process.cwd()`.
     */
    cwd: string;
    /**
     * Input options.
     */
    input: CompleteInputOptions;
};

type PluginOptions = Format<
    Partial<Omit<CompletePluginOptions, "input">> & {
        /**
         * Input options.
         */
        input?: InputOptions;
    }
>;

export type {
    CompletePluginOptions,
    CompleteInputOptions,
    InputOptions,
    PluginOptions,
};
