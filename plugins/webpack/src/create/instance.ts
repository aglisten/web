import type { Runtime } from "@aglisten/runtime";
import type {
    Asset,
    Compilation,
    Compiler,
    PathData,
    RuleSetRule,
    WebpackPluginInstance,
} from "webpack";

import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions } from "#/@types/options";
import type { HtmlCompilationHooks } from "#/create/functions/html";
import type { InternalLoaderOptions } from "#/loader-internal";

import * as Path from "node:path";

import { createRuntime } from "@aglisten/runtime";
import { FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { getHtmlHooks } from "#/create/functions/html";
import { name as currentName } from "../../package.json";

class PluginInstance implements WebpackPluginInstance {
    public createOptions?: CreatePluginOptions;

    public options?: PluginOptions;

    public runtime: Runtime;

    public emit: boolean = true;

    public isDev: boolean = process.env.NODE_ENV === "development";

    public outDir: string | undefined;

    public outName: string = "aglisten.css";

    public outPath: string = this.outName;

    constructor(createOpts?: CreatePluginOptions, opts?: PluginOptions) {
        this.createOptions = createOpts;
        this.options = opts;

        if (typeof opts?.dev === "boolean") this.isDev = opts.dev;

        this.runtime =
            createOpts?.runtime ??
            createRuntime({
                cwd: opts?.cwd,
                include: opts?.input?.include,
                exclude: opts?.input?.exclude,
            });

        if (typeof opts?.emit === "boolean") this.emit = opts.emit;

        if (typeof opts?.output?.dir === "string")
            this.outDir = opts.output.dir;

        if (typeof opts?.output?.fileName === "string") {
            const parsed: Path.ParsedPath = Path.parse(opts.output.fileName);

            const hasExt: boolean = parsed.ext !== "";

            if (hasExt) {
                this.outName = `${parsed.name}${parsed.ext}`;
            } else {
                this.outName = `${parsed.name}.css`;
            }
        }

        this.outPath = this.outDir
            ? Path.posix.join(this.outDir, this.outName)
            : this.outName;
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
                        loader: Path.resolve(__dirname, "loader-internal"),
                        options: {
                            runtime: this.runtime,
                        } satisfies InternalLoaderOptions,
                    },
                ],
            });
        }

        ////////////////////////////////////////
        // emit asset
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

            // emit asset
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
                            filename: this.outPath,
                            contentHash,
                            chunk: {
                                id: this.outPath,
                                name: Path.parse(this.outName).name,
                                hash: contentHash,
                            },
                        };

                        const { path: assetPath, info: assetInfo } =
                            compilation.getPathWithInfo(this.outPath, data);

                        compilation.emitAsset(
                            assetPath,
                            new RawSource(css),
                            assetInfo,
                        );
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

            // html injection
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

                        const assets: Readonly<Asset>[] =
                            compilation.getAssets();

                        const asset: Asset | undefined = assets.find(
                            ({ name }): boolean =>
                                name.includes(
                                    // (abc.css | abc.[xxx].css) -> abc
                                    Path.parse(this.outName).name.split(
                                        ".",
                                    )[0] ?? "",
                                ),
                        );

                        if (!asset) return void 0;

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
                                        ? `/${asset.name}?${contentHash}`
                                        : `/${asset.name}`;

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

export { PluginInstance };
