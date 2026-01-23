import type { Program } from "oxc-parser";

import type { CollectCssResult } from "##/processor/css/collector";
import type { MutateCssResult } from "##/processor/css/mutator";
import type { CollectVariablesResult } from "##/processor/variables/collector";
import type { ExportVariablesResult } from "##/processor/variables/exporter";
import type { MutateVariablesResult } from "##/processor/variables/mutator";

import { cloneDeep } from "es-toolkit";

import { collectCss } from "##/processor/css/collector";
import { mutateCss } from "##/processor/css/mutator";
import { collectVariables } from "##/processor/variables/collector";
import { exportVariables } from "##/processor/variables/exporter";
import { mutateVariables } from "##/processor/variables/mutator";

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

    // CSS

    const resultCss: CollectCssResult = collectCss({
        program: result,
    });

    const resultCssMut: MutateCssResult = mutateCss({
        program: result,
    });

    // Variables

    const resultVar: CollectVariablesResult = collectVariables({
        program: resultCssMut.program,
    });

    const resultVarMut: MutateVariablesResult = mutateVariables({
        program: resultCssMut.program,
        variablesList: resultVar.variablesList,
    });

    // Export

    let css: string = "";

    css += resultCss.cssList.join("");

    const resultVarExport: ExportVariablesResult = exportVariables({
        variablesList: resultVar.variablesList,
    });

    css += resultVarExport.css;

    return {
        program: resultVarMut.program,
        css,
    };
};

export type { ProcessOptions, ProcessResult };
export { process };
