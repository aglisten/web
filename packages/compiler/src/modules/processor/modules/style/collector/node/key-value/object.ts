import type { ObjectExpression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";

import { collectStyleNodePlans } from "##/processor/style/collector/node";

type HandleObjectValueOptions = {
    context: CompilerContext;
    program: Program;
    selectors: readonly string[];
    key: string;
    object: ObjectExpression;
};

type HandleObjectValueResult = {
    plans: StyleNodePlan[];
};

const handleObjectValue = (
    options: HandleObjectValueOptions,
): HandleObjectValueResult => {
    const selectors: string[] = [
        ...options.selectors,
    ];

    selectors.push(options.key);

    const { plans } = collectStyleNodePlans({
        context: options.context,
        program: options.program,
        selectors,
        object: options.object,
    });

    return {
        plans,
    };
};

export type { HandleObjectValueOptions, HandleObjectValueResult };
export { handleObjectValue };
