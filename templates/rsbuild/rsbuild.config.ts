import { pluginAmmolite } from "@ammolite/rsbuild";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    plugins: [
        pluginAmmolite(),
        pluginReact(),
    ],
});
