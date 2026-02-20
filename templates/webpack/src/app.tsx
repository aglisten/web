import type * as React from "react";

import { style } from "ammolite";

import { Description } from "./components/description";
import { Heading } from "./components/heading";

const App = (): React.JSX.Element => {
    return (
        <div className={container}>
            <Heading />
            <Description />
        </div>
    );
};

const container: string = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate3D(-50%, -50%, 0)",
});

export { App };
