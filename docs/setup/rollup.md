[< Back](../README.md)

# Rollup Plugin

This is the documentation for the Rollup plugin.

## Installation

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/rollup

# Yarn
yarn add -D @ammolite/rollup

# pnpm
pnpm add -D @ammolite/rollup
```

## Configuration

Add the following code into `rollup.config.js`:

```js
// rollup.config.js

import { defineConfig } from "rollup";

import { ammolite } from "@ammolite/rollup";

export default defineConfig({
    plugins: [ammolite()],
});
```
