import type { VariablesSetter } from "@aglisten/web";
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
