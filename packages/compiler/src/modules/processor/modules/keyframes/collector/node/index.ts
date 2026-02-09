import type {
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { KeyframeNode } from "##/processor/keyframes/@types";

import { CompileError } from "#/errors/compile";
import { collectStyleNodePlans } from "##/processor/style/collector/node";
import { createStyleNodesByPlans } from "##/processor/style/collector/plan";

type ColelctPropKeyframeNodesOptions = {
    context: CompilerContext;
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
    else if (prop.key.type === "Literal") {
        const value: string | number | bigint | boolean | RegExp | null =
            prop.key.value;

        if (value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key type: ${prop.key.type}`,
            });
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
        throw new CompileError({
            context: options.context,
            span: {
                start: prop.key.start,
                end: prop.key.end,
            },
            message: `Unsupported property key type: ${prop.key.type}`,
        });
    }

    if (prop.value.type !== "ObjectExpression") {
        throw new CompileError({
            context: options.context,
            span: {
                start: prop.value.start,
                end: prop.value.end,
            },
            message: `Unsupported property value type: ${prop.value.type}`,
        });
    }

    const { plans } = collectStyleNodePlans({
        context: options.context,
        program: options.program,
        selectors: [],
        object: prop.value,
    });

    const { styleNodes: children } = createStyleNodesByPlans({
        plans,
    });

    return {
        keyframeNodes: [
            {
                title,
                children,
            },
        ],
    };
};

type CollectKeyframesNodesOptions = {
    context: CompilerContext;
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
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.start,
                    end: prop.end,
                },
                message: `Unsupported property type: ${prop.type}`,
            });
        }

        const result: CollectPropKeyframeNodesResult = collectPropKeyframeNodes(
            {
                context: options.context,
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
