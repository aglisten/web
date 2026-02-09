import type {
    ArrayExpression,
    ArrayExpressionElement,
    Expression,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";

import { CompileError } from "#/errors/compile";
import { handleKeyValues } from "##/processor/style/collector/node/key-value";

type HandleArrayValueOptions = {
    context: CompilerContext;
    program: Program;
    selectors: string[];
    key: string;
    array: ArrayExpression;
};

type HandleArrayValueResult = {
    plans: StyleNodePlan[];
};

const handleArrayValue = (
    options: HandleArrayValueOptions,
): HandleArrayValueResult => {
    const values: Expression[] = [];

    for (let i: number = 0; i < options.array.elements.length; i++) {
        const element: ArrayExpressionElement | undefined =
            options.array.elements[i];

        if (!element) continue;

        if (element.type === "SpreadElement") {
            // TODO: support spread element
            throw new CompileError({
                context: options.context,
                span: {
                    start: element.start,
                    end: element.end,
                },
                message: `Unsupported element type: ${element.type}`,
            });
        }

        values.push(element);
    }

    const { plans } = handleKeyValues({
        context: options.context,
        program: options.program,
        selectors: options.selectors,
        key: options.key,
        values,
    });

    const plan: StyleNodePlan | undefined = plans[0];

    if (!plan)
        return {
            plans: [],
        };

    return {
        plans: [
            {
                selectors: plan.selectors,
                key: plan.key,
                values: plans.flatMap(
                    (plan: StyleNodePlan): string[] => plan.values,
                ),
            },
        ],
    };
};

export type { HandleArrayValueOptions, HandleArrayValueResult };
export { handleArrayValue };
