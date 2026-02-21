[< Back](../README.md)

# `setVariables` Function

This function will update variables dynamically.

```tsx
import type { VariablesSetter } from "ammolite";

import { variables, setVariables } from "ammolite";

type Colors = {
    bg: string;
    font: string;
    blue: string;
}

const htmlDark = "html[data-theme='dark']" as const;

const colors: Colors = variables({
    bg: {
        default: "#fff",
        [htmlDark]: "#000",
    },
    font: {
        default: "#000",
        [htmlDark]: "#fff",
    },
    blue: "#1591ea",
});

const thmeReverse: VariablesSetter = setVariables(colors, {
    blue: "#ea6e15",
});
```

For using the function in pure JavaScript/TypeScript:

```ts
const el: HTMLDivElement = document.createElement("div");

el.style = themeReverse.attrs;

document.body.append(el);
```

For using the function in React:

```tsx
import type * as React from "react";

const App = (): React.JSX.Element => {
    return (
        <>
            <div>
                {/* default variable values are used here */}
            </div>
            <div style={thmeReverse.props}>
                {/* variable values are overridden in this scope */}
            </div>
        </>
    )
};
```
