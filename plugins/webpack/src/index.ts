import type {
    InputOptions,
    OutputOptions,
    PluginOptions,
} from "#/@types/options";

import { createPlugin } from "#/create";

const Plugin = createPlugin();

export default Plugin;
export type { InputOptions, OutputOptions, PluginOptions };
export { Plugin as AglistenPlugin };
