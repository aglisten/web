import type * as React from "react";

import { style, variables } from "ammolite";
import Image from "next/image";

export default (): React.JSX.Element => {
    return (
        <div className={page}>
            <main className={main}>
                <Image
                    className={logo}
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />
                <div className={intro}>
                    <h1>To get started, edit the page.tsx file.</h1>
                    <p>
                        Looking for a starting point or more instructions? Head
                        over to{" "}
                        <a
                            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Templates
                        </a>{" "}
                        or the{" "}
                        <a
                            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learning
                        </a>{" "}
                        center.
                    </p>
                </div>
                <div className={ctas}>
                    <a
                        className={primary}
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className={logo}
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={16}
                            height={16}
                        />
                        Deploy Now
                    </a>
                    <a
                        className={secondary}
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Documentation
                    </a>
                </div>
            </main>
        </div>
    );
};

const darkTheme = "@media (prefers-color-scheme: dark)" as const;

const colors = variables({
    background: {
        default: "#fafafa",
        [darkTheme]: "#000",
    },
    foreground: {
        default: "#fff",
        [darkTheme]: "#000",
    },
    textPrimary: {
        default: "#000",
        [darkTheme]: "#ededed",
    },
    textSecondary: {
        default: "#666",
        [darkTheme]: "#999",
    },
    buttonPrimaryHover: {
        default: "#383838",
        [darkTheme]: "#ccc",
    },
    buttonSecondaryHover: {
        default: "#f2f2f2",
        [darkTheme]: "#1a1a1a",
    },
    buttonSecondaryBorder: {
        default: "#ebebeb",
        [darkTheme]: "#1a1a1a",
    },
});

const page: string = style({
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-geist-sans)",
    backgroundColor: colors.background,
});

const main: string = style({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "800px",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: colors.foreground,
    padding: "120px 60px",

    "@media (max-width: 600px)": {
        padding: "48px 24px",
    },
});

const logo: string = style({
    "@media (prefers-color-scheme: dark)": {
        filter: "invert()",
    },
});

const intro: string = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    gap: "24px",

    "@media (max-width: 600px)": {
        gap: "16px",
    },

    h1: {
        maxWidth: "320px",
        fontSize: "40px",
        fontWeight: 600,
        lineHeight: "48px",
        letterSpacing: "-2.4px",
        textWrap: "balance",
        color: colors.textPrimary,

        "@media (max-width: 600px)": {
            fontSize: "32px",
            lineHeight: "40px",
            letterSpacing: "-1.92px",
        },
    },

    p: {
        maxWidth: "440px",
        fontSize: "18px",
        lineHeight: "32px",
        textWrap: "balance",
        color: colors.textSecondary,
    },

    a: {
        fontWeight: 500,
        color: colors.textPrimary,
    },
});

const ctas: string = style({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    maxWidth: "440px",
    gap: "16px",
    fontSize: "14px",

    a: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40px",
        padding: "0 16px",
        borderRadius: "128px",
        border: "1px solid transparent",
        transition: ".2s",
        cursor: "pointer",
        width: "fit-content",
        fontWeight: 500,
    },
});

const primary: string = style({
    background: colors.textPrimary,
    color: colors.background,
    gap: "8px",

    "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
            background: colors.buttonPrimaryHover,
            borderColor: "transparent",
        },
    },
});

const secondary: string = style({
    borderColor: colors.buttonSecondaryBorder,

    "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
            background: colors.buttonSecondaryHover,
            borderColor: "transparent",
        },
    },
});
