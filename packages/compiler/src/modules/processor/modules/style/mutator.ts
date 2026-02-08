import type {
    Directive,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { Style, StyleNode } from "##/processor/style/@types";

import { cloneDeep } from "es-toolkit";

import { getInfo } from "#/modules/processor/functions/get-info";

type MutateStyleOptions = {
    decl: VariableDeclarator;
    id: string;
    style: Style;
};

const mutateStyle = (options: MutateStyleOptions): VariableDeclarator => {
    const classNames: string[] = options.style.children.map(
        (node: StyleNode): string => node.title,
    );

    return {
        ...options.decl,
        init: {
            type: "Literal",
            value: classNames.join(" "),
            raw: null,
            start: 0,
            end: 0,
        },
    };
};

type MutateStylesOptions = {
    program: Program;
    styles: Style[];
};

type MutateStylesResult = {
    program: Program;
};

const mutateStyles = (options: MutateStylesOptions): MutateStylesResult => {
    const program: Program = cloneDeep(options.program);

    for (let i: number = 0; i < program.body.length; i++) {
        const body: Directive | Statement | undefined = program.body[i];

        if (!body) continue;

        if (body.type !== "VariableDeclaration") continue;

        for (let j: number = 0; j < body.declarations.length; j++) {
            const decl: VariableDeclarator | undefined = body.declarations[j];

            if (!decl) continue;

            const info: VarDeclInfo | undefined = getInfo({
                decl,
            });

            if (!info) continue;

            if (info.fn !== "style") continue;

            const style: Style | undefined = options.styles.find(
                (style: Style): boolean => style.id === info.id,
            );

            if (!style) continue;

            body.declarations[j] = mutateStyle({
                decl,
                id: info.id,
                style,
            });
        }
    }

    return {
        program,
    };
};

export type { MutateStylesOptions, MutateStylesResult };
export { mutateStyles };
