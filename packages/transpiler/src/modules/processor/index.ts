import type { Program } from "oxc-parser";

import type { CollectCssResult } from "##/processor/css/collector";
import type { MutateCssResult } from "##/processor/css/mutator";

import { cloneDeep } from "es-toolkit";

import { collectCss } from "##/processor/css/collector";
import { mutateCss } from "##/processor/css/mutator";

type ProcessOptions = {
    program: Program;
    programRef: Program;
    classNamePrefix: string;
};

type ProcessResult = {
    program: Program;
    css: string;
};

const process = (options: ProcessOptions): ProcessResult => {
    const result: Program = cloneDeep(options.program);

    let css: string = "";

    const collectedCss: CollectCssResult = collectCss({
        program: result,
    });

    css += collectedCss.cssList.join("");

    const mutatedCss: MutateCssResult = mutateCss({
        program: result,
    });

    return {
        program: mutatedCss.program,
        css,
    };
};

export type { ProcessOptions, ProcessResult };
export { process };
