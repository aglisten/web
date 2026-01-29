import type {
    Expression,
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
} from "oxc-parser";

import type { StyleNode } from "##/processor/style/@types";
import type { HandleKeyValueResult } from "##/processor/style/collector/node/key-value";

import { findInlineExpression } from "#/ast/expr";
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
            throw new TypeError(
                `style: ${prop.key.type} is not supported as a key shorthand`,
            );
        }

        const value: Expression | undefined = findInlineExpression({
            program: options.program,
            name: prop.key.name,
        });

        if (!value) {
            throw new Error(
                `style: no inline expression found for ${prop.key.name}`,
            );
        }

        const result: HandleKeyValueResult = handleKeyValue({
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
                throw new TypeError(`style: key is null`);
            }

            key = prop.key.value.toString();
        }
        // [display]
        else if (prop.key.type === "Identifier") {
            const value: Expression | undefined = findInlineExpression({
                program: options.program,
                name: prop.key.name,
            });

            if (!value) {
                throw new Error(
                    `style: no inline expression found for ${prop.key.name}`,
                );
            }

            if (value.type === "Literal") {
                if (value.value === null) {
                    throw new TypeError(`style: expression is null`);
                }

                key = value.value.toString();
            }
            // unsupported
            else {
                throw new TypeError(
                    `style: ${prop.key.type} is not supported as a key shorthand`,
                );
            }
        }
        // unsupported
        else {
            throw new TypeError(
                `style: ${prop.key.type} is not supported as a key shorthand`,
            );
        }
    }
    // "display"
    else if (prop.key.type === "Literal") {
        if (prop.key.value === null) {
            throw new TypeError(`style: key is null`);
        }

        key = prop.key.value.toString();
    }
    // display
    else if (prop.key.type === "Identifier") {
        key = prop.key.name;
    }
    // unsupported
    else {
        throw new TypeError(
            `style: ${prop.key.type} is not supported as a key`,
        );
    }

    key = normalizeCssKey(key);

    const result: HandleKeyValueResult = handleKeyValue({
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
            throw new TypeError(`keyframes: spread element is not supported`);
        }

        const result: CollectPropStyleNodesResult = collectPropStyleNodes({
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
