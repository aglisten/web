import type {
    InputOptions,
    OutputOptions,
    PluginOptions,
} from "#/@types/options";

import { createPlugin } from "#/create";

const Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { Plugin as AmmolitePlugin };
