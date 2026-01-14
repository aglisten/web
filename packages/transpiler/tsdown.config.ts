import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            index: "./src/index.ts",
            "modules/collector/index": "./src/modules/collector/index.ts",
            "modules/preprocessor/index": "./src/modules/preprocessor/index.ts",
            "modules/processor/index": "./src/modules/processor/index.ts",
        },
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);
