import type * as React from "react";

import { style } from "ammolite";

import { colors } from "../styles/variables/colors";

const Description = (): React.JSX.Element => {
    return <p className={container}>{"A Webpack example"}</p>;
};

const container: string = style({
    display: "block",
    color: colors.blue,
    fontSize: "16px",
    textAlign: "center",
});

export { Description };
