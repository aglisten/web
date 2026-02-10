import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            index: "./src/index.ts",
            loader: "./src/loader.ts",
            // internal
            "plugin/create": "./src/plugin/create.ts",
            "plugin/loader": "./src/plugin/loader.ts",
        },
        platform: "node",
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset(),
    ],
);
