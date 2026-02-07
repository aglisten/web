import { aglisten } from "@aglisten/rollup";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

/** @type {import("rollup").RollupOptions} */
const config = {
    input: "./src/index.ts",
    output: {
        dir: "./dist/esm",
        format: "esm",
        entryFileNames: "[name].mjs",
        assetFileNames: "[name][extname]",
    },
    plugins: [
        aglisten(),
        typescript(),
    ],
};

export default defineConfig([
    config,
    {
        ...config,
        output: {
            ...config.output,
            dir: "./dist/cjs",
            format: "cjs",
            entryFileNames: "[name].js",
        },
    },
]);
