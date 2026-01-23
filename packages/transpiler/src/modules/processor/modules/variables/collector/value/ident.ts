import type { Expression, IdentifierReference, Program } from "oxc-parser";

import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";
import type { HandleLiteralValueResult } from "##/processor/variables/collector/value/lit";

import { findInlineExpression } from "#/ast/expr";
import { handleKeyValue } from "##/processor/variables/collector/key-value";
import { handleLiteralValue } from "##/processor/variables/collector/value/lit";

type HandleIdentValueOptions = {
    program: Program;
    id: string;
    selector: string;
    key: string;
    ident: IdentifierReference;
};

type HandleIdentValueResult = {
    keyValues: VariableKeyValue[];
};

const handleIdentValue = (
    options: HandleIdentValueOptions,
): HandleIdentValueResult => {
    const expr: Expression | undefined = findInlineExpression({
        program: options.program,
        name: options.ident.name,
    });

    if (!expr) {
        throw new Error(
            `variables: no inline expression found for ${options.ident.name}`,
        );
    }

    // blue: "xxx"
    if (expr.type === "Literal") {
        const result: HandleLiteralValueResult = handleLiteralValue({
            program: options.program,
            id: options.id,
            selector: options.selector,
            key: options.key,
            lit: expr,
        });

        return {
            keyValues: result.keyValues,
        };
    }

    // blue: ???
    const result: HandleKeyValueResult = handleKeyValue({
        program: options.program,
        id: options.id,
        selector: options.selector,
        key: options.key,
        value: expr,
    });

    return {
        keyValues: result.keyValues,
    };
};

export type { HandleIdentValueOptions, HandleIdentValueResult };
export { handleIdentValue };
