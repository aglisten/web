import type {
    VariableKeyValue,
    Variables,
} from "##/processor/variables/@types";

type ExportVariablesOptions = {
    variablesList: Variables[];
};

type ExportVariablesResult = {
    css: string;
};

const exportVariables = (
    options: ExportVariablesOptions,
): ExportVariablesResult => {
    let css: string = "";

    for (let i: number = 0; i < options.variablesList.length; i++) {
        const variables: Variables | undefined = options.variablesList[i];

        if (!variables) continue;

        for (let j: number = 0; j < variables.keyValues.length; j++) {
            const kv: VariableKeyValue | undefined = variables.keyValues[j];

            if (!kv) continue;

            css += `${kv.selector}{--${kv.title}:${kv.value}}`;
        }
    }

    return {
        css,
    };
};

export type { ExportVariablesOptions, ExportVariablesResult };
export { exportVariables };
