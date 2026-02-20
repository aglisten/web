import { variables } from "ammolite";

const htmlDark = "html[data-theme='dark']" as const;

const colors = variables({
    bg: {
        default: "#fff",
        [htmlDark]: "#000",
    },
    font: {
        default: "#000",
        [htmlDark]: "#fff",
    },
});

type Colors = typeof colors;

export type { Colors };
export { colors };
