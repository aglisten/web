import type { Argument, Expression, ObjectPropertyKind } from "oxc-parser";

type CreateObjectKeyValueOptions = {
    key: string;
    value: string | number | boolean | Argument[];
};

type CreateObjectKeyValueResult = {
    property: ObjectPropertyKind;
};

const createObjectKeyValue = async (
    options: CreateObjectKeyValueOptions,
): Promise<CreateObjectKeyValueResult> => {
    let value: Expression;

    if (Array.isArray(options.value)) {
        value = {
            type: "ArrayExpression",
            elements: options.value,
            start: 0,
            end: 0,
        };
    } else {
        value = {
            type: "Literal",
            value: options.value,
            raw: JSON.stringify(options.value),
            start: 0,
            end: 0,
        };
    }

    const property: ObjectPropertyKind = {
        type: "Property",
        kind: "init",
        key: {
            type: "Identifier",
            name: options.key,
            start: 0,
            end: 0,
        },
        value,
        method: false,
        shorthand: false,
        computed: false,
        start: 0,
        end: 0,
    };

    return {
        property,
    };
};

export type { CreateObjectKeyValueOptions, CreateObjectKeyValueResult };
export { createObjectKeyValue };
