import type {
    VariableKeyValue,
    Variables,
} from "##/processor/variables/@types";

type ExportAllVariablesOptions = {
    variablesList: Variables[];
};

type ExportAllVariablesResult = {
    cssList: string[];
};

const exportAllVariables = (
    options: ExportAllVariablesOptions,
): ExportAllVariablesResult => {
    const cssList: string[] = [];

    for (let i: number = 0; i < options.variablesList.length; i++) {
        const variables: Variables | undefined = options.variablesList[i];

        if (!variables) continue;

        for (let j: number = 0; j < variables.keyValues.length; j++) {
            const kv: VariableKeyValue | undefined = variables.keyValues[j];

            if (!kv) continue;

            cssList.push(`${kv.selector}{--${kv.title}:${kv.value}}`);
        }
    }

    return {
        cssList,
    };
};

export type { ExportAllVariablesOptions, ExportAllVariablesResult };
export { exportAllVariables };
