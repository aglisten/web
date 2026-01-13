import type { Program } from "oxc-parser";

import { print } from "esrap";
import ts from "esrap/languages/ts";
import tsx from "esrap/languages/tsx";

type CodegenOptions = {
    filename: string;
    program: Program;
};

type CodegenResult = {
    code: string;
    map: any;
};

const codegen = (options: CodegenOptions): CodegenResult => {
    // tsx / jsx
    if (
        options.filename.endsWith(".tsx") ||
        options.filename.endsWith(".jsx")
    ) {
        return print(options.program, tsx());
    }

    // ts / js
    return print(options.program, ts());
};

export type { CodegenOptions, CodegenResult };
export { codegen };
