import type { VariableDeclarator } from "oxc-parser";

type createEmptyVarDeclOptions = {
    id: string;
};

const createEmptyVarDecl = (
    options: createEmptyVarDeclOptions,
): VariableDeclarator => {
    return {
        type: "VariableDeclarator",
        id: {
            type: "Identifier",
            name: options.id,
            start: 0,
            end: 0,
        },
        init: null,
        start: 0,
        end: 0,
    };
};

export { createEmptyVarDecl };
