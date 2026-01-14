import type { Program } from "oxc-parser";

import { Visitor } from "oxc-parser";

type ProcessOptions = {
    program: Program;
};

type ProcessResult = {
    program: Program;
};

const process = async (options: ProcessOptions): Promise<ProcessResult> => {
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

export type { ProcessOptions, ProcessResult };
export { process };
