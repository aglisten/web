[< Back](../README.md)

# Vite Plugin

This is the documentation for the Vite plugin.

## Installation

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/vite

# Yarn
yarn add -D @ammolite/vite

# pnpm
pnpm add -D @ammolite/vite
```

## Configuration

Add the following code into `vite.config.ts`:

```ts
// vite.config.ts

import { defineConfig } from "vite";

import { ammolite } from "@ammolite/vite";

export default defineConfig({
    plugins: [ammolite()],
});
```

## PostCSS Configuration

Ammolite also supports PostCSS with the `@ammolite/postcss` package.

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/postcss

# Yarn
yarn add -D @ammolite/postcss

# pnpm
pnpm add -D @ammolite/postcss
```

Add the following code into `vite.config.ts`:

```ts
// vite.config.ts

import { defineConfig } from "vite";

import { ammolite } from "@ammolite/vite";

import ammolitePostCSS from "@ammolite/postcss";

export default defineConfig({
    plugins: [
        ammolite({
            emit: false,
        }),
    ],
    css: {
        postcss: {
            plugins: [
                ammolitePostCSS(),
            ],
        }
    },
});
```

In case there are no any CSS file, create one and import it:

```tsx
// src/index.tsx (or any entry file)

import "index.css"

// ...
```
