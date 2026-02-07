const path = require("node:path");

const { AglistenPlugin } = require("@aglisten/webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
            },
        },
    },
};

/** @type {import("webpack").Configuration} */
const config = (_, argv) => {
    const mode = argv.mode || "development";

    const dev = mode === "development";

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
            ],
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "index.js",
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "index.css",
            }),
            new AglistenPlugin({
                dev,
            }),
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                hash: true,
            }),
        ],
    };
};

module.exports = config;
