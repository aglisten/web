import type {
    Expression,
    ObjectExpression,
    ObjectProperty,
    ObjectPropertyKind,
    Program,
    SpreadElement,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type { HandleExpressionResult } from "#/modules/processor/modules/variables/collector/expr";
import type {
    VariableKeyValue,
    Variables,
} from "##/processor/variables/@types";
import type { HandleKeyValueResult } from "##/processor/variables/collector/key-value";
import type { HandleIdentValueResult } from "##/processor/variables/collector/value/ident";

import { Visitor } from "oxc-parser";

import { CompileError } from "#/errors/compile";
import { getInfo } from "#/modules/processor/functions/get-info";
import { handleExpression } from "#/modules/processor/modules/variables/collector/expr";
import { handleKeyValue } from "##/processor/variables/collector/key-value";
import { handleIdentValue } from "##/processor/variables/collector/value/ident";

type CollectPropVariablesOptions = {
    context: CompilerContext;
    program: Program;
    id: string;
    prop: ObjectProperty;
};

type CollectPropVariablesResult = {
    keyValues: VariableKeyValue[];
};

const collectPropVariables = (
    options: CollectPropVariablesOptions,
): CollectPropVariablesResult => {
    const selector: string = ":root";

    const prop: ObjectProperty = options.prop;

    // blue,
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

        const result: HandleIdentValueResult = handleIdentValue({
            context: options.context,
            program: options.program,
            id: options.id,
            selector,
            key: prop.key.name,
            ident: prop.key,
        });

        return {
            keyValues: result.keyValues,
        };
    }

    let key: string;

    // [...]
    if (prop.computed === true) {
        // ["blue"]
        if (prop.key.type === "Literal") {
            if (prop.key.value === null) {
                throw new CompileError({
                    context: options.context,
                    span: {
                        start: prop.key.start,
                        end: prop.key.end,
                    },
                    message: `Unsupported property key type: ${prop.key.type}`,
                });
            }

            key = prop.key.value.toString();
        }
        // [blue]
        else if (prop.key.type === "Identifier") {
            const result: HandleExpressionResult = handleExpression({
                context: options.context,
                program: options.program,
                expr: prop.key,
            });

            key = result.str;
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
    // "blue"
    else if (prop.key.type === "Literal") {
        if (prop.key.value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: prop.key.start,
                    end: prop.key.end,
                },
                message: `Unsupported property key value: null`,
            });
        }

        key = prop.key.value.toString();
    }
    // blue
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

    const result: HandleKeyValueResult = handleKeyValue({
        context: options.context,
        program: options.program,
        id: options.id,
        selector,
        key,
        value: prop.value,
    });

    return {
        keyValues: result.keyValues,
    };
};

type CollectVariablesOptions = {
    context: CompilerContext;
    program: Program;
    id: string;
    object: ObjectExpression;
};

type CollectVariablesResult = {
    variables: Variables;
};

const collectVariables = (
    options: CollectVariablesOptions,
): CollectVariablesResult => {
    const keyValues: VariableKeyValue[] = [];

    for (let i: number = 0; i < options.object.properties.length; i++) {
        const prop: ObjectPropertyKind | undefined =
            options.object.properties[i];

        if (!prop) continue;

        if (prop.type === "Property") {
            // { blue: "#1591ea" }

            const result: CollectPropVariablesResult = collectPropVariables({
                context: options.context,
                program: options.program,
                id: options.id,
                prop,
            });

            keyValues.push(...result.keyValues);
        } else if (prop.type === "SpreadElement") {
            // { ...preset }

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
    }

    return {
        variables: {
            id: options.id,
            keyValues,
        },
    };
};

type CollectAllVariablesOptions = {
    context: CompilerContext;
    program: Program;
};

type CollectAllVariablesResult = {
    variablesList: Variables[];
};

const collectAllVariables = (
    options: CollectAllVariablesOptions,
): CollectAllVariablesResult => {
    const variablesList: Variables[] = [];

    const visitor: Visitor = new Visitor({
        VariableDeclaration: (node: VariableDeclaration): void => {
            for (let i: number = 0; i < node.declarations.length; i++) {
                const decl: VariableDeclarator | undefined =
                    node.declarations[i];

                if (!decl) continue;

                const info: GetInfoResult | undefined = getInfo({
                    decl,
                });

                if (!info) continue;

                if (info.kind !== "variables") continue;

                // variables function suppose to have 1 argument only
                const arg: (Expression | SpreadElement) | undefined =
                    info.args[0];

                if (!arg) continue;

                // the argument suppose to be an object
                if (arg.type !== "ObjectExpression") {
                    throw new CompileError({
                        context: options.context,
                        span: {
                            start: arg.start,
                            end: arg.end,
                        },
                        message: `Unsupported argument type: ${arg.type}`,
                    });
                }

                const result: CollectVariablesResult = collectVariables({
                    context: options.context,
                    program: options.program,
                    id: info.id,
                    object: arg,
                });

                variablesList.push(result.variables);
            }
        },
    });

    visitor.visit(options.program);

    return {
        variablesList,
    };
};

export type { CollectAllVariablesOptions, CollectAllVariablesResult };
export { collectAllVariables };
