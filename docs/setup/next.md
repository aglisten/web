[< Back](../README.md)

# Next.js Plugin

This is the documentation for the Next.js plugin.

## Installation

Install this package as a dev dependency in the project:

```sh
# npm
npm i -D @ammolite/webpack @ammolite/postcss

# Yarn
yarn add -D @ammolite/webpack @ammolite/postcss

# pnpm
pnpm add -D @ammolite/webpack @ammolite/postcss
```

## Configuration

Add the following code into `next.config.ts`:

```ts
// next.config.ts

import type { NextConfig } from "next";

let config: NextConfig = {
    // ...
    turbopack: {
        rules: {
            "*.{js,jsx,ts,tsx}": {
                loaders: [
                    "@ammolite/webpack/loader",
                ],
            },
        }
    }
};

export default config;
```

And add the following code into `postcss.config.mjs`:

```js
// postcss.config.mjs

export default {
    plugins: [
        "@ammolite/postcss",
    ],
};
```

Or running with a Ammolite UI library:

```js
// postcss.config.mjs

/** @type {import("postcss-load-config").Config} */
export default {
    plugins: [
        [
            "@ammolite/postcss",
            {
                include: [
                    "./src",
                    "library-name",
                    // ...
                ]
            }
        ]
    ],
};
```

Or follow the recommended configuration:

```sh
# npm
npm i -D postcss-preset-env postcss-flexbugs-fixes

# Yarn
yarn add -D postcss-preset-env postcss-flexbugs-fixes

# pnpm
pnpm add -D postcss-preset-env postcss-flexbugs-fixes
```

```js
// postcss.config.mjs

/** @type {import("postcss-preset-env").pluginOptions} */
const presetEnvOptions = {
    autoprefixer: {
        flexbox: "no-2009",
    },
    stage: 3,
    features: {
        "custom-properties": false,
    }
};

/** @type {import("postcss-load-config").Config} */
export default {
    plugins: [
        ["postcss-preset-env", presetEnvOptions],
        "postcss-flexbugs-fixes",
        "@ammolite/postcss",
    ],
};
```

In case there are no any CSS file, create one and import it:

```tsx
// src/app/layout.tsx

import type * as React from "react";

import "index.css"

export default (): React.JSX.Element => {
    // ...
}
```
