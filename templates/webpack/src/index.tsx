import * as React from "react";
import * as DOM from "react-dom/client";

import { App } from "./app";

import "./styles/index.css";

const root: HTMLElement | null = document.getElementById("root");

if (!root) throw new Error("Failed to find root element");

DOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
