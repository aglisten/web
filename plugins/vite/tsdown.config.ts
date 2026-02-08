import { defineConfig } from "@apst/tsdown";
import { dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            index: "./src/index.ts",
            hmr: "./src/hmr.ts",
        },
        platform: "node",
    },
    [
        esmPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);
