import type {
    Argument,
    IdentifierReference,
    ObjectExpression,
} from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { cloneDeep } from "es-toolkit";

import { ARGS, FN, ID, SIGNATURE, VA } from "#/consts";
import { createId } from "#/modules/preprocessor/preprocess/transform/helper/id";
import { createObjectKeyValue } from "#/modules/preprocessor/preprocess/transform/helper/kv";

type TransformIdentOptions = {
    context: CompilerContext;
    va: string;
    ident: IdentifierReference;
    arguments: Argument[];
};

type TransformIdentResult = {
    object: ObjectExpression;
};

const transformIdent = (
    options: TransformIdentOptions,
): TransformIdentResult => {
    const ctx: CompilerContext = options.context;

    const ident: IdentifierReference = cloneDeep(options.ident);

    const object: ObjectExpression = {
        type: "ObjectExpression",
        start: ident.start,
        end: ident.end,
        properties: [],
    };

    const { property: signature } = createObjectKeyValue({
        key: SIGNATURE,
        value: true,
    });

    object.properties.push(signature);

    const { property: id } = createObjectKeyValue({
        key: ID,
        value: createId({
            context: ctx,
            va: options.va,
            arguments: options.arguments,
        }),
    });

    object.properties.push(id);

    const { property: va } = createObjectKeyValue({
        key: VA,
        value: options.va,
    });

    object.properties.push(va);

    const { property: fn } = createObjectKeyValue({
        key: FN,
        value: options.ident.name,
    });

    object.properties.push(fn);

    const { property: args } = createObjectKeyValue({
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
