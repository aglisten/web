import type {
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { KeyframeNode } from "##/processor/keyframes/@types";

import { collectStyleNodes } from "##/processor/style/collector/node";

type ColelctPropKeyframeNodesOptions = {
    program: Program;
    prop: ObjectProperty;
};

type CollectPropKeyframeNodesResult = {
    keyframeNodes: KeyframeNode[];
};

const collectPropKeyframeNodes = (
    options: ColelctPropKeyframeNodesOptions,
): CollectPropKeyframeNodesResult => {
    const prop: ObjectProperty = options.prop;

    let title: string;

    // from: {}
    if (prop.key.type === "Identifier") {
        title = prop.key.name;
    }
    // "0%": {} // 0: {}
    if (prop.key.type === "Literal") {
        const value: string | number | bigint | boolean | RegExp | null =
            prop.key.value;

        if (value === null) {
            throw new Error(
                `keyframes: null is not supported as a key literal`,
            );
        }

        if (typeof value === "number") {
            title = `${value}%`;
        } else if (typeof value === "bigint") {
            title = `${value}%`;
        } else {
            title = `${value}`;
        }
    }
    // unsupported
    else {
        throw new TypeError(`keyframes: ${prop.key.type} is not supported`);
    }

    if (prop.value.type !== "ObjectExpression") {
        throw new TypeError(`keyframes: ${prop.value.type} is not supported`);
    }

    const { styleNodes } = collectStyleNodes({
        program: options.program,
        selectors: [],
        object: prop.value,
    });

    return {
        keyframeNodes: [
            {
                title,
                children: styleNodes,
            },
        ],
    };
};

type CollectKeyframesNodesOptions = {
    program: Program;
    object: ObjectExpression;
};

type CollectStyleNodesResult = {
    keyframeNodes: KeyframeNode[];
};

const collectKeyframesNodes = (
    options: CollectKeyframesNodesOptions,
): CollectStyleNodesResult => {
    const keyframeNodes: KeyframeNode[] = [];

    for (let i: number = 0; i < options.object.properties.length; i++) {
        const prop: ObjectPropertyKind | undefined =
            options.object.properties[i];

        if (!prop) continue;

        if (prop.type === "SpreadElement") {
            // TODO: support spread element
            throw new TypeError(`keyframes: spread element is not supported`);
        }

        const result: CollectPropKeyframeNodesResult = collectPropKeyframeNodes(
            {
                program: options.program,
                prop,
            },
        );

        keyframeNodes.push(...result.keyframeNodes);
    }

    return {
        keyframeNodes,
    };
};

export type { CollectKeyframesNodesOptions };
export { collectKeyframesNodes };
