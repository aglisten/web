import type {
    Directive,
    Program,
    Statement,
    VariableDeclarator,
} from "oxc-parser";

import type { VarDeclInfo } from "#/modules/processor/functions/get-info";
import type { Keyframes } from "##/processor/keyframes/@types";

import { cloneDeep } from "es-toolkit";

import { getInfo } from "#/modules/processor/functions/get-info";

type MutateKeyframesOptions = {
    decl: VariableDeclarator;
    id: string;
    keyframes: Keyframes;
};

const mutateKeyframes = (
    options: MutateKeyframesOptions,
): VariableDeclarator => {
    return {
        ...options.decl,
        init: {
            type: "Literal",
            value: options.keyframes.title,
            raw: null,
            start: 0,
            end: 0,
        },
    };
};

type MutateAllKeyframesOptions = {
    program: Program;
    keyframesList: Keyframes[];
};

type MutateAllKeyframesResult = {
    program: Program;
};

const mutateAllKeyframes = (
    options: MutateAllKeyframesOptions,
): MutateAllKeyframesResult => {
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

            if (info.fn !== "keyframes") continue;

            const keyframes: Keyframes | undefined = options.keyframesList.find(
                (kf: Keyframes): boolean => kf.id === info.id,
            );

            if (!keyframes) continue;

            body.declarations[j] = mutateKeyframes({
                decl,
                id: info.id,
                keyframes,
            });
        }
    }

    return {
        program,
    };
};

export type { MutateAllKeyframesOptions, MutateAllKeyframesResult };
export { mutateAllKeyframes };
