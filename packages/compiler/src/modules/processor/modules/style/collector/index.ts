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
import type { Style } from "##/processor/style/@types";

import { Visitor } from "oxc-parser";

import { CompileError } from "#/errors/compile";
import { getInfo } from "#/modules/processor/functions/get-info";
import { collectStyleNodePlans } from "##/processor/style/collector/node";
import { createStyleNodesByPlans } from "./plan";

type CollectStyleOptions = {
    context: CompilerContext;
    info: VarDeclInfo;
    program: Program;
    object: ObjectExpression;
};

type CollectStyleResult = {
    style: Style;
};

const collectStyle = (options: CollectStyleOptions): CollectStyleResult => {
    const { plans } = collectStyleNodePlans({
        context: options.context,
        program: options.program,
        selectors: [],
        object: options.object,
    });

    const { styleNodes: children } = createStyleNodesByPlans({
        plans,
    });

    return {
        style: {
            id: options.info.id,
            children,
        },
    };
};

type CollectStylesOptions = {
    context: CompilerContext;
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

                const info: VarDeclInfo | undefined = getInfo({
                    decl,
                });

                if (!info) continue;

                if (info.fn !== "style") continue;

                // style function suppose to have 1 argument only
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

                const result: CollectStyleResult = collectStyle({
                    context: options.context,
                    info,
                    program: options.program,
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
