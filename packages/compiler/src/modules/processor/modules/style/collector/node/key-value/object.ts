import type { ObjectExpression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNode } from "##/processor/style/@types";

import { collectStyleNodes } from "##/processor/style/collector/node";

type HandleObjectValueOptions = {
    context: CompilerContext;
    program: Program;
    selectors: string[];
    key: string;
    object: ObjectExpression;
};

type HandleObjectValueResult = {
    styleNodes: StyleNode[];
};

const handleObjectValue = (
    options: HandleObjectValueOptions,
): HandleObjectValueResult => {
    const selectors: string[] = options.selectors;

    selectors.push(options.key);

    const { styleNodes } = collectStyleNodes({
        context: options.context,
        program: options.program,
        selectors,
        object: options.object,
    });

    return {
        styleNodes,
    };
};

export type { HandleObjectValueOptions, HandleObjectValueResult };
export { handleObjectValue };
