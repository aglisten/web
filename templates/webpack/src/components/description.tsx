import type * as React from "react";

import { style } from "@aglisten/web";

const Description = (): React.JSX.Element => {
    return <p className={container}>{"A Webpack example"}</p>;
};

const container: string = style({
    display: "block",
    color: "#007acc",
    fontSize: "16px",
    textAlign: "center",
});

export { Description };
