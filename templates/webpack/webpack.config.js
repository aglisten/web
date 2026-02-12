const path = require("node:path");

const { AglistenPlugin } = require("@aglisten/webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** @type {import("webpack").Configuration} */
const config = (_, argv) => {
    /** @type {string} */
    const mode = argv.mode || "development";

    /** @type {boolean} */
    const isDev = mode === "development";

    /** @type {import("@swc/core").Options} */
    const swcOptions = {
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: true,
            },
            transform: {
                react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                },
            },
        },
    };

    /** @type {import("webpack").Configuration["plugins"]} */
    const plugins = [
        !isDev && new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "index.css",
        }),
        new AglistenPlugin({
            dev: isDev,
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            hash: true,
        }),
    ];

    return {
        mode,
        entry: "./src/index.tsx",
        resolve: {
            extensions: [
                ".tsx",
                ".jsx",
                ".ts",
                ".js",
                ".json",
            ],
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "swc-loader",
                        options: swcOptions,
                    },
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                    ],
                },
                {
                    test: /\.svg$/,
                    type: "asset",
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "index.js",
        },
        plugins: plugins.filter(Boolean),
    };
};

module.exports = config;
