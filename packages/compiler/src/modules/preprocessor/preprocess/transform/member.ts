import type { Argument, MemberExpression, ObjectExpression } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { cloneDeep } from "es-toolkit";

import { ARGS, ID, KIND, SIGNATURE } from "#/consts";
import { CompileError } from "#/errors/compile";
import { createObjectKeyValue } from "#/modules/preprocessor/preprocess/transform/helper/kv";

type TransformMemberExprOptions = {
    context: CompilerContext;
    id: string;
    member: MemberExpression;
    arguments: Argument[];
};

type TransformMemberExprResult = {
    object: ObjectExpression;
};

const transformMemberExpr = (
    options: TransformMemberExprOptions,
): TransformMemberExprResult => {
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
        value: options.id,
    });

    object.properties.push(id);

    let kindName: string = "";

    // const abc = x.y({ ... });
    if (member.property.type === "Identifier") {
        kindName = member.property.name;
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

        kindName = member.property.value.toString();
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

    const { property: kind } = createObjectKeyValue({
        key: KIND,
        value: kindName,
    });

    object.properties.push(kind);

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
