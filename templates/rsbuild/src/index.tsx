import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { App } from "#/app";

import "#/styles/index.css";

const rootEl: HTMLElement | null = document.getElementById("root");

if (!rootEl) throw new Error("Failed to find root element");

ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
