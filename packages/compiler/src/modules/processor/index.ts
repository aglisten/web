import type { Program } from "oxc-parser";

import type { CollectAllKeyframesResult } from "##/processor/keyframes/collector";
import type { CollectStylesResult } from "##/processor/style/collector";
import type { ExportStylesResult } from "##/processor/style/exporter";
import type { MutateStylesResult } from "##/processor/style/mutator";
import type { CollectAllVariablesResult } from "##/processor/variables/collector";
import type { ExportAllVariablesResult } from "##/processor/variables/exporter";
import type { MutateAllVariablesResult } from "##/processor/variables/mutator";

import { cloneDeep } from "es-toolkit";

import { collectAllKeyframes } from "##/processor/keyframes/collector";
import { exportAllKeyframes } from "##/processor/keyframes/exporter";
import { mutateAllKeyframes } from "##/processor/keyframes/mutator";
import { collectStyles } from "##/processor/style/collector";
import { exportStyles } from "##/processor/style/exporter";
import { mutateStyles } from "##/processor/style/mutator";
import { collectAllVariables } from "##/processor/variables/collector";
import { exportAllVariables } from "##/processor/variables/exporter";
import { mutateAllVariables } from "##/processor/variables/mutator";

/**
 * Options for the `process` function.
 */
type ProcessOptions = {
    /**
     * The program to be processed.
     */
    program: Program;
    /**
     * The reference program.
     */
    programRef: Program;
};

/**
 * Result of the `process` function.
 */
type ProcessResult = {
    /**
     * The processed program.
     */
    program: Program;
    /**
     * The processed CSS.
     */
    css: string;
};

/**
 * Process function.
 */
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

    // Keyframes

    const resultKf: CollectAllKeyframesResult = collectAllKeyframes({
        program: resultVarMutRef.program,
    });

    const resultKfMut: MutateAllVariablesResult = mutateAllKeyframes({
        program: resultVarMut.program,
        keyframesList: resultKf.keyframesList,
    });

    const resultKfMutRef: MutateAllVariablesResult = mutateAllKeyframes({
        program: resultVarMutRef.program,
        keyframesList: resultKf.keyframesList,
    });

    // Styles

    const resultStyles: CollectStylesResult = collectStyles({
        program: resultKfMutRef.program,
    });

    const resultStylesMut: MutateStylesResult = mutateStyles({
        program: resultKfMut.program,
        styles: resultStyles.styles,
    });

    // Export

    let css: string = "";

    const resultVarExport: ExportAllVariablesResult = exportAllVariables({
        variablesList: resultVar.variablesList,
    });

    css += resultVarExport.css;

    const resultKfExport: ExportStylesResult = exportAllKeyframes({
        keyframesList: resultKf.keyframesList,
    });

    css += resultKfExport.css;

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
