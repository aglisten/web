import type { StyleNode, StyleNodePlan } from "##/processor/style/@types";

import { createStyleNodeTitle } from "##/processor/style/collector/title";

type CreateStyleNodesByPlansOptions = {
    plans: StyleNodePlan[];
};

type CreateStyleNodesByPlansResult = {
    styleNodes: StyleNode[];
};

const createStyleNodesByPlans = (
    options: CreateStyleNodesByPlansOptions,
): CreateStyleNodesByPlansResult => {
    const styleNodes: StyleNode[] = [];

    for (let i: number = 0; i < options.plans.length; i++) {
        const plan: StyleNodePlan | undefined = options.plans[i];

        if (!plan) continue;

        const { title } = createStyleNodeTitle({
            selectors: plan.selectors,
            key: plan.key,
            values: plan.values,
        });

        styleNodes.push({
            title,
            selectors: plan.selectors,
            key: plan.key,
            values: plan.values,
        });
    }

    return {
        styleNodes,
    };
};

export type { CreateStyleNodesByPlansOptions, CreateStyleNodesByPlansResult };
export { createStyleNodesByPlans };
