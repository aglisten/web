import type { Expression, Program } from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";

import { handleArrayValue } from "##/processor/style/collector/node/key-value/array";
import { handleIdentValue } from "##/processor/style/collector/node/key-value/ident";
import { handleLiteralValue } from "##/processor/style/collector/node/key-value/literal";
import { handleMemberValue } from "##/processor/style/collector/node/key-value/member";
import { handleObjectValue } from "##/processor/style/collector/node/key-value/object";

type HandleKeyValueOptions = {
    program: Program;
    selectors: string[];
    key: string;
    value: Expression;
};

type HandleKeyValueResult = {
    styleNodes: StyleNode[];
};

const handleKeyValue = (
    options: HandleKeyValueOptions,
): HandleKeyValueResult => {
    // display: "block";
    if (options.value.type === "Literal") {
        return handleLiteralValue({
            selectors: options.selectors,
            key: options.key,
            literal: options.value,
        });
    }
    // ".children": { ... }
    else if (options.value.type === "ObjectExpression") {
        return handleObjectValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            object: options.value,
        });
    }
    // display: ["grid", "flex"] => display: "flex"; display: "grid";
    else if (options.value.type === "ArrayExpression") {
        return handleArrayValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            array: options.value,
        });
    }
    // abc.efg.xyz
    else if (options.value.type === "MemberExpression") {
        return handleMemberValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            member: options.value,
        });
    }
    // external variable
    else if (options.value.type === "Identifier") {
        return handleIdentValue({
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            ident: options.value,
        });
    } else {
        throw new TypeError(`style: ${options.value.type} is not supported`);
    }
};

export type { HandleKeyValueOptions, HandleKeyValueResult };
export { handleKeyValue };
