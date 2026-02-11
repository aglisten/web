import type { Runtime } from "@aglisten/runtime";
import type { PluginCreator, Root } from "postcss";

import type { InputOptions, PluginOptions } from "#/@types/options";

import * as Fsp from "node:fs/promises";

import { createRuntime } from "@aglisten/runtime";

import { getPaths } from "#/functions/path";
import { name } from "../package.json";

const plugin: PluginCreator<PluginOptions> = (options?: PluginOptions) => {
    return {
        postcssPlugin: name,
        async Once(root: Root, { postcss, result }): Promise<void> {
            const emit: boolean = options?.emit ?? true;

            if (!emit) return void 0;

            const cwd: string = options?.cwd ?? process.cwd();

            const runtime: Runtime = createRuntime({
                cwd,
                include: options?.input?.include,
                exclude: options?.input?.exclude,
            });

            const include: string[] = await getPaths({
                cwd,
                paths: options?.input?.include ?? [
                    "./src",
                ],
            });

            for await (const file of include) {
                // compile
                await runtime.compile({
                    file,
                    code: await Fsp.readFile(file, "utf-8"),
                });

                // add dependency
                result.messages.push({
                    type: "dependency",
                    plugin: name,
                    file,
                    parent: "aglisten.css",
                });
            }

            // append result
            root.append(
                postcss.parse(await runtime.getCSS(), {
                    from: "aglisten.css",
                }),
            );
        },
    };
};

plugin.postcss = true;

export default plugin;
export type { InputOptions, PluginOptions };
export { plugin as aglisten };
