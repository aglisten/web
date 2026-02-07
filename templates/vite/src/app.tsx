import { keyframes, style } from "@aglisten/web";
import clsx from "clsx";
import * as React from "react";

import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";

const App = (): React.JSX.Element => {
    const [count, setCount] = React.useState(0);

    return (
        <>
            <div className={spin}>
                <a
                    href="https://vite.dev"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src={viteLogo}
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
                        src={reactLogo}
                        className={clsx(logo, "react")}
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

const logoSpin: string = keyframes({
    from: {
        transform: "rotate(0deg)",
    },
    to: {
        transform: "rotate(360deg)",
    },
});

const spin: string = style({
    "@media (prefers-reduced-motion: no-preference)": {
        a: {
            "&:nth-of-type(2)": {
                ".logo": {
                    animationName: logoSpin,
                    animationDuration: "20s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "linear",
                },
            },
        },
    },
});

const logo: string = style({
    height: "6em",
    padding: "1.5em",
    transition: "filter 300ms",
    willChange: "filter",
    "&:hover": {
        filter: "drop-shadow(0 0 2em #646cffaa)",
    },
    "&.react:hover": {
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
