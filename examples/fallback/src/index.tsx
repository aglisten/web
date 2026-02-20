import type * as React from "react";

import { style } from "ammolite";

const App = (): React.JSX.Element => {
    return <div className={container}></div>;
};

const container: string = style({
    display: [
        "flex",
        "grid",
    ],
});

export { App };
