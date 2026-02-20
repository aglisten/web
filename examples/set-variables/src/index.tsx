import type { VariablesSetter } from "ammolite";
import type * as React from "react";

import { setVariables, style, variables } from "ammolite";

const App = (): React.JSX.Element => {
    return (
        <>
            <div>
                {/* default variable values are used here */}
                <div className={container}></div>
            </div>
            <div style={darkTheme.props}>
                {/* variable values are overridden in this scope */}
                <div className={container}></div>
            </div>
            <div style={blueTheme.props}>
                {/* variable values are overridden in this scope */}
                <div className={container}></div>
            </div>
        </>
    );
};

type Colors = {
    bg: string;
    font: string;
};

const colors: Colors = variables({
    bg: "#fff",
    font: "#000",
});

const darkTheme: VariablesSetter = setVariables(colors, {
    bg: "#000",
    font: "#fff",
});

const blueTheme: VariablesSetter = setVariables(colors, {
    bg: "#1591ea",
    font: "#fff",
});

const container: string = style({
    backgroundColor: colors.bg,
    color: colors.font,
});

export { App };
