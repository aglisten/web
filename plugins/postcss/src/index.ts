import type { CreateRuntimeOptions, Runtime } from "@aglisten/runtime";
import type { PluginCreator, Root } from "postcss";
import type { Format } from "ts-vista";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { createRuntime } from "@aglisten/runtime";

import { getPaths } from "#/functions/path";
import { name } from "../package.json";

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

const plugin: PluginCreator<PluginOptions> = (options?: PluginOptions) => {
    return {
        postcssPlugin: name,
        async Once(root: Root, { postcss, result }): Promise<void> {
            const emit: boolean = options?.emit ?? true;

            if (!emit) return void 0;

            const cwd: string = options?.cwd ?? process.cwd();

            const filename: string = options?.filename ?? "aglisten";

            const cssFile: string = `${Path.parse(filename).name}.css`;

            const runtime: Runtime = createRuntime({
                cwd,
                include: options?.include,
                exclude: options?.exclude,
            });

            const include: string[] = await getPaths({
                cwd,
                paths: options?.include ?? [
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
                    parent: cssFile,
                });
            }

            // append result
            root.append(
                postcss.parse(await runtime.getCSS(), {
                    from: cssFile,
                }),
            );
        },
    };
};

plugin.postcss = true;

export type { PluginOptions };
export default plugin;
export { plugin as aglisten };
