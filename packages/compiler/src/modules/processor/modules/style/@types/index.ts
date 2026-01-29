type StyleNode = {
    // Title of the style node,
    // for class name usage
    title: string;
    // Included selectors for current
    // style node (e.g. #xxx, .child)
    selectors: string[];
    // Style key (e.g. display, color)
    key: string;
    // Style value (e.g. block, blue)
    value: string;
};

type Style = {
    // ID of the style
    id: string;
    // Style nodes
    children: StyleNode[];
};

export type { StyleNode, Style };
