import type { CompileResult, Runtime } from "@aglisten/runtime";
import type {
    IndexHtmlTransformContext,
    IndexHtmlTransformResult,
    Plugin,
    TransformResult,
    ViteDevServer,
} from "vite";

import type {
    InputOptions,
    OutputOptions,
    PluginOptions,
} from "#/@types/options";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { createPlugin } from "@aglisten/rollup/create";
import { createRuntime } from "@aglisten/runtime";
import { FILTER_CSS, FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { getOutput } from "#/functions/output";
import { name, version } from "../package.json";

const PREFIX = "aglisten" as const;

const plugin = (options?: PluginOptions): Plugin => {
    const isDev: boolean =
        typeof options?.dev === "boolean"
            ? options.dev
            : process.env.NODE_ENV === "development";

    const runtime: Runtime = createRuntime({
        cwd: options?.cwd,
        include: options?.input?.include,
        exclude: options?.input?.exclude,
    });

    const rollupPlugin = createPlugin({
        runtime,
    });

    const emit: boolean =
        typeof options?.emit === "boolean" ? options.emit : true;

    const { outName } = getOutput({
        options,
    });

    // @ts-expect-error: rollup plugin type error
    const plugin: Plugin = {
        ...rollupPlugin(options),
        name,
        version,
    };

    if (isDev) {
        let entryJs: string | undefined = void 0;
        let entryCss: string | undefined = void 0;

        return {
            ...plugin,
            configureServer(server: ViteDevServer): void {
                server.ws.on(`${PREFIX}:init`, async (): Promise<void> => {
                    // inline CSS
                    if (emit) {
                        const data: string = await runtime.getCSS();

                        server.ws.send({
                            type: "custom",
                            event: `${PREFIX}:style`,
                            data,
                        });
                    }
                });
            },
            async transform(
                source: string,
                file: string,
            ): Promise<TransformResult | undefined> {
                let code: string = source;

                // avoid to inject script and
                // call function before the declaration
                if (
                    file.includes("vite/dist/client/client.") ||
                    file.includes("vite/dist/client/env.")
                ) {
                    return void 0;
                }

                // get CSS entry
                if (entryCss === void 0 && FILTER_CSS.test(file)) {
                    entryCss = file;
                }

                // JS check
                if (!FILTER_JS_ADVANCED.test(file)) return void 0;

                // should only inject script into client side,
                // so it will trigger HMR on client reload
                const ssr: string | boolean = this.environment.config.build.ssr;
                const isSSR: boolean = typeof ssr === "string" ? true : ssr;

                // inject HMR on init / increment
                if ((entryJs === void 0 && !isSSR) || entryJs === file) {
                    const script: string = await Fsp.readFile(
                        Path.resolve(import.meta.dirname, "hmr.js"),
                        "utf-8",
                    );

                    code = `${script}\n${code}`;

                    entryJs = file;
                }

                const result: CompileResult | undefined = await runtime.compile(
                    {
                        file,
                        code,
                    },
                );

                // return given code (which may include HMR script inside)
                if (!result) {
                    return {
                        code,
                        map: null,
                    };
                }

                return {
                    code: result.code,
                    map: {
                        ...result.map,
                        file,
                    },
                };
            },
        };
    }

    return {
        ...plugin,
        transformIndexHtml: {
            order: "post",
            handler(
                html: string,
                ctx: IndexHtmlTransformContext,
            ): IndexHtmlTransformResult {
                const bundle = ctx.bundle;

                // no emit | no bundle
                if (!emit || !bundle) return html;

                let out: string | undefined = void 0;

                // get output CSS filename
                for (const asset in bundle) {
                    if (
                        // (abc.css | abc.[xxx].css) -> abc
                        asset.includes(outName.split(".")[0] ?? "") &&
                        FILTER_CSS.test(asset)
                    ) {
                        out = bundle[asset]?.fileName;
                        break;
                    }
                }

                if (!out) return html;

                return {
                    html,
                    tags: [
                        {
                            tag: "link",
                            attrs: {
                                rel: "stylesheet",
                                crossorigin: true,
                                href: `/${out}`,
                            },
                            injectTo: "head",
                        },
                    ],
                };
            },
        },
    };
};

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as aglisten };
