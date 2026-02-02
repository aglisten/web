import type {
    ArrayExpression,
    ArrayExpressionElement,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNode } from "##/processor/style/@types";
import type { HandleKeyValueResult } from "##/processor/style/collector/node/key-value";

import { CompileError } from "#/errors/compile";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";

type HandleArrayValueOptions = {
    context: CompilerContext;
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
            throw new CompileError({
                context: options.context,
                span: {
                    start: element.start,
                    end: element.end,
                },
                message: `Unsupported element type: ${element.type}`,
            });
        }

        const result: HandleKeyValueResult = handleKeyValue({
            context: options.context,
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
