import type { Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { CollectAllKeyframesResult } from "##/processor/keyframes/collector";
import type { CollectStylesResult } from "##/processor/style/collector";
import type { ExportStylesResult } from "##/processor/style/exporter";
import type { MutateStylesResult } from "##/processor/style/mutator";
import type { CollectAllVariablesResult } from "##/processor/variables/collector";
import type { ExportAllVariablesResult } from "##/processor/variables/exporter";
import type { MutateAllVariablesResult } from "##/processor/variables/mutator";

import { cloneDeep } from "es-toolkit";

import { transformCssList } from "#/modules/processor/css";
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
     * The compiler context.
     */
    context: CompilerContext;
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
    /**
     * The processed CSS separated by elements.
     */
    cssList: string[];
};

/**
 * Process function.
 */
const process = (options: ProcessOptions): ProcessResult => {
    const programRef: Program = cloneDeep(options.programRef);
    const program: Program = cloneDeep(options.program);

    // Variables

    const resultVar: CollectAllVariablesResult = collectAllVariables({
        context: options.context,
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
        context: options.context,
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
        context: options.context,
        program: resultKfMutRef.program,
    });

    const resultStylesMut: MutateStylesResult = mutateStyles({
        program: resultKfMut.program,
        styles: resultStyles.styles,
    });

    // Export

    const cssList: string[] = [];

    const resultVarExport: ExportAllVariablesResult = exportAllVariables({
        variablesList: resultVar.variablesList,
    });

    cssList.push(...resultVarExport.cssList);

    const resultKfExport: ExportStylesResult = exportAllKeyframes({
        keyframesList: resultKf.keyframesList,
    });

    cssList.push(...resultKfExport.cssList);

    const resultStylesExport: ExportStylesResult = exportStyles({
        styles: resultStyles.styles,
    });

    cssList.push(...resultStylesExport.cssList);

    const transformedCssList: string[] = transformCssList(cssList);

    return {
        program: resultStylesMut.program,
        css: transformedCssList.join(""),
        cssList: transformedCssList,
    };
};

export type { ProcessOptions, ProcessResult };
export { process };
