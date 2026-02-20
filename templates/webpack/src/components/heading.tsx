import type * as React from "react";

import { merge, style } from "ammolite";

import { colors } from "../styles/variables/colors";

const Heading = (): React.JSX.Element => {
    return <h1 className={merge(containerA, containerB)}>{"Hello, World!"}</h1>;
};

const containerA: string = style({
    display: "block",
    color: "#000",
    fontSize: "48px",
    fontWeight: "bold",
});

const containerB: string = style({
    color: colors.blue,
});

export { Heading };
