import tsconfigPath from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    optimizeDeps: {
        exclude: [
            "@ammolite/runtime",
            "ammolite",
        ],
    },
    test: {
        logHeapUsage: true,
    },
    plugins: [
        tsconfigPath(),
    ],
});
