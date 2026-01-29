import type {
    Directive,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { GetInfoResult } from "#/modules/processor/functions/get-info";
import type { Style } from "##/processor/style/@types";

import { cloneDeep } from "es-toolkit";

import { getInfo } from "#/modules/processor/functions/get-info";

type TransformStylesOptions = {
    decl: VariableDeclarator;
    id: string;
    styles: Style[];
};

const transformStyles = (
    options: TransformStylesOptions,
): VariableDeclarator => {
    const classNames: string[] = options.styles.map(
        (style: Style): string => style.id,
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

            const info: GetInfoResult | undefined = getInfo({
                decl,
            });

            if (!info) continue;

            if (info.kind !== "style") continue;

            body.declarations[j] = transformStyles({
                decl,
                id: info.id,
                styles: options.styles,
            });
        }
    }

    return {
        program,
    };
};

export type { MutateStylesOptions, MutateStylesResult };
export { mutateStyles };
