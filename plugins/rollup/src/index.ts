import type {
    InputOptions,
    OutputOptions,
    PluginOptions,
} from "#/@types/options";
import type { Plugin } from "#/create";

import { createPlugin } from "#/create";

const plugin: Plugin = createPlugin();

export type { InputOptions, OutputOptions, PluginOptions };
export { plugin as ammolite };
