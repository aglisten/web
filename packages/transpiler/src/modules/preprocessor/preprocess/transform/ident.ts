import type {
    Argument,
    IdentifierReference,
    ObjectExpression,
} from "oxc-parser";

import { cloneDeep } from "es-toolkit";

import { ARGS, ID, KIND, SIGNATURE } from "#/consts";
import { createObjectKeyValue } from "#/modules/preprocessor/preprocess/transform/helper/kv";

type TransformIdentOptions = {
    id: string;
    ident: IdentifierReference;
    arguments: Argument[];
};

type TransformIdentResult = {
    object: ObjectExpression;
};

const transformIdent = async (
    options: TransformIdentOptions,
): Promise<TransformIdentResult> => {
    const ident: IdentifierReference = cloneDeep(options.ident);

    const object: ObjectExpression = {
        type: "ObjectExpression",
        start: ident.start,
        end: ident.end,
        properties: [],
    };

    const { property: signature } = await createObjectKeyValue({
        key: SIGNATURE,
        value: true,
    });

    object.properties.push(signature);

    const { property: id } = await createObjectKeyValue({
        key: ID,
        value: options.id,
    });

    object.properties.push(id);

    const { property: kind } = await createObjectKeyValue({
        key: KIND,
        value: options.ident.name,
    });

    object.properties.push(kind);

    const { property: args } = await createObjectKeyValue({
        key: ARGS,
        value: options.arguments,
    });

    object.properties.push(args);

    return {
        object,
    };
};

export type { TransformIdentOptions, TransformIdentResult };
export { transformIdent };
