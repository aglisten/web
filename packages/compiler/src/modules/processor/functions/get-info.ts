import type {
    Expression,
    ObjectPropertyKind,
    PropertyKey,
    SpreadElement,
    VariableDeclarator,
} from "oxc-parser";

import { ARGS, ID, KIND } from "#/consts";

type KeyValue = {
    key: string;
    value: Expression;
};

const getKeyValue = (
    props: ObjectPropertyKind[],
    key: string,
): KeyValue | undefined => {
    for (let i: number = 0; i < props.length; i++) {
        const prop: ObjectPropertyKind | undefined = props[i];

        if (!prop) continue;

        if (prop.type !== "Property") continue;

        const k: PropertyKey = prop.key;

        if (k.type !== "Identifier") continue;

        if (k.name !== key) continue;

        return {
            key: k.name,
            value: prop.value,
        };
    }

    return void 0;
};

const getString = (
    props: ObjectPropertyKind[],
    key: string,
): string | undefined => {
    const kv: KeyValue | undefined = getKeyValue(props, key);

    if (!kv) return void 0;

    if (kv.value.type !== "Literal") return void 0;

    const value: string | number | bigint | boolean | RegExp | null =
        kv.value.value;

    if (value === "" || value === null) return void 0;

    return value.toString();
};

const getId = (props: ObjectPropertyKind[]): string | undefined =>
    getString(props, ID);

const getKind = (props: ObjectPropertyKind[]): string | undefined =>
    getString(props, KIND);

const getArguments = (
    props: ObjectPropertyKind[],
): (Expression | SpreadElement)[] | undefined => {
    const kv: KeyValue | undefined = getKeyValue(props, ARGS);

    if (!kv) return void 0;

    if (kv.value.type !== "ArrayExpression") return void 0;

    const elements: (Expression | SpreadElement)[] = [];

    for (const el of kv.value.elements) {
        if (el !== null) elements.push(el);
    }

    return elements;
};

type GetInfoOptions = {
    decl: VariableDeclarator;
};

type GetInfoResult = {
    id: string;
    kind: string;
    args: (Expression | SpreadElement)[];
};

const getInfo = (options: GetInfoOptions): GetInfoResult | undefined => {
    const decl: VariableDeclarator = options.decl;

    if (!decl.init) return void 0;

    if (decl.init.type !== "ObjectExpression") return void 0;

    const props: ObjectPropertyKind[] = decl.init.properties;

    const id: string | undefined = getId(props);

    if (!id) return void 0;

    const kind: string | undefined = getKind(props);

    if (!kind) return void 0;

    const args: (Expression | SpreadElement)[] | undefined =
        getArguments(props);

    if (!args) return void 0;

    return {
        id,
        kind,
        args,
    };
};

export type { GetInfoOptions, GetInfoResult };
export { getInfo };
