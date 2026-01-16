import type {
    Expression,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";

import { cloneDeep } from "es-toolkit";
import { Visitor } from "oxc-parser";

import { getInfo } from "#/modules/processor/functions/get-info";

type CollectCssOptions = {
    program: Program;
};

type CollectCssResult = {
    cssList: string[];
};

const collectCss = (options: CollectCssOptions): CollectCssResult => {
    const program: Program = cloneDeep(options.program);

    const cssList: string[] = [];

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

                for (let j: number = 0; j < info.args.length; j++) {
                    const arg: (Expression | SpreadElement) | undefined =
                        info.args[j];

                    if (!arg) continue;

                    // x("abc");
                    if (arg.type === "Literal") {
                        if (arg.value === null || arg.value === "") continue;
                        cssList.push(arg.value.toString());
                    }

                    // x(`abc`);
                    else if (arg.type === "TemplateLiteral") {
                        // TODO
                    }
                }
            }
        },
    });

    visitor.visit(program);

    return {
        cssList,
    };
};

export type { CollectCssOptions, CollectCssResult };
export { collectCss };
