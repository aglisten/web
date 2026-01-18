import type {
    Expression,
    Program,
    SpreadElement,
    TemplateElement,
    TemplateLiteral,
    VariableDeclaration,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";

import { Visitor } from "oxc-parser";

import { findInlineExpression } from "#/ast/expr";
import { getInfo } from "#/modules/processor/functions/get-info";

type ExpressionToStringOptions = {
    program: Program;
    expression: Expression;
};

const expressionToString = (options: ExpressionToStringOptions): string => {
    const expr: Expression = options.expression;

    // to string
    if (expr.type === "Literal") {
        if (expr.value === null) return "";
        return expr.value.toString();
    }
    // find inline expression
    else if (expr.type === "Identifier") {
        const inlineExpr: Expression | undefined = findInlineExpression({
            program: options.program,
            name: expr.name,
        });

        if (!inlineExpr) {
            throw new TypeError(`css: no inline expression found`);
        }

        const result: string = expressionToString({
            program: options.program,
            expression: inlineExpr,
        });

        return result;
    }
    // unsupported
    else {
        throw new TypeError(`css: ${expr.type} is not supported`);
    }
};

type CollectTemplateCssOptions = {
    program: Program;
    template: TemplateLiteral;
};

type CollectTemplateCssResult = {
    css: string;
};

const collectTemplateCss = (
    options: CollectTemplateCssOptions,
): CollectTemplateCssResult => {
    let css: string = "";

    const template: TemplateLiteral = options.template;

    for (let k: number = 0; k < template.quasis.length; k++) {
        // append quasi

        const quasi: TemplateElement | undefined = template.quasis[k];

        if (!quasi) continue;

        css += quasi.value.cooked ?? quasi.value.raw;

        // append expression

        const expression: Expression | undefined = template.expressions[k];

        if (!expression) continue;

        css += expressionToString({
            program: options.program,
            expression,
        });
    }

    return {
        css,
    };
};

type CollectCssOptions = {
    program: Program;
};

type CollectCssResult = {
    cssList: string[];
};

const collectCss = (options: CollectCssOptions): CollectCssResult => {
    const program: Program = options.program;

    const cssList: string[] = [];

    const visitor: Visitor = new Visitor({
        VariableDeclaration: (node: VariableDeclaration): void => {
            for (let i: number = 0; i < node.declarations.length; i++) {
                const decl: VariableDeclarator | undefined =
                    node.declarations[i];

                if (!decl) continue;

                const info: GetInfoResult | undefined = getInfo({
                    decl,
                });

                if (!info) continue;

                for (let j: number = 0; j < info.args.length; j++) {
                    const arg: (Expression | SpreadElement) | undefined =
                        info.args[j];

                    if (!arg) continue;

                    // x("abc");
                    if (arg.type === "Literal") {
                        if (arg.value === null || arg.value === "") continue;
                        cssList.push(arg.value.toString());
                    }

                    // x(`abc`);
                    // x(`abc ${x} efg`);
                    else if (arg.type === "TemplateLiteral") {
                        const collected: CollectTemplateCssResult =
                            collectTemplateCss({
                                program,
                                template: arg,
                            });

                        cssList.push(collected.css);
                    }
                }
            }
        },
    });

    visitor.visit(program);

    return {
        cssList,
    };
};

export type { CollectCssOptions, CollectCssResult };
export { collectCss };
