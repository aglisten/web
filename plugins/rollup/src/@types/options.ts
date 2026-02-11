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

type CompleteOutputOptions = {
    /**
     * Name of the output file.
     *
     * By default, it is `aglisten`.
     */
    fileName: string;
};

type OutputOptions = Format<Partial<CompleteOutputOptions>>;

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
    /**
     * Output options.
     */
    output: CompleteOutputOptions;
};

type PluginOptions = Format<
    Partial<Omit<CompletePluginOptions, "input" | "output">> & {
        /**
         * Input options.
         */
        input?: InputOptions;
        /**
         * Output options.
         */
        output?: OutputOptions;
    }
>;

export type {
    CompleteInputOptions,
    CompleteOutputOptions,
    CompletePluginOptions,
    InputOptions,
    OutputOptions,
    PluginOptions,
};
