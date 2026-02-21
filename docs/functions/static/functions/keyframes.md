[< Back](../README.md)

# `keyframes` Function

This function will create a keyframes.

```ts
import { keyframes } from "ammolite";

const fadeIn: string = keyframes({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
});

const fadeOut: string = keyframes({
    "0%": {
        opacity: 1,
    },
    "50%": {
        opacity: 0.5,
    },
    "100%": {
        opacity: 0,
    },
});
```

It is possible to use the keyframes in the `style` function:

```ts
import { style } from "ammolite";

const container: string = style({
    animationName: fadeIn,
    animationDuration: "1s",
    animationTimingFunction: "linear",
});
```
