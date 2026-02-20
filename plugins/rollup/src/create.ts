import type { CompileResult, Runtime } from "@ammolite/runtime";
import type { Plugin as RollupPlugin, TransformResult } from "rollup";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/@types/options";

import { createRuntime } from "@ammolite/runtime";
import { FILTER_JS_ADVANCED } from "@ammolite/runtime/helper";

import { getOutput } from "#/functions/output";
import { name, version } from "../package.json";

type CompleteCreatePluginOptions = {
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

const createPlugin = (options?: CreatePluginOptions) => {
    return (opts?: PluginOptions): RollupPlugin => {
        let runtime: Runtime | null = null;

        const emit: boolean =
            typeof opts?.emit === "boolean" ? opts.emit : true;

        const { outName } = getOutput({
            options: opts,
        });

        return {
            name,
            version,
            buildStart(): void {
                runtime =
                    options?.runtime ??
                    createRuntime({
                        cwd: opts?.cwd,
                        include: opts?.input?.include,
                        exclude: opts?.input?.exclude,
                    });
            },
            async transform(
                code: string,
                file: string,
            ): Promise<TransformResult> {
                if (!FILTER_JS_ADVANCED.test(file) || !runtime) return void 0;

                const result: CompileResult | undefined = await runtime.compile(
                    {
                        file,
                        code,
                    },
                );

                if (!result) return void 0;

                return {
                    code: result.code,
                    map: result.map,
                };
            },
            async generateBundle(): Promise<void> {
                if (!emit || !runtime) return void 0;

                const source: string = await runtime.getCSS();

                this.emitFile({
                    type: "asset",
                    name: outName,
                    source,
                });
            },
        };
    };
};

type Plugin = ReturnType<typeof createPlugin>;

export type { CreatePluginOptions, Plugin, PluginOptions };
export { createPlugin };
