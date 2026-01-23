import type { Expression, Program } from "oxc-parser";

import type { VariableKeyValue } from "##/processor/variables/@types";

import { fixedFnv1a } from "#/modules/processor/functions/hash";

type HandleLiteralValueOptions = {
    program: Program;
    id: string;
    selector: string;
    key: string;
    lit: Expression;
};

type HandleLiteralValueResult = {
    keyValues: VariableKeyValue[];
};

const handleLiteralValue = (
    options: HandleLiteralValueOptions,
): HandleLiteralValueResult => {
    const keyValues: VariableKeyValue[] = [];

    if (options.lit.type !== "Literal") {
        throw new TypeError(`variables: ${options.lit.type} is not supported`);
    }

    // blue: "xxx"

    let value: string = "";

    if (options.lit.value === null) {
        value = "null";
    } else {
        value = options.lit.value.toString();
    }

    const title: string = `v${fixedFnv1a(options.id, 2)}${fixedFnv1a(options.key, 3)}`;

    keyValues.push({
        title,
        selector: options.selector,
        key: options.key,
        value,
    });

    return {
        keyValues,
    };
};

export type { HandleLiteralValueOptions, HandleLiteralValueResult };
export { handleLiteralValue };
