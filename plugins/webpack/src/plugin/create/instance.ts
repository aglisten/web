import type { CreateRuntimeOptions, Runtime } from "@aglisten/runtime";
import type { Format, Partial } from "ts-vista";
import type {
    Compilation,
    Compiler,
    PathData,
    RuleSetRule,
    WebpackPluginInstance,
} from "webpack";

import type { HtmlCompilationHooks } from "#/plugin/create/html";
import type { InternalLoaderOptions } from "#/plugin/create/loader";
import type { CreatePluginOptions } from "./creater";

import * as Path from "node:path";

import { createRuntime } from "@aglisten/runtime";
import { FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { getHtmlHooks } from "#/plugin/create/html";
import { name as currentName } from "../../../package.json";

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
        const { Compilation, WebpackError } = compiler.webpack;
        const { RawSource } = compiler.webpack.sources;

        const name: string = this.createOptions?.name ?? currentName;

        ////////////////////////////////////////
        // push loader
        ////////////////////////////////////////

        const rules: (RuleSetRule | "...")[] = compiler.options.module.rules;

        const hasRule: boolean = rules.some(
            (rule: RuleSetRule | "..."): boolean =>
                typeof rule === "object" &&
                rule !== null &&
                "test" in rule &&
                rule.test === FILTER_JS_ADVANCED,
        );

        if (!hasRule) {
            rules.push({
                test: FILTER_JS_ADVANCED,
                use: [
                    {
                        loader: Path.resolve(__dirname, "loader.js"),
                        options: {
                            isDev: this.isDev,
                            runtime: this.runtime,
                        } satisfies InternalLoaderOptions,
                    },
                ],
                type: "javascript/auto",
            });
        }

        ////////////////////////////////////////
        // add additional asset
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

                        // html-webpack-plugin / html-rspack-plugin

                        const htmlHooks: HtmlCompilationHooks[] = getHtmlHooks(
                            compilation,
                            compiler,
                        );

                        for (const hooks of htmlHooks) {
                            hooks.beforeEmit?.tapPromise(
                                name,
                                async ({ html, outputName, plugin }) => {
                                    const href: string = (plugin as any)
                                        ?.options?.hash
                                        ? `${this.filename}?${contentHash}`
                                        : this.filename;

                                    return {
                                        html: html.replace(
                                            "</head>",
                                            `<link rel="stylesheet" href="${href}" /></head>`,
                                        ),
                                        outputName,
                                        plugin,
                                    };
                                },
                            );
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
            ); // compilation.hooks.processAssets.tapPromise
        }); // compiler.hooks.make.tap
    } // apply
}

export type { PluginOptions };
export { PluginInstance };
