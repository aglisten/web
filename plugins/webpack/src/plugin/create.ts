import type { CreateRuntimeOptions, Runtime } from "@aglisten/runtime";
import type HtmlWebpackPlugin from "html-webpack-plugin";
import type { Format, Partial } from "ts-vista";
import type {
    Compilation,
    Compiler,
    NormalModule,
    PathData,
    WebpackPluginInstance,
} from "webpack";

import type { InternalLoaderOptions } from "#/plugin/loader";

import * as Path from "node:path";

import { createRuntime } from "@aglisten/runtime";
import { FILTER_CSS, FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { name as currentName } from "../../package.json";

type HtmlWebpackPluginData = {
    html: string;
    outputName: string;
    plugin: HtmlWebpackPlugin;
};

type PluginOptions = Format<
    {
        /**
         * Whether to emit the output file.
         */
        emit?: boolean;
        /**
         * Whether running in development mode.
         */
        dev?: boolean;
        /**
         * Filename of the output file.
         *
         * By default, it is `aglisten`.
         */
        filename?: string;
    } & Partial<Pick<CreateRuntimeOptions, "cwd" | "include" | "exclude">>
>;

class PluginInstance implements WebpackPluginInstance {
    public createOptions?: CreatePluginOptions;

    public options?: PluginOptions;

    public runtime: Runtime;

    public emit: boolean = true;

    public isDev: boolean = process.env.NODE_ENV === "development";

    public filename: string = "aglisten.css";

    constructor(createOpts?: CreatePluginOptions, opts?: PluginOptions) {
        this.createOptions = createOpts;
        this.options = opts;

        if (typeof opts?.dev === "boolean") this.isDev = opts.dev;

        this.runtime =
            createOpts?.runtime ??
            createRuntime({
                cwd: opts?.cwd,
                include: opts?.include,
                exclude: opts?.exclude,
            });

        if (typeof opts?.emit === "boolean") this.emit = opts.emit;

        if (typeof opts?.filename === "string")
            this.filename = `${Path.parse(opts.filename).name}.css`;
    }

    apply(compiler: Compiler): void {
        const { Compilation, NormalModule, WebpackError } = compiler.webpack;
        const { RawSource } = compiler.webpack.sources;

        const name: string = this.createOptions?.name ?? currentName;

        ////////////////////////////////////////
        // transform
        ////////////////////////////////////////

        let entryCss: string = "";

        compiler.hooks.thisCompilation.tap(
            name,
            (compilation: Compilation): void => {
                NormalModule.getCompilationHooks(compilation).loader.tap(
                    name,
                    (_, module: NormalModule): void => {
                        try {
                            // get CSS entry
                            if (
                                entryCss === "" &&
                                FILTER_CSS.test(module.resource)
                            ) {
                                entryCss = module.resource;
                            }

                            // JS check
                            if (!FILTER_JS_ADVANCED.test(module.resource))
                                return void 0;

                            // add loader
                            module.loaders.push({
                                loader: Path.resolve(__dirname, "loader.js"),
                                options: {
                                    isDev: this.isDev,
                                    runtime: this.runtime,
                                } satisfies InternalLoaderOptions,
                                ident: null,
                                type: null,
                            });
                        } catch (er: unknown) {
                            if (er instanceof WebpackError) {
                                compilation.errors.push(er);
                            } else {
                                compilation.errors.push(
                                    new WebpackError(String(er)),
                                );
                            }
                        }
                    },
                ); // NormalModule.getCompilationHooks
            },
        ); // compiler.hooks.compilation

        ////////////////////////////////////////
        // Add additional asset
        ////////////////////////////////////////

        compiler.hooks.make.tap(name, (compilation: Compilation): void => {
            // get hash content
            const getHashContent = (source: string): string => {
                const { hashDigest, hashDigestLength, hashFunction, hashSalt } =
                    compilation.outputOptions;

                const hash = compiler.webpack.util.createHash(
                    hashFunction ?? "md5",
                );

                if (hashSalt) hash.update(hashSalt);

                hash.update(source);

                return hash
                    .digest(hashDigest)
                    .toString()
                    .slice(0, hashDigestLength);
            };

            // add asset
            compilation.hooks.processAssets.tapPromise(
                {
                    name,
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                async (): Promise<void> => {
                    try {
                        // no emit
                        if (!this.emit) return void 0;

                        const css: string = await this.runtime.getCSS();

                        const contentHash: string = getHashContent(css);

                        const data: PathData = {
                            filename: this.filename,
                            contentHash,
                            chunk: {
                                id: this.filename,
                                name: Path.parse(this.filename).name,
                                hash: contentHash,
                            },
                        };

                        const { path: assetPath, info: assetInfo } =
                            compilation.getPathWithInfo(this.filename, data);

                        compilation.emitAsset(
                            assetPath,
                            new RawSource(css),
                            assetInfo,
                        );

                        // html-webpack-plugin

                        try {
                            const { default: plugin } = await import(
                                "html-webpack-plugin"
                            );

                            plugin
                                .getCompilationHooks(compilation)
                                .beforeEmit.tapPromise(
                                    name,
                                    async ({
                                        html,
                                        outputName,
                                        plugin,
                                    }: HtmlWebpackPluginData): Promise<HtmlWebpackPluginData> => {
                                        const href: string = plugin.options
                                            ?.hash
                                            ? `${this.filename}?${contentHash}`
                                            : `${this.filename}`;

                                        // inject
                                        html = html.replace(
                                            "</head>",
                                            `<link rel="stylesheet" href="${href}" /></head>`,
                                        );

                                        return {
                                            html,
                                            outputName,
                                            plugin,
                                        };
                                    },
                                );
                        } catch (_: unknown) {
                            // `html-webpack-plugin` not found
                        }
                    } catch (er: unknown) {
                        if (er instanceof WebpackError) {
                            compilation.errors.push(er);
                        } else {
                            compilation.errors.push(
                                new WebpackError(String(er)),
                            );
                        }
                    }
                },
            ); // compilation.hooks.additionalAssets
        }); // compiler.hooks.make
    } // apply
}

type CompleteCreatePluginOptions = {
    name: string;
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

const createPlugin = (options?: CreatePluginOptions) => {
    return class Plugin extends PluginInstance {
        constructor(pluginOptions?: PluginOptions) {
            super(options, pluginOptions);
        }
    };
};

export type { CreatePluginOptions, PluginOptions };
export { createPlugin };
