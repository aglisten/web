import type { Plugin, PluginOptions } from "#/create";

import { createPlugin } from "#/create";

const plugin: Plugin = createPlugin();

export type { PluginOptions };
export { plugin as aglisten };
