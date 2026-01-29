import type {
    Expression,
    ObjectExpression,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type { Keyframes } from "##/processor/keyframes/@types";

import { Visitor } from "oxc-parser";

import { getInfo } from "#/modules/processor/functions/get-info";
import { collectKeyframesNodes } from "##/processor/keyframes/collector/node";
import { createKeyframesTitle } from "##/processor/keyframes/collector/title";

type CollectKeyframesOptions = {
    program: Program;
    id: string;
    object: ObjectExpression;
};

type CollectKeyframesResult = {
    keyframes: Keyframes;
};

const collectKeyframes = (
    options: CollectKeyframesOptions,
): CollectKeyframesResult => {
    const { keyframeNodes } = collectKeyframesNodes({
        program: options.program,
        object: options.object,
    });

    const { title } = createKeyframesTitle({
        children: keyframeNodes,
    });

    return {
        keyframes: {
            id: options.id,
            title,
            children: keyframeNodes,
        },
    };
};

type CollectAllKeyframesOptions = {
    program: Program;
};

type CollectAllKeyframesResult = {
    keyframesList: Keyframes[];
};

const collectAllKeyframes = (
    options: CollectAllKeyframesOptions,
): CollectAllKeyframesResult => {
    const keyframesList: Keyframes[] = [];

    const visitor: Visitor = new Visitor({
        VariableDeclaration: (node: VariableDeclaration): void => {
            for (let i: number = 0; i < node.declarations.length; i++) {
                const decl: VariableDeclarator | undefined =
                    node.declarations[i];

                if (!decl) continue;

                const info: GetInfoResult | undefined = getInfo({
                    decl,
                });

                if (!info) continue;

                if (info.kind !== "keyframes") continue;

                // keyframes function suppose to have 1 argument only
                const arg: (Expression | SpreadElement) | undefined =
                    info.args[0];

                if (!arg) continue;

                // the argument suppose to be an object
                if (arg.type !== "ObjectExpression") {
                    throw new TypeError(
                        `keyframes: ${arg.type} is not supported`,
                    );
                }

                const result: CollectKeyframesResult = collectKeyframes({
                    program: options.program,
                    id: info.id,
                    object: arg,
                });

                keyframesList.push(result.keyframes);
            }
        },
    });

    visitor.visit(options.program);

    return {
        keyframesList,
    };
};

export type { CollectAllKeyframesOptions, CollectAllKeyframesResult };
export { collectAllKeyframes };
