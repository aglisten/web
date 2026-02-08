import type { ViteHotContext } from "vite/types/hot.js";

const NAME = "Aglisten" as const;

const PREFIX = "aglisten" as const;

const hot: ViteHotContext | undefined = (import.meta as any).hot;

if (hot) {
    // style
    hot.on(`${PREFIX}:style`, (data: string): void => {
        // only inject on client
        if (typeof window === "undefined") return void 0;

        let style: Element | null = document.querySelector(`style[${PREFIX}]`);

        if (!style) {
            style = document.createElement("style");
            style.setAttribute(PREFIX, "");
            style.setAttribute("type", "text/css");
            document.head.appendChild(style);
        }

        style.textContent = data;
    });

    // init
    hot.send(`${PREFIX}:init`);
} else {
    console.error("Failed to initialize Vite HMR.");
    console.error(`${NAME} requires Vite HMR to inject styles.`);
}
