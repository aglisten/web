[< Back](../README.md)

# `merge` Function

This function will merge styles from `style` function to avoid style conflicts.

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
