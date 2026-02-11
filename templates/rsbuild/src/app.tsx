import type * as React from "react";

import { style } from "@aglisten/web";

const App = (): React.JSX.Element => {
    return (
        <div className={content}>
            <h1 className={h1}>Rsbuild with React</h1>
            <p className={p}>Start building amazing things with Rsbuild.</p>
        </div>
    );
};

const content: string = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    lineHeight: "1.1",
    textAlign: "center",
});

const h1: string = style({
    fontSize: "3.6rem",
    fontWeight: "700",
});

const p: string = style({
    fontSize: "1.2rem",
    fontWeight: "400",
    opacity: "0.5",
});

export { App };
