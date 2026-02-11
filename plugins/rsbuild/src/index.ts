import type {
    InputOptions,
    OutputOptions as WebpackOutputOptions,
    PluginOptions as WebpackPluginOptions,
} from "@aglisten/webpack";
import type {
    RsbuildConfig,
    RsbuildPlugin,
    RsbuildPluginAPI,
} from "@rsbuild/core";
import type { Format, Omit } from "ts-vista";

import * as Path from "node:path";

import { createPlugin } from "@aglisten/webpack/create";

import { name } from "../package.json";

type OutputOptions = Format<Omit<WebpackOutputOptions, "dir">>;

type PluginOptions = Format<
    Omit<WebpackPluginOptions, "output"> & {
        /**
         * Output options.
         */
        output?: OutputOptions;
    }
>;

const getFileName = (
    rsbuildConfig: RsbuildConfig,
    options?: PluginOptions,
): string => {
    const isDev: boolean = process.env.NODE_ENV === "development";

    const parsedPath: Path.ParsedPath = Path.parse(
        options?.output?.fileName ?? "aglisten",
    );

    const ext: string = parsedPath.ext === "" ? ".css" : parsedPath.ext;

    let fileName: string = `${parsedPath.name}${ext}`;

    if (isDev) return fileName;

    const filenameHash: string | boolean | undefined =
        rsbuildConfig.output?.filenameHash;

    if (typeof filenameHash === "boolean" && filenameHash === true) {
        fileName = `${parsedPath.name}.[contenthash:8]${ext}`;
    } else if (typeof filenameHash === "string") {
        fileName = `${parsedPath.name}.[${filenameHash}]${ext}`;
    }

    return fileName;
};

const plugin = (options?: PluginOptions): RsbuildPlugin => {
    return {
        name,
        async setup(api: RsbuildPluginAPI): Promise<void> {
            const Plugin = createPlugin({
                name,
            });

            api.modifyRsbuildConfig(
                (
                    userConfig: RsbuildConfig,
                    { mergeRsbuildConfig },
                ): RsbuildConfig => {
                    const config: RsbuildConfig = {
                        tools: {
                            rspack: {
                                plugins: [
                                    new Plugin({
                                        ...options,
                                        output: {
                                            dir:
                                                userConfig.output?.distPath
                                                    ?.css ?? "./static/css",
                                            fileName: getFileName(
                                                userConfig,
                                                options,
                                            ),
                                        },
                                    }),
                                ],
                            },
                        },
                    };

                    return mergeRsbuildConfig(userConfig, config);
                },
            );
        },
    };
};

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as pluginAglisten };
