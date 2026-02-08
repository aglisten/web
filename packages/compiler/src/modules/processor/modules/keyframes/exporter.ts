import type { KeyframeNode, Keyframes } from "##/processor/keyframes/@types";
import type { StyleNode } from "##/processor/style/@types";

import { styleNodeToCss } from "##/processor/style/exporter";

const keyframeNodeToCss = (node: KeyframeNode): string => {
    let result: string = "";

    result += `${node.title}{`;

    for (let i: number = 0; i < node.children.length; i++) {
        const styleNode: StyleNode | undefined = node.children[i];

        if (!styleNode) continue;

        result += styleNodeToCss(styleNode);
    }

    result += "}";

    return result;
};

const keyframesToCss = (keyframes: Keyframes): string => {
    const title: string = keyframes.title;

    let result: string = `@keyframes ${title}{`;

    for (let i: number = 0; i < keyframes.children.length; i++) {
        const node: KeyframeNode | undefined = keyframes.children[i];

        if (!node) continue;

        result += keyframeNodeToCss(node);
    }

    result += "}";

    return result;
};

type ExportAllKeyframesOptions = {
    keyframesList: Keyframes[];
};

type ExportStylesResult = {
    cssList: string[];
};

const exportAllKeyframes = (
    options: ExportAllKeyframesOptions,
): ExportStylesResult => {
    const cssList: string[] = [];

    for (let i: number = 0; i < options.keyframesList.length; i++) {
        const keyframes: Keyframes | undefined = options.keyframesList[i];

        if (!keyframes) continue;

        cssList.push(keyframesToCss(keyframes));
    }

    return {
        cssList,
    };
};

export type { ExportAllKeyframesOptions, ExportStylesResult };
export { exportAllKeyframes };
