import type * as React from "react";

import { merge, style } from "ammolite";

const App = (): React.JSX.Element => {
    return (
        <>
            {/* display: "flex", color: "#fff" */}
            <div className={containerD}></div>
        </>
    );
};

const containerA: string = style({
    display: "block",
    color: "#000",
});

const containerB: string = style({
    display: "flex",
});

const containerC: string = style({
    color: "#fff",
});

const containerD: string = merge(containerA, containerB, containerC);

export { App };
