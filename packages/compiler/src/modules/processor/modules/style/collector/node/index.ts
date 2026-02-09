import type {
    Expression,
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";
import type { HandleKeyValuesResult } from "##/processor/style/collector/node/key-value";

import { findInlineExpression } from "#/ast/expr";
import { CompileError } from "#/errors/compile";
import { isEnglishLetter } from "##/processor/style/collector/helper/letter";
import { handleKeyValues } from "##/processor/style/collector/node/key-value";

const normalizeCssKey = (key: string): string => {
    let result: string = "";

    for (let i: number = 0; i < key.length; i++) {
        const char: string | undefined = key[i];

        if (!char) continue;

        // ignore non-alphabet
        if (!isEnglishLetter(char)) {
            result += char;
            continue;
        }

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
    plans: StyleNodePlan[];
};

const collectPropStyleNodePlans = (
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

        const { plans } = handleKeyValues({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            key: prop.key.name,
            values: [
                value,
            ],
        });

        return {
            plans,
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

    const result: HandleKeyValuesResult = handleKeyValues({
        context: options.context,
        program: options.program,
        selectors: options.selectors,
        key,
        values: [
            prop.value,
        ],
    });

    return {
        plans: result.plans,
    };
};

type CollectStyleNodePlansOptions = {
    context: CompilerContext;
    program: Program;
    selectors: string[];
    object: ObjectExpression;
};

type CollectStyleNodePlansResult = {
    plans: StyleNodePlan[];
};

const collectStyleNodePlans = (
    options: CollectStyleNodePlansOptions,
): CollectStyleNodePlansResult => {
    const plans: StyleNodePlan[] = [];

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

        const { plans: current } = collectPropStyleNodePlans({
            context: options.context,
            program: options.program,
            selectors: options.selectors,
            prop,
        });

        plans.push(...current);
    }

    return {
        plans,
    };
};

export type { CollectStyleNodePlansOptions, CollectStyleNodePlansResult };
export { collectStyleNodePlans };
