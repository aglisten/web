import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            index: "./src/index.ts",
            loader: "./src/loader-external.ts",
            // internal
            create: "./src/create/index.ts",
            "loader-internal": "./src/loader-internal.ts",
        },
        platform: "node",
        // https://github.com/rolldown/tsdown/issues/572
        unbundle: false,
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset(),
    ],
);
