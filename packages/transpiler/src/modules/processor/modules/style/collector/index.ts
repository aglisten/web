import type {
    Expression,
    ObjectExpression,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type { Style } from "##/processor/style/@types";
import type { CollectStyleNodesResult } from "##/processor/style/collector/node";

import { Visitor } from "oxc-parser";

import { getInfo } from "#/modules/processor/functions/get-info";
import { collectStyleNodes } from "##/processor/style/collector/node";

type CollectStyleOptions = {
    program: Program;
    id: string;
    object: ObjectExpression;
};

type CollectStyleResult = {
    style: Style;
};

const collectStyle = (options: CollectStyleOptions): CollectStyleResult => {
    const result: CollectStyleNodesResult = collectStyleNodes({
        program: options.program,
        selectors: [],
        object: options.object,
    });

    return {
        style: {
            id: options.id,
            children: result.styleNodes,
        },
    };
};

type CollectStylesOptions = {
    program: Program;
};

type CollectStylesResult = {
    styles: Style[];
};

const collectStyles = (options: CollectStylesOptions): CollectStylesResult => {
    const styles: Style[] = [];

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

                if (info.kind !== "style") continue;

                // style function suppose to have 1 argument only
                const arg: (Expression | SpreadElement) | undefined =
                    info.args[0];

                if (!arg) continue;

                // the argument suppose to be an object
                if (arg.type !== "ObjectExpression") {
                    throw new TypeError(`style: ${arg.type} is not supported`);
                }

                const result: CollectStyleResult = collectStyle({
                    program: options.program,
                    id: info.id,
                    object: arg,
                });

                styles.push(result.style);
            }
        },
    });

    visitor.visit(options.program);

    return {
        styles,
    };
};

export type { CollectStylesOptions, CollectStylesResult };
export { collectStyles };
