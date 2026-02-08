import type { Argument, MemberExpression, ObjectExpression } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { cloneDeep } from "es-toolkit";

import { ARGS, FN, ID, SIGNATURE, VA } from "#/consts";
import { CompileError } from "#/errors/compile";
import { createObjectKeyValue } from "#/modules/preprocessor/preprocess/transform/helper/kv";
import { createId } from "./helper/id";

type TransformMemberExprOptions = {
    context: CompilerContext;
    va: string;
    member: MemberExpression;
    arguments: Argument[];
};

type TransformMemberExprResult = {
    object: ObjectExpression;
};

const transformMemberExpr = (
    options: TransformMemberExprOptions,
): TransformMemberExprResult => {
    const ctx: CompilerContext = options.context;

    const member: MemberExpression = cloneDeep(options.member);

    const object: ObjectExpression = {
        type: "ObjectExpression",
        start: member.start,
        end: member.end,
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

    let fnName: string = "";

    // const abc = x.y({ ... });
    if (member.property.type === "Identifier") {
        fnName = member.property.name;
    }

    // const abc = x["y"]({ ... });
    else if (member.property.type === "Literal") {
        if (member.property.value === "" || member.property.value === null) {
            throw new CompileError({
                context: options.context,
                span: {
                    start: member.property.start,
                    end: member.property.end,
                },
                message: `Unsupported member property value: null`,
            });
        }

        fnName = member.property.value.toString();
    } else {
        throw new CompileError({
            context: options.context,
            span: {
                start: member.property.start,
                end: member.property.end,
            },
            message: `Unsupported member expression property type: ${member.property.type}`,
        });
    }

    const { property: fn } = createObjectKeyValue({
        key: FN,
        value: fnName,
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

export type { TransformMemberExprOptions, TransformMemberExprResult };
export { transformMemberExpr };
