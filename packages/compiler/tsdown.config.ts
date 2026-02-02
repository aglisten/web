import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            index: "./src/index.ts",
            // internal
            "ast/parse": "./src/ast/parse.ts",
            "ast/codegen": "./src/ast/codegen.ts",
            "contexts/compiler": "./src/contexts/compiler.ts",
            "errors/compile/index": "./src/errors/compile/index.ts",
            "modules/collector/index": "./src/modules/collector/index.ts",
            "modules/preprocessor/index": "./src/modules/preprocessor/index.ts",
            "modules/bundler/index": "./src/modules/bundler/index.ts",
            "modules/processor/index": "./src/modules/processor/index.ts",
        },
        platform: "node",
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
