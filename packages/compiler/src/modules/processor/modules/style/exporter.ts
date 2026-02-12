import type { Style, StyleNode } from "##/processor/style/@types";

const styleNodeToCss = (node: StyleNode): string => {
    const { selectors, key, values } = node;

    const kvParts: string[] = [];

    for (let i: number = 0; i < values.length; i++) {
        const value: string | undefined = values[i];

        if (!value) continue;

        kvParts.push(`${key}:${value};`);
    }

    if (selectors.length === 0) return kvParts.join("");

    const resultParts: string[] = [];

    for (let i: number = 0; i < selectors.length; i++) {
        const selector: string | undefined = selectors[i];

        if (!selector) continue;

        resultParts.push(`${selector}{`);
    }

    resultParts.push(...kvParts);

    for (let i: number = 0; i < selectors.length; i++) {
        const selector: string | undefined = selectors[i];

        if (!selector) continue;

        resultParts.push("}");
    }

    return resultParts.join("");
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
