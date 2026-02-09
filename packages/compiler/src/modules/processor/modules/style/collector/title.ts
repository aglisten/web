import { fixedFnv1a } from "#/modules/processor/functions/hash";
import { isEnglishLetter } from "##/processor/style/collector/helper/letter";

const getValuesHash = (values: string[], length: number): string => {
    let allValues: string = "";

    for (let i: number = 0; i < values.length; i++) {
        const current: string | undefined = values[i];

        if (!current) continue;

        allValues += values[i];
    }

    return fixedFnv1a(allValues, length);
};

type CreateStyleNodeTitleOptions = {
    selectors: string[];
    key: string;
    values: string[];
};

type CreateStyleNodeTitleResult = {
    title: string;
};

const createStyleNodeTitle = ({
    selectors,
    key,
    values,
}: CreateStyleNodeTitleOptions): CreateStyleNodeTitleResult => {
    const prefix: string = isEnglishLetter(key[0]) ? key[0] : "a";

    let title: string;

    if (selectors.length === 0) {
        const keyHash: string = fixedFnv1a(key, 3);
        const valuesHash: string = getValuesHash(values, 4);

        title = `${prefix}${keyHash}${valuesHash}`;
    } else {
        const selectorsHash: string = fixedFnv1a(selectors.join(""), 3);
        const keyHash: string = fixedFnv1a(key, 2);
        const valuesHash: string = getValuesHash(values, 2);

        title = `${prefix}${selectorsHash}${keyHash}${valuesHash}`;
    }

    return {
        title,
    };
};

export type { CreateStyleNodeTitleOptions, CreateStyleNodeTitleResult };
export { createStyleNodeTitle };
