import { variables } from "ammolite";

const themeDark = "html[data-theme='dark']" as const;

const themeBlue = "html[data-theme='blue']" as const;

const colors = variables({
    bg: {
        default: "#eee",
        [themeDark]: "#000",
        [themeBlue]: "#0b3d91",
    },
    fg: {
        default: "#fff",
        [themeDark]: "#111",
        [themeBlue]: "#3498db",
    },
});

const textColors = variables({
    default: {
        default: "#111111",
        [themeDark]: "#f5f5f5",
        [themeBlue]: "#f5f5f5",
    },
    sub: {
        default: "#6b7280",
        [themeDark]: "#9ca3af",
        [themeBlue]: "#9ca3af",
    },
});

const sizeLarge = "html[data-size='large']" as const;
const sizeCompact = "html[data-size='compact']" as const;

const textSizes = variables({
    sm: {
        default: "0.875rem",
        [sizeLarge]: "1rem",
        [sizeCompact]: "0.75rem",
    },
    md: {
        default: "1rem",
        [sizeLarge]: "1.125rem",
        [sizeCompact]: "0.875rem",
    },
    lg: {
        default: "1.25rem",
        [sizeLarge]: "1.5rem",
        [sizeCompact]: "1.125rem",
    },
});

export { colors, textColors, textSizes };
