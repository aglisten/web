import { ammolite } from "@ammolite/rollup";
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
        ammolite(),
        typescript({
            outDir: "./dist/esm",
        }),
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
        plugins: [
            ammolite(),
            typescript({
                outDir: "./dist/cjs",
            }),
        ],
    },
]);
