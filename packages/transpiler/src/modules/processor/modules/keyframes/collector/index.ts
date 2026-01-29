import type {
    Expression,
    ObjectExpression,
    ObjectPropertyKind,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type { KeyframeNode, Keyframes } from "##/processor/keyframes/@types";

import { Visitor } from "oxc-parser";

import { getInfo } from "#/modules/processor/functions/get-info";
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
    const children: KeyframeNode[] = [];

    for (let i: number = 0; i < options.object.properties.length; i++) {
        const prop: ObjectPropertyKind | undefined =
            options.object.properties[i];

        if (!prop) continue;

        if (prop.type === "SpreadElement") {
            throw new TypeError(`keyframes: spread element is not supported`);
        }

        prop;
    }

    const { title } = createKeyframesTitle({
        children,
    });

    return {
        keyframes: {
            id: options.id,
            title,
            children,
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

                // variables function suppose to have 1 argument only
                const arg: (Expression | SpreadElement) | undefined =
                    info.args[0];

                if (!arg) continue;

                // the argument suppose to be an object
                if (arg.type !== "ObjectExpression") {
                    throw new TypeError(
                        `variables: ${arg.type} is not supported`,
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
