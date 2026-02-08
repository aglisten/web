import type { Style, StyleNode } from "##/processor/style/@types";

const styleNodeToCss = (node: StyleNode): string => {
    const kv: string = `${node.key}:${node.value};`;

    if (node.selectors.length === 0) return kv;

    let result: string = "";

    for (let i: number = 0; i < node.selectors.length; i++) {
        const selector: string | undefined = node.selectors[i];

        if (!selector) continue;

        result += `${selector}{`;
    }

    result += kv;

    for (let i: number = 0; i < node.selectors.length; i++) {
        const selector: string | undefined = node.selectors[i];

        if (!selector) continue;

        result += "}";
    }

    return result;
};

const styleNodeToCssWithClass = (node: StyleNode): string => {
    return `.${node.title}{${styleNodeToCss(node)}}`;
};

type ExportStylesOptions = {
    styles: Style[];
};

type ExportStylesResult = {
    cssList: string[];
};

const exportStyles = (options: ExportStylesOptions): ExportStylesResult => {
    const cssList: string[] = [];

    for (let i: number = 0; i < options.styles.length; i++) {
        const style: Style | undefined = options.styles[i];

        if (!style) continue;

        for (let j: number = 0; j < style.children.length; j++) {
            const node: StyleNode | undefined = style.children[j];

            if (!node) continue;

            cssList.push(styleNodeToCssWithClass(node));
        }
    }

    return {
        cssList,
    };
};

export type { ExportStylesOptions, ExportStylesResult };
export { styleNodeToCss, exportStyles };
