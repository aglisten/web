import type { Program } from "oxc-parser";

import type { CollectStylesResult } from "##/processor/style/collector";
import type { ExportStylesResult } from "##/processor/style/exporter";
import type { MutateStylesResult } from "##/processor/style/mutator";
import type { CollectAllVariablesResult } from "##/processor/variables/collector";
import type { ExportAllVariablesResult } from "##/processor/variables/exporter";
import type { MutateAllVariablesResult } from "##/processor/variables/mutator";

import { cloneDeep } from "es-toolkit";

import { collectStyles } from "##/processor/style/collector";
import { exportStyles } from "##/processor/style/exporter";
import { mutateStyles } from "##/processor/style/mutator";
import { collectAllVariables } from "##/processor/variables/collector";
import { exportAllVariables } from "##/processor/variables/exporter";
import { mutateAllVariables } from "##/processor/variables/mutator";

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

    const resultVar: CollectAllVariablesResult = collectAllVariables({
        program: programRef,
    });

    const resultVarMut: MutateAllVariablesResult = mutateAllVariables({
        program,
        variablesList: resultVar.variablesList,
    });

    const resultVarMutRef: MutateAllVariablesResult = mutateAllVariables({
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

    const resultVarExport: ExportAllVariablesResult = exportAllVariables({
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
