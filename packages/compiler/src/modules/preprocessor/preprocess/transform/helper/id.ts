import type { Argument } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";

import { fixedFnv1a } from "#/modules/processor/functions/hash";

type CreateIdOptions = {
    context: CompilerContext;
    va: string;
    arguments: Argument[];
};

const createId = (options: CreateIdOptions): string => {
    const ctx: CompilerContext = options.context;

    if (ctx.isTest) return options.va;

    const struct: string = JSON.stringify(options.arguments);

    const hash: string = fixedFnv1a(struct, 8);

    return hash;
};

export type { CreateIdOptions };
export { createId };
