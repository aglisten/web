import type {
    Expression,
    NullLiteral,
    Program,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import { Visitor } from "oxc-parser";

type FindInlineExpressionOptions = {
    program: Program;
    name: string;
};

const findInlineExpression = (
    options: FindInlineExpressionOptions,
): Expression | undefined => {
    let result: Expression | undefined = void 0;

    const visitor = new Visitor({
        VariableDeclaration: (node: VariableDeclaration): void => {
            for (let i: number = 0; i < node.declarations.length; i++) {
                const decl: VariableDeclarator | undefined =
                    node.declarations[i];

                if (!decl) continue;

                if (decl.id.type === "Identifier") {
                    if (decl.id.name !== options.name) continue;

                    if (decl.init === null) {
                        result = {
                            type: "Literal",
                            value: null,
                            raw: null,
                            start: 0,
                            end: 0,
                        } satisfies NullLiteral;
                        return void 0;
                    }

                    result = decl.init;
                }
                // TODO: support more id type
                // unsupported
                else {
                    throw new TypeError(`Unsupported id type: ${decl.id.type}`);
                }
            }
        },
    });

    visitor.visit(options.program);

    return result;
};

export type { FindInlineExpressionOptions };
export { findInlineExpression };
