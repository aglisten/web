import type {
    Expression,
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNode } from "##/processor/style/@types";
import type { HandleKeyValueResult } from "##/processor/style/collector/node/key-value";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { handleKeyValue } from "##/processor/style/collector/node/key-value";

const normalizeCssKey = (key: string): string => {
    let result: string = "";

    for (let i: number = 0; i < key.length; i++) {
        const char: string | undefined = key[i];

        if (!char) continue;

        if (char === char.toUpperCase()) {
            result += `-${char.toLowerCase()}`;
        } else {
            result += char;
        }
    }

    return result;
};

type ColelctPropStyleNodesOptions = {
    context: CompilerContext;
    program: Program;
    selectors: string[];
    prop: ObjectProperty;
};

type CollectPropStyleNodesResult = {
    styleNodes: StyleNode[];
};

const collectPropStyleNodes = (
    options: ColelctPropStyleNodesOptions,
): CollectPropStyleNodesResult => {
    const prop: ObjectProperty = options.prop;

    // display,
    if (prop.shorthand === true) {
        if (prop.key.type !== "Identifier") {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key type: ${prop.key.type}`,
            });
        }

        const value: Expression | undefined = findInlineExpression({
            context: options.context,
            program: options.program,
            name: prop.key.name,
        });

        if (!value) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Inline expression not found: ${prop.key.name}`,
            });
        }

        const result: HandleKeyValueResult = handleKeyValue({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: prop.key.name,
            value,
        });

        return {
            styleNodes: result.styleNodes,
        };
    }

    let key: string;

    // [...]
    if (prop.computed === true) {
        // ["display"]
        if (prop.key.type === "Literal") {
            if (prop.key.value === null) {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: prop.key.start,
                        end: prop.key.end,
                    },
                    message: `Unsupported property key value: ${prop.key.value}`,
                });
            }

            key = prop.key.value.toString();
        }
        // [display]
        else if (prop.key.type === "Identifier") {
            const value: Expression | undefined = findInlineExpression({
                context: options.context,
                program: options.program,
                name: prop.key.name,
            });

            if (!value) {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: prop.key.start,
                        end: prop.key.end,
                    },
                    message: `Inline expression not found: ${prop.key.name}`,
                });
            }

            if (value.type === "Literal") {
                if (value.value === null) {
                    throw new CompileError({
                        context: options.context,
                        span: {
                            start: value.start,
                            end: value.end,
                        },
                        message: `Unsupported expression value: ${value.value}`,
                    });
                }

                key = value.value.toString();
            }
            // unsupported
            else {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: prop.key.start,
                        end: prop.key.end,
                    },
                    message: `Unsupported property key type: ${prop.key.type}`,
                });
            }
        }
        // unsupported
        else {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key type: ${prop.key.type}`,
            });
        }
    }
    // "display"
    else if (prop.key.type === "Literal") {
        if (prop.key.value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key value: ${prop.key.value}`,
            });
        }

        key = prop.key.value.toString();
    }
    // display
    else if (prop.key.type === "Identifier") {
        key = prop.key.name;
    }
    // unsupported
    else {
        throw new CompileError({
            context: options.context,
            span: {
                start: prop.key.start,
                end: prop.key.end,
            },
            message: `Unsupported property key type: ${prop.key.type}`,
        });
    }

    key = normalizeCssKey(key);

    const result: HandleKeyValueResult = handleKeyValue({
        context: options.context,
        program: options.program,
        selectors: options.selectors,
        key,
        value: prop.value,
    });

    return {
        styleNodes: result.styleNodes,
    };
};

type CollectStyleNodesOptions = {
    context: CompilerContext;
    program: Program;
    selectors: string[];
    object: ObjectExpression;
};

type CollectStyleNodesResult = {
    styleNodes: StyleNode[];
};

const collectStyleNodes = (
    options: CollectStyleNodesOptions,
): CollectStyleNodesResult => {
    const styleNodes: StyleNode[] = [];

    for (let i: number = 0; i < options.object.properties.length; i++) {
        const prop: ObjectPropertyKind | undefined =
            options.object.properties[i];

        if (!prop) continue;

        if (prop.type === "SpreadElement") {
            // TODO: support spread element
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.start,
                    end: prop.end,
                },
                message: `Unsupported property type: ${prop.type}`,
            });
        }

        const result: CollectPropStyleNodesResult = collectPropStyleNodes({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            prop,
        });

        styleNodes.push(...result.styleNodes);
    }

    return {
        styleNodes,
    };
};

export type { CollectStyleNodesOptions, CollectStyleNodesResult };
export { collectStyleNodes };
