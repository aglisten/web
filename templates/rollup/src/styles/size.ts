import { variables } from "@aglisten/web";

const htmlLarge = "html[data-size='large']" as const;

const sizes = variables({
    xs: {
        default: 12,
        [htmlLarge]: 14,
    },
    s: {
        default: 14,
        [htmlLarge]: 16,
    },
    m: {
        default: 16,
        [htmlLarge]: 18,
    },
    l: {
        default: 18,
        [htmlLarge]: 20,
    },
    xl: {
        default: 20,
        [htmlLarge]: 22,
    },
});

type Sizes = typeof sizes;

export type { Sizes };
export { sizes };
