[< Back](../README.md)

# Features

This is the documentation for the features.

## Type Safety

All the functions are type-safe by default.

## Reused Key-Value

Key-value pairs defined in the `style` function are automatically reused after their initial declaration.

```ts
// index.ts

import { style } from "ammolite";

const container: string = style({
    display: "block", // first declaration
});

const child: string = style({
    display: "block", // CSS reused
});
```

Output of the above code will be:

```js
// index.js

const container = "djcd17uu";

const child = "djcd17uu";
```

```css
/* index.css */

.djcd17uu {
    display: block;
}
```

## Style Conflict Resolution

With the `merge` function, style conflicts are automatically resolved.

```ts
import { style, merge } from "ammolite";

const containerA: string = style({
    display: "block",
    backgroundColor: "red",
});

const containerB: string = style({
    backgroundColor: "blue",
    color: "white",
});

/**
 * display: block;
 * backgroundColor: blue;
 * color: white;
 */
const containerC: string = merge(containerA, containerB);
```

## Fallback Value

Fallback values are supported by providing an array of values.

```ts
// index.ts

import { style } from "ammolite";

const container: string = style({
    display: ["flex", "grid"],
});
```

Output of the above code will be:

```js
// index.js

const container = "djcdoxg2";
```

```css
/* index.css */

.djcdoxg2 {
    display: flex; /* fallback */ 
    display: grid;
}
```
