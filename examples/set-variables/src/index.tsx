import type * as React from "react";

import { setVariables, style, variables } from "@aglisten/web";

const App = (): React.JSX.Element => {
    return (
        <>
            <div style={darkTheme.props}>
                {/* variables values changed here */}
                <div className={container}></div>
            </div>
            <div style={blueTheme.props}>
                {/* variables values changed here */}
                <div className={container}></div>
            </div>
        </>
    );
};

const colors = variables({
    bg: "#fff",
    font: "#000",
});

const darkTheme = setVariables(colors, {
    bg: "#000",
    font: "#fff",
});

const blueTheme = setVariables(colors, {
    bg: "#1591ea",
    font: "#fff",
});

const container = style({
    backgroundColor: colors.bg,
    color: colors.font,
});

export { App };
