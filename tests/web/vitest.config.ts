import tsconfigPath from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        logHeapUsage: true,
    },
    plugins: [
        tsconfigPath(),
    ],
});
