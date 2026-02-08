import type { Expression, IdentifierReference, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { VariableKeyValue } from "##/processor/variables/@types";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";
import type { HandleLiteralValueResult } from "##/processor/variables/collector/value/lit";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { handleKeyValue } from "##/processor/variables/collector/key-value";
import { handleLiteralValue } from "##/processor/variables/collector/value/lit";

type HandleIdentValueOptions = {
    context: CompilerContext;
    info: VarDeclInfo;
    program: Program;
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
        context: options.context,
        program: options.program,
        name: options.ident.name,
    });

    if (!expr) {
        throw new CompileError({
            context: options.context,
            span: {
                start: options.ident.start,
                end: options.ident.end,
            },
            message: `Inline expression not found: ${options.ident.name}`,
        });
    }

    // blue: "xxx"
    if (expr.type === "Literal") {
        const result: HandleLiteralValueResult = handleLiteralValue({
            context: options.context,
            info: options.info,
            program: options.program,
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
        context: options.context,
        info: options.info,
        program: options.program,
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
