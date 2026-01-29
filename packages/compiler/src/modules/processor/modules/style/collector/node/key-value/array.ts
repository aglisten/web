import type {
    ArrayExpression,
    ArrayExpressionElement,
    Program,
} from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";
import type { HandleKeyValueResult } from "##/processor/style/collector/node/key-value";

import { handleKeyValue } from "##/processor/style/collector/node/key-value";

type HandleArrayValueOptions = {
    program: Program;
    selectors: string[];
    key: string;
    array: ArrayExpression;
};

type HandleArrayValueResult = {
    styleNodes: StyleNode[];
};

const handleArrayValue = (
    options: HandleArrayValueOptions,
): HandleArrayValueResult => {
    const styleNodes: StyleNode[] = [];

    for (let i: number = 0; i < options.array.elements.length; i++) {
        const element: ArrayExpressionElement | undefined =
            options.array.elements[i];

        if (!element) continue;

        if (element.type === "SpreadElement") {
            // TODO: support spread element
            throw new TypeError(`style: spread element is not supported`);
        }

        const result: HandleKeyValueResult = handleKeyValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            value: element,
        });

        styleNodes.push(...result.styleNodes);
    }

    return {
        styleNodes,
    };
};

export type { HandleArrayValueOptions, HandleArrayValueResult };
export { handleArrayValue };
