import type { Expression, Program } from "oxc-parser";

import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleIdentValueResult } from "##/processor/variables/collector/value/ident";
import type { HandleObjectValueResult } from "##/processor/variables/collector/value/object";

import { handleIdentValue } from "##/processor/variables/collector/value/ident";
import { handleLiteralValue } from "##/processor/variables/collector/value/lit";
import { handleObjectValue } from "##/processor/variables/collector/value/object";

type HandleKeyValueOptions = {
    program: Program;
    id: string;
    selector: string;
    key: string;
    value: Expression;
};

type HandleKeyValueResult = {
    keyValues: VariableKeyValue[];
};

const handleKeyValue = (
    options: HandleKeyValueOptions,
): HandleKeyValueResult => {
    const value: Expression = options.value;

    // blue: "xxx"
    if (value.type === "Literal") {
        const reulst = handleLiteralValue({
            program: options.program,
            id: options.id,
            selector: options.selector,
            key: options.key,
            lit: value,
        });

        return {
            keyValues: reulst.keyValues,
        };
    }
    // blue: x,
    else if (value.type === "Identifier") {
        const result: HandleIdentValueResult = handleIdentValue({
            program: options.program,
            id: options.id,
            selector: options.selector,
            key: options.key,
            ident: value,
        });

        return {
            keyValues: result.keyValues,
        };
    }
    // blue: { default: "xxx" },
    else if (value.type === "ObjectExpression") {
        const result: HandleObjectValueResult = handleObjectValue({
            program: options.program,
            id: options.id,
            selector: options.selector,
            key: options.key,
            object: value,
        });

        return {
            keyValues: result.keyValues,
        };
    }

    throw new TypeError(
        `variables: ${value.type} is not supported as a value expression`,
    );
};

export type { HandleKeyValueOptions, HandleKeyValueResult };
export { handleKeyValue };
