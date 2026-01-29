import type { KeyframeNode } from "##/processor/keyframes/@types";
import type { StyleNode } from "##/processor/style/@types";

import { fixedFnv1a } from "#/modules/processor/functions/hash";

type CreateKeyframesTitleOptions = {
    children: KeyframeNode[];
};

type CreateKeyframesTitleResult = {
    title: string;
};

const createKeyframesTitle = ({
    children,
}: CreateKeyframesTitleOptions): CreateKeyframesTitleResult => {
    let title: string = "";

    for (let i: number = 0; i < children.length; i++) {
        const child: KeyframeNode | undefined = children[i];

        if (!child) continue;

        title += child.title;

        for (let j: number = 0; j < child.children.length; j++) {
            const node: StyleNode | undefined = child.children[j];

            if (!node) continue;

            title += node.title;
        }
    }

    title = fixedFnv1a(title, 7);

    title = `k${title}`;

    return {
        title,
    };
};

export type { CreateKeyframesTitleOptions, CreateKeyframesTitleResult };
export { createKeyframesTitle };
