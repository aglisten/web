import type {
    Argument,
    ImportDeclaration,
    Program,
    VariableDeclaration,
} from "oxc-parser";

import type { Specifier } from "#/@types/specifier";

import { Visitor } from "oxc-parser";

/**
 * Options for the `collect` function.
 */
type CollectOptions = {
    /**
     * Program to be collected.
     */
    program: Program;
    /**
     * Package name of the CSS-in-JS package.
     */
    packageName: string;
    /**
     * CSS-in-JS package functions to be preprocessed.
     */
    includedFunctions: readonly string[];
};

/**
 * Result of the `collect` function.
 */
type CollectResult = {
    /**
     * Whether the CSS-in-JS package is imported.
     */
    isImported: boolean;
    /**
     * Namespaces used by the CSS-in-JS package.
     */
    namespaces: string[];
    /**
     * Specifiers used by the CSS-in-JS package.
     */
    specifiers: Specifier[];
};

/**
 * Collect the information of the file.
 */
const collect = (options: CollectOptions): CollectResult => {
    const result: Program = options.program;

    let isImported: boolean = false;
    const namespaces: string[] = [];
    const specifiers: Specifier[] = [];

    const visitor: Visitor = new Visitor({
        // ESM
        ImportDeclaration: (node: ImportDeclaration): void => {
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
                            continue;

                        specifiers.push({
                            imported: specifier.imported.name,
                            local: specifier.local.name,
                        });
                    }

                    // unsupported type
                    else {
                        throw new TypeError(
                            `Unsupported specifier imported type: ${specifier.imported.type}`,
                        );
                    }
                }
            }
        },
        // CJS
        VariableDeclaration: (node: VariableDeclaration): void => {
            for (const decl of node.declarations) {
                if (!decl.init) continue;
                if (decl.init.type !== "CallExpression") continue;
                if (decl.init.callee.type !== "Identifier") continue;
                if (decl.init.callee.name !== "require") continue;
                if (decl.init.arguments.length !== 1) continue;

                const arg: Argument | undefined = decl.init.arguments[0];

                if (!arg) continue;
                if (arg.type !== "Literal") continue;
                if (arg.value !== options.packageName) continue;

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
                            if (prop.key.type !== "Identifier") {
                                throw new TypeError(
                                    `Unsupported require property key type: ${prop.key.type}`,
                                );
                            }

                            if (prop.value.type !== "Identifier") {
                                throw new TypeError(
                                    `Unsupported require property value type: ${prop.value.type}`,
                                );
                            }

                            specifiers.push({
                                imported: prop.key.name,
                                local: prop.value.name,
                            });
                        }

                        // const { ...x } = require("p");
                        else if (prop.type === "RestElement") {
                            if (prop.argument.type !== "Identifier") {
                                throw new TypeError(
                                    `Unsupported require rest argument type: ${prop.argument.type}`,
                                );
                            }

                            namespaces.push(prop.argument.name);
                        }
                    }
                }

                // unsupported type
                else {
                    throw new TypeError(
                        `Unsupported variable declaration id type: ${decl.id.type}`,
                    );
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
