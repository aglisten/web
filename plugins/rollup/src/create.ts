import type { CreateRuntimeOptions, Runtime } from "@aglisten/runtime";
import type { Plugin as RollupPlugin, TransformResult } from "rollup";
import type { Format, Partial } from "ts-vista";

import * as Path from "node:path";

import { createRuntime } from "@aglisten/runtime";
import { FILTER_JS_ADVANCED } from "@aglisten/runtime/helper";

import { name } from "../package.json";

type CompleteCreatePluginOptions = {
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

type PluginOptions = Format<
    {
        /**
         * Whether to emit the output file.
         */
        emit?: boolean;
        /**
         * Filename of the output file.
         *
         * By default, it is `aglisten`.
         */
        filename?: string;
    } & Partial<Pick<CreateRuntimeOptions, "cwd" | "include" | "exclude">>
>;

const createPlugin = (options?: CreatePluginOptions) => {
    return (opts?: PluginOptions): RollupPlugin => {
        let runtime: Runtime | null = null;

        const emit: boolean =
            typeof opts?.emit === "boolean" ? opts.emit : true;
        const filename: string =
            typeof opts?.filename === "string" ? opts.filename : "aglisten";

        return {
            name,
            buildStart(): void {
                runtime =
                    options?.runtime ??
                    createRuntime({
                        cwd: opts?.cwd,
                        include: opts?.include,
                        exclude: opts?.exclude,
                    });
            },
            async transform(
                code: string,
                file: string,
            ): Promise<TransformResult> {
                if (!FILTER_JS_ADVANCED.test(file) || !runtime) return void 0;

                const result = await runtime.compile({
                    file,
                    code,
                });

                return {
                    code: result.code,
                    map: null,
                };
            },
            async generateBundle(): Promise<void> {
                if (!emit || !runtime) return void 0;

                const source: string = await runtime.getCSS();

                this.emitFile({
                    type: "asset",
                    name: `${Path.parse(filename).name}.css`,
                    source,
                });
            },
        };
    };
};

type Plugin = ReturnType<typeof createPlugin>;

export type { CreatePluginOptions, Plugin, PluginOptions };
export { createPlugin };
