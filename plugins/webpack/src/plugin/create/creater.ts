import type { Runtime } from "@aglisten/runtime";
import type { Format, Partial } from "ts-vista";

import type { PluginOptions } from "#/plugin/create/instance";

import { PluginInstance } from "#/plugin/create/instance";

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

export type { CreatePluginOptions };
export { createPlugin };
