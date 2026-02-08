import type {
    Expression,
    ObjectExpression,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { Keyframes } from "##/processor/keyframes/@types";

import { Visitor } from "oxc-parser";

import { CompileError } from "#/errors/compile";
import { getInfo } from "#/modules/processor/functions/get-info";
import { collectKeyframesNodes } from "##/processor/keyframes/collector/node";
import { createKeyframesTitle } from "##/processor/keyframes/collector/title";

type CollectKeyframesOptions = {
    context: CompilerContext;
    info: VarDeclInfo;
    program: Program;
    object: ObjectExpression;
};

type CollectKeyframesResult = {
    keyframes: Keyframes;
};

const collectKeyframes = (
    options: CollectKeyframesOptions,
): CollectKeyframesResult => {
    const { keyframeNodes } = collectKeyframesNodes({
        context: options.context,
        program: options.program,
        object: options.object,
    });

    const { title } = createKeyframesTitle({
        children: keyframeNodes,
    });

    return {
        keyframes: {
            id: options.info.id,
            title,
            children: keyframeNodes,
        },
    };
};

type CollectAllKeyframesOptions = {
    context: CompilerContext;
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

                const info: VarDeclInfo | undefined = getInfo({
                    decl,
                });

                if (!info) continue;

                if (info.fn !== "keyframes") continue;

                // keyframes function suppose to have 1 argument only
                const arg: (Expression | SpreadElement) | undefined =
                    info.args[0];

                if (!arg) continue;

                // the argument suppose to be an object
                if (arg.type !== "ObjectExpression") {
                    throw new CompileError({
                        context: options.context,
                        span: {
                            start: arg.start,
                            end: arg.end,
                        },
                        message: `Unsupported argument type: ${arg.type}`,
                    });
                }

                const result: CollectKeyframesResult = collectKeyframes({
                    context: options.context,
                    info,
                    program: options.program,
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
