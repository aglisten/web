import { aglisten } from "@aglisten/rollup";
import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "./src/index.tsx",
    clean: true,
    inputOptions: {
        transform: {
            jsx: "preserve",
        },
        experimental: {
            attachDebugInfo: "none",
        },
    },
    outputOptions: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
    },
    plugins: [
        aglisten(),
    ],
});
