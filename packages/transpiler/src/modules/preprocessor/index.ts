import type { Program } from "oxc-parser";

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
    // copy object
    const result: Program = {
        ...options.program,
    };

    const visitor: Visitor = new Visitor({});

    visitor.visit(result);

    return {
        program: result,
    };
};

export type { PreprocessOptions, PreprocessResult };
export { preprocess };
