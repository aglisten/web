import type * as React from "react";

import { style } from "@aglisten/web";

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
