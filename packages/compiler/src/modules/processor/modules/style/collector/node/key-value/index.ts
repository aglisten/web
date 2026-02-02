import type { Expression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNode } from "##/processor/style/@types";

import { CompileError } from "#/errors/compile";
import { handleArrayValue } from "##/processor/style/collector/node/key-value/array";
import { handleIdentValue } from "##/processor/style/collector/node/key-value/ident";
import { handleLiteralValue } from "##/processor/style/collector/node/key-value/literal";
import { handleMemberValue } from "##/processor/style/collector/node/key-value/member";
import { handleObjectValue } from "##/processor/style/collector/node/key-value/object";

type HandleKeyValueOptions = {
    context: CompilerContext;
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
            context: options.context,
            selectors: options.selectors,
            key: options.key,
            literal: options.value,
        });
    }
    // ".children": { ... }
    else if (options.value.type === "ObjectExpression") {
        return handleObjectValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            object: options.value,
        });
    }
    // display: ["grid", "flex"] => display: "flex"; display: "grid";
    else if (options.value.type === "ArrayExpression") {
        return handleArrayValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            array: options.value,
        });
    }
    // abc.efg.xyz
    else if (options.value.type === "MemberExpression") {
        return handleMemberValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            member: options.value,
        });
    }
    // external variable
    else if (options.value.type === "Identifier") {
        return handleIdentValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            ident: options.value,
        });
    }
    // as ...
    else if (options.value.type === "TSAsExpression") {
        return handleKeyValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: options.key,
            value: options.value.expression,
        });
    } else {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.value.start,
                end: options.value.end,
            },
            message: `Unsupported property value type: ${options.value.type}`,
        });
    }
};

export type { HandleKeyValueOptions, HandleKeyValueResult };
export { handleKeyValue };
