[< Back](../README.md)

# `style` Function

This function will create a style.

```ts
import { style } from "ammolite";

const container: string = style({
    display: "block",
});
```

For using the style in pure JavaScript/TypeScript:

```ts
const el: HTMLDivElement = document.createElement("div");

el.className = container;

document.body.append(el);
```

For using the style in React:

```tsx
import * as React from "react";

const Component = (): React.JSX.Element => {
    return <div className={container} />;
}
```
