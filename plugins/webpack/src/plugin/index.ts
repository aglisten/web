import type { PluginOptions } from "#/plugin/create/instance";

import { createPlugin } from "#/plugin/create/creator";

const Plugin = createPlugin();

export type { PluginOptions };
export { Plugin };
