[< Back](../README.md)

# `variables` Function

This function will create variables.

```ts
import { variables } from "ammolite";

type Colors = {
    bg: string;
    blue: string;
};

const htmlDark = "html[data-theme='dark']" as const;

const colors: Colors = variables({
    bg: {
        default: "#fff",
        [htmlDark]: "#000",
    },
    blue: "#1591ea",
});
```

And the variables will be defined like this:

```css
:root {
    --xxx: #fff;
    --yyy: #1591ea;
}

html[data-theme='dark'] {
    --xxx: #000;
}
```

It is possible to use the variables in the `style` function:

```ts
import { style } from "ammolite";

const container: string = style({
    backgroundColor: colors.bg,
    color: colors.blue,
});
```
