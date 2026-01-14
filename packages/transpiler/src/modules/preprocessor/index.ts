import type { Program } from "oxc-parser";

import { cloneDeep } from "es-toolkit";
import { Visitor } from "oxc-parser";

type PreprocessOptions = {
    program: Program;
};

type PreprocessResult = {
    program: Program;
};

const preprocess = async (
    options: PreprocessOptions,
): Promise<PreprocessResult> => {
    const result: Program = cloneDeep(options.program);

    const visitor: Visitor = new Visitor({});

    visitor.visit(result);

    return {
        program: result,
    };
};

export type { PreprocessOptions, PreprocessResult };
export { preprocess };
