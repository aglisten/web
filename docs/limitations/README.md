[< Back](../README.md)

# Limitations

This is the documentation for the limitations.

## Declaration

All static APIs must be declared at the top level. Nested declarations inside other functions will not work.

```ts
// ❌ This does not work

import { style, merge } from "ammolite";

const component = (): HTMLDivElement => {
    // static
    const containerA: string = style({
        backgroundColor: "black",
        width: 400,
        height: 400,
    });

    // static
    const containerB: string = style({
        backgroundColor: "white",
    });

    // dynamic
    const container: string = merge(containerA, containerB);

    const el: HTMLDivElement = document.createElement("div");
    el.className = container;

    return el;
};

document.body.append(component());
```

Please declare all the functions in the top level:

```ts
// ✅ This works

import { style, merge } from "ammolite";

// static
const containerA: string = style({
    backgroundColor: "black",
    width: 400,
    height: 400,
});

// static
const containerB: string = style({
    backgroundColor: "white",
});

const component = (): HTMLDivElement => {
    // dynamic
    const container: string = merge(containerA, containerB);

    const el: HTMLDivElement = document.createElement("div");
    el.className = container;

    return el;
};

document.body.append(component());
```

## Support for SvelteKit 

Vite plugin does not support SvelteKit out of the box. 

Therefore, `@ammolite/postcss` is required to work with SvelteKit.

For more information, please refer to [Vite plugin API (transformIndexHtml)](https://vite.dev/guide/api-plugin#transformindexhtml).
