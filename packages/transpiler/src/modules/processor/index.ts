import type { Program } from "oxc-parser";

import { cloneDeep } from "es-toolkit";
import { Visitor } from "oxc-parser";

type ProcessOptions = {
    program: Program;
    programRef: Program;
};

type ProcessResult = {
    program: Program;
};

const process = (options: ProcessOptions): ProcessResult => {
    const result: Program = cloneDeep(options.program);

    const visitor: Visitor = new Visitor({});

    visitor.visit(result);

    return {
        program: result,
    };
};

export type { ProcessOptions, ProcessResult };
export { process };
