import type {
    CompileResult,
    CreateRuntimeOptions,
    Runtime,
} from "@aglisten/runtime";
import type { Format } from "ts-vista";
import type {
    IndexHtmlTransformContext,
    IndexHtmlTransformResult,
    Plugin,
    TransformResult,
    ViteDevServer,
} from "vite";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { createPlugin } from "@aglisten/rollup/create";
import { createRuntime } from "@aglisten/runtime";
import { FILTER_CSS, FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { name } from "../package.json";

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

const PREFIX = "aglisten" as const;

const plugin = (options?: PluginOptions): Plugin => {
    const isDev: boolean =
        typeof options?.dev === "boolean"
            ? options.dev
            : process.env.NODE_ENV === "development";

    const runtime: Runtime = createRuntime({
        cwd: options?.cwd,
        include: options?.include,
        exclude: options?.exclude,
    });

    const rollupPlugin = createPlugin({
        runtime,
    });

    const emit: boolean =
        typeof options?.emit === "boolean" ? options.emit : true;

    const filename: string =
        typeof options?.filename === "string"
            ? `${Path.parse(options.filename).name}.css`
            : "aglisten";

    if (isDev) {
        let entryJs: string | undefined = void 0;
        let entryCss: string | undefined = void 0;

        // @ts-expect-error: rollup plugin type error
        return {
            ...rollupPlugin(options),
            name,
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

                if ((entryJs === void 0 && !isSSR) || entryJs === file) {
                    const script: string = await Fsp.readFile(
                        Path.resolve(import.meta.dirname, "hmr.js"),
                        "utf-8",
                    );

                    code = `${script}\n${code}`;

                    entryJs = file;
                }

                const result: CompileResult = await runtime.compile({
                    file,
                    code,
                });

                return {
                    code: result.code,
                    map: null,
                };
            },
        };
    }

    // @ts-expect-error: rollup plugin type error
    return {
        ...rollupPlugin(options),
        name,
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
                        asset.includes(Path.parse(filename).name) &&
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

export type { PluginOptions };
export { plugin as aglisten };
