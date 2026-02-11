import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            index: "./src/index.ts",
            loader: "./src/loader.ts",
            // internal
            "plugin/create/index": "./src/plugin/create/index.ts",
            "plugin/create/loader": "./src/plugin/create/loader.ts",
        },
        platform: "node",
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset(),
    ],
);
