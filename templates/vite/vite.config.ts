import { aglisten } from "@aglisten/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        aglisten(),
        react(),
    ],
    server: {
        port: 3001,
    },
    preview: {
        port: 3000,
    },
});
