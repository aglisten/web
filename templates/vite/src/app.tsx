import { keyframes, merge, style } from "@aglisten/web";
import * as React from "react";

import LogoVite from "/vite.svg";
import LogoReact from "./assets/react.svg";

const App = (): React.JSX.Element => {
    const [count, setCount] = React.useState(0);

    return (
        <>
            <div>
                <a
                    href="https://vite.dev"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src={LogoVite}
                        className={logo}
                        alt="Vite logo"
                    />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src={LogoReact}
                        className={merge(logo, logoReact)}
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>{"Vite + React"}</h1>
            <div className={card}>
                <button
                    type="button"
                    onClick={(): void =>
                        setCount((count: number): number => count + 1)
                    }
                >
                    {"count is "}
                    {count}
                </button>
                <p>
                    {"Edit "}
                    <code>{"src/App.tsx"}</code>
                    {" and save to test HMR"}
                </p>
            </div>
            <p className={readTheDocs}>
                {"Click on the Vite and React logos to learn more"}
            </p>
        </>
    );
};

const logo: string = style({
    height: "6em",
    padding: "1.5em",
    transition: "filter 300ms",
    willChange: "filter",
    "&:hover": {
        filter: "drop-shadow(0 0 2em #646cffaa)",
    },
});

const logoSpin: string = keyframes({
    from: {
        transform: "rotate(0deg)",
    },
    to: {
        transform: "rotate(360deg)",
    },
});

const logoReact: string = style({
    "@media (prefers-reduced-motion: no-preference)": {
        animationName: logoSpin,
        animationIterationCount: "infinite",
        animationDuration: "20s",
        animationTimingFunction: "linear",
    },
    "&:hover": {
        filter: "drop-shadow(0 0 2em #61dafbaa)",
    },
});

const card: string = style({
    padding: "2em",
});

const readTheDocs: string = style({
    color: "#888",
});

export { App };
