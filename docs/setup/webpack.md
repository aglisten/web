[< Back](../README.md)

# Webpack Plugin

This is the documentation for the Webpack plugin.

## Installation

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/webpack

# Yarn
yarn add -D @ammolite/webpack

# pnpm
pnpm add -D @ammolite/webpack
```

## Configuration

Add the following code into `webpack.config.js`:

```js
// webpack.config.js

const { AmmolitePlugin } = require("@ammolite/webpack");

module.exports = {
    plugins: [new AmmolitePlugin()],
};
```

For linking stylesheet into HTML, use `html-webpack-plugin`:

```sh
# npm
npm i -D html-webpack-plugin

# Yarn
yarn add -D html-webpack-plugin

# pnpm
pnpm add -D html-webpack-plugin
```

```js
// webpack.config.js

const { AmmolitePlugin } = require("@ammolite/webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    plugins: [
        new AmmolitePlugin(),
        new HtmlWebpackPlugin(),
    ],
};
```

## PostCSS Configuration

Ammolite also supports PostCSS with the `@ammolite/postcss` package.

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/postcss css-loader postcss postcss-loader

# Yarn
yarn add -D @ammolite/postcss css-loader postcss postcss-loader

# pnpm
pnpm add -D @ammolite/postcss css-loader postcss postcss-loader
```

Add the following code into `webpack.config.js`:

```js
// webpack.config.js

const { AmmolitePlugin } = require("@ammolite/webpack");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "css-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    plugins: [
        new AmmolitePlugin({
            emit: false,
        }),
    ],
};
```

For integration with `html-webpack-plugin`:

```sh
# npm
npm i -D mini-css-extract-plugin

# Yarn
yarn add -D mini-css-extract-plugin

# pnpm
pnpm add -D mini-css-extract-plugin
```

```js
// webpack.config.js

const { AmmolitePlugin } = require("@ammolite/webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    plugins: [
        new AmmolitePlugin({
            emit: false,
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin(),
    ],
};
```

Add the following code into `postcss.config.js`:

```js
// postcss.config.js

const ammolite = require("@ammolite/postcss");

module.exports = {
    plugins: [
        ammolite(),
    ],
};
```

In case there are no any CSS file, create one and import it:

```js
// src/index.js (entry file)

import "index.css"

// ...
```
