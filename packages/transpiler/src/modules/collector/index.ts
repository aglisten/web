import type {
    Argument,
    ImportDeclaration,
    Program,
    VariableDeclaration,
} from "oxc-parser";

import { Visitor } from "oxc-parser";

type CollectOptions = {
    program: Program;
    packageName: string;
    includedFunctions: string[];
};

type Specifier = {
    imported: string;
    local: string;
};

type CollectResult = {
    isImported: boolean;
    namespaces: string[];
    specifiers: Specifier[];
};

const collect = async (options: CollectOptions): Promise<CollectResult> => {
    // copy object
    const result: Program = {
        ...options.program,
    };

    let isImported: boolean = false;
    const namespaces: string[] = [];
    const specifiers: Specifier[] = [];

    const visitor: Visitor = new Visitor({
        // ESM
        ImportDeclaration: async (node: ImportDeclaration): Promise<void> => {
            if (node.source.value !== options.packageName) return void 0;

            isImported = true;

            for (const specifier of node.specifiers) {
                // import x from "p";
                if (specifier.type === "ImportDefaultSpecifier") {
                    namespaces.push(specifier.local.name);
                }

                // import * as x from "p";
                else if (specifier.type === "ImportNamespaceSpecifier") {
                    namespaces.push(specifier.local.name);
                }

                // import { x } from "p";
                // import { x as y } from "p";
                else if (specifier.type === "ImportSpecifier") {
                    if (specifier.imported.type === "Identifier") {
                        if (
                            !options.includedFunctions.includes(
                                specifier.imported.name,
                            )
                        )
                            return void 0;

                        specifiers.push({
                            imported: specifier.imported.name,
                            local: specifier.local.name,
                        });
                    }

                    // unhandled type: Literal
                }
            }
        },
        // CJS
        VariableDeclaration: async (
            node: VariableDeclaration,
        ): Promise<void> => {
            for (const decl of node.declarations) {
                if (!decl.init) return void 0;
                if (decl.init.type !== "CallExpression") return void 0;
                if (decl.init.callee.type !== "Identifier") return void 0;
                if (decl.init.callee.name !== "require") return void 0;
                if (decl.init.arguments.length !== 1) return void 0;

                const arg: Argument | undefined = decl.init.arguments[0];

                if (!arg) return void 0;
                if (arg.type !== "Literal") return void 0;
                if (arg.value !== options.packageName) return void 0;

                isImported = true;

                // const x = require("p");
                if (decl.id.type === "Identifier") {
                    namespaces.push(decl.id.name);
                }

                // const { ... } = require("p");
                else if (decl.id.type === "ObjectPattern") {
                    for (const prop of decl.id.properties) {
                        // const { x } = require("p");
                        // const { x: y } = require("p");
                        if (prop.type === "Property") {
                            if (
                                prop.key.type === "Identifier" &&
                                prop.value.type === "Identifier"
                            ) {
                                specifiers.push({
                                    imported: prop.key.name,
                                    local: prop.value.name,
                                });
                            }
                        }

                        // const { ...x } = require("p");
                        else if (prop.type === "RestElement") {
                            if (prop.argument.type === "Identifier") {
                                namespaces.push(prop.argument.name);
                            }
                        }
                    }
                }
            }
        },
    });

    visitor.visit(result);

    return {
        isImported,
        namespaces,
        specifiers,
    };
};

export type { CollectOptions, Specifier, CollectResult };
export { collect };
