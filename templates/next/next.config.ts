import type { NextConfig } from "next/dist/types";

const nextConfig: NextConfig = {
    trailingSlash: false,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        unoptimized: true,
    },
    reactStrictMode: true,
    turbopack: {
        rules: {
            "*.{js,jsx,ts,tsx}": {
                loaders: [
                    "@aglisten/webpack/loader",
                ],
            },
        },
    },
};

export default nextConfig;
