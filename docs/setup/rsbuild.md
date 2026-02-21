[< Back](../README.md)

# Rsbuild Plugin

This is the documentation for the Rsbuild plugin.

## Installation

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/rsbuild

# Yarn
yarn add -D @ammolite/rsbuild

# pnpm
pnpm add -D @ammolite/rsbuild
```

## Configuration

Add the following code into `rsbuild.config.ts`:

```ts
// rsbuild.config.ts

import { defineConfig } from "@rsbuild/core";

import { pluginAmmolite } from "@ammolite/rsbuild";

export default defineConfig({
    plugins: [
        pluginAmmolite(),
    ],
});
```
