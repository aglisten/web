import type { CreatePluginOptions } from "#/@types/create";
import type { PluginOptions } from "#/@types/options";

import { PluginInstance } from "#/create/instance";

const createPlugin = (options?: CreatePluginOptions) => {
    return class Plugin extends PluginInstance {
        constructor(pluginOptions?: PluginOptions) {
            super(options, pluginOptions);
        }
    };
};

export type { CreatePluginOptions };
export { createPlugin };
