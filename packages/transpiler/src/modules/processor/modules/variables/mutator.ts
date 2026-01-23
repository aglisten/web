import type {
    Directive,
    ObjectExpression,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type {
    VariableKeyValue,
    Variables,
} from "##/processor/variables/@types";

import { cloneDeep } from "es-toolkit";

import { getInfo } from "#/modules/processor/functions/get-info";

type TransformVariablesOptions = {
    decl: VariableDeclarator;
    id: string;
    variablesList: Variables[];
};

const transformVariables = (
    options: TransformVariablesOptions,
): VariableDeclarator => {
    const kvs: VariableKeyValue[] = [];

    for (let i: number = 0; i < options.variablesList.length; i++) {
        const variables: Variables | undefined = options.variablesList[i];

        if (!variables) continue;

        if (variables.id !== options.id) continue;

        for (let j: number = 0; j < variables.keyValues.length; j++) {
            const variable: VariableKeyValue | undefined =
                variables.keyValues[j];

            if (!variable) continue;

            kvs.push(variable);
        }
    }

    const object: ObjectExpression = {
        type: "ObjectExpression",
        properties: [],
        start: 0,
        end: 0,
    };

    const recorded: string[] = [];

    for (let i: number = 0; i < kvs.length; i++) {
        const kv: VariableKeyValue | undefined = kvs[i];

        if (!kv) continue;

        if (recorded.includes(kv.key)) continue;

        const value: string = `var(--${kv.value})`;

        object.properties.push({
            type: "Property",
            kind: "get",
            computed: false,
            method: false,
            shorthand: false,
            key: {
                type: "Identifier",
                name: kv.key,
                start: 0,
                end: 0,
            },
            value: {
                type: "Literal",
                value,
                raw: null,
                start: 0,
                end: 0,
            },
            start: 0,
            end: 0,
        });

        recorded.push(kv.key);
    }

    return {
        ...options.decl,
        init: object,
    };
};

type MutateVariablesOptions = {
    program: Program;
    variablesList: Variables[];
};

type MutateVariablesResult = {
    program: Program;
};

const mutateVariables = (
    options: MutateVariablesOptions,
): MutateVariablesResult => {
    const program: Program = cloneDeep(options.program);

    for (let i: number = 0; i < program.body.length; i++) {
        const body: Directive | Statement | undefined = program.body[i];

        if (!body) continue;

        if (body.type !== "VariableDeclaration") continue;

        for (let j: number = 0; j < body.declarations.length; j++) {
            const decl: VariableDeclarator | undefined = body.declarations[j];

            if (!decl) continue;

            const info: GetInfoResult | undefined = getInfo({
                decl,
            });

            if (!info) continue;

            if (info.kind !== "variables") continue;

            body.declarations[j] = transformVariables({
                decl,
                id: info.id,
                variablesList: options.variablesList,
            });
        }
    }

    return {
        program,
    };
};

export type { MutateVariablesOptions, MutateVariablesResult };
export { mutateVariables };
