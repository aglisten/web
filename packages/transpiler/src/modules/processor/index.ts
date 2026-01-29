import type { Program } from "oxc-parser";

import type { CollectStylesResult } from "##/processor/style/collector";
import type { ExportStylesResult } from "##/processor/style/exporter";
import type { MutateStylesResult } from "##/processor/style/mutator";
import type { CollectVariablesResult } from "##/processor/variables/collector";
import type { ExportVariablesResult } from "##/processor/variables/exporter";
import type { MutateVariablesResult } from "##/processor/variables/mutator";

import { cloneDeep } from "es-toolkit";

import { collectStyles } from "##/processor/style/collector";
import { exportStyles } from "##/processor/style/exporter";
import { mutateStyles } from "##/processor/style/mutator";
import { collectVariables } from "##/processor/variables/collector";
import { exportVariables } from "##/processor/variables/exporter";
import { mutateVariables } from "##/processor/variables/mutator";

type ProcessOptions = {
    program: Program;
    programRef: Program;
};

type ProcessResult = {
    program: Program;
    css: string;
};

const process = (options: ProcessOptions): ProcessResult => {
    const programRef: Program = cloneDeep(options.programRef);
    const program: Program = cloneDeep(options.program);

    // Variables

    const resultVar: CollectVariablesResult = collectVariables({
        program: programRef,
    });

    const resultVarMut: MutateVariablesResult = mutateVariables({
        program,
        variablesList: resultVar.variablesList,
    });

    const resultVarMutRef: MutateVariablesResult = mutateVariables({
        program: programRef,
        variablesList: resultVar.variablesList,
    });

    // Styles

    const resultStyles: CollectStylesResult = collectStyles({
        program: resultVarMutRef.program,
    });

    const resultStylesMut: MutateStylesResult = mutateStyles({
        program: resultVarMut.program,
        styles: resultStyles.styles,
    });

    // Export

    let css: string = "";

    const resultVarExport: ExportVariablesResult = exportVariables({
        variablesList: resultVar.variablesList,
    });

    css += resultVarExport.css;

    const resultStylesExport: ExportStylesResult = exportStyles({
        styles: resultStyles.styles,
    });

    css += resultStylesExport.css;

    return {
        program: resultStylesMut.program,
        css,
    };
};

export type { ProcessOptions, ProcessResult };
export { process };
