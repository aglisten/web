import type { RolldownOptions } from "rolldown";

import { ammolite } from "@ammolite/rollup";
import { defineConfig } from "rolldown";

const options: RolldownOptions = {
    input: "./src/index.ts",
    output: {
        dir: "./dist/esm",
        format: "esm",
        entryFileNames: "[name].mjs",
        assetFileNames: "[name][extname]",
    },
    experimental: {
        attachDebugInfo: "none",
    },
    plugins: [
        ammolite(),
    ],
};

export default defineConfig([
    options,
    {
        ...options,
        output: {
            ...options.output,
            dir: "./dist/cjs",
            format: "cjs",
            entryFileNames: "[name].js",
        },
    },
]);
