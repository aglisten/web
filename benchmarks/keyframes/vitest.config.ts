import tsconfigPath from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    optimizeDeps: {
        exclude: [
            "@aglisten/runtime",
            "@aglisten/web",
        ],
    },
    test: {
        logHeapUsage: true,
    },
    plugins: [
        tsconfigPath(),
    ],
});
