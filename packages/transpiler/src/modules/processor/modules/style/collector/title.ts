import { fixedFnv1a } from "#/modules/processor/functions/hash";

const isEnglishLetter = (char?: string): char is string => {
    if (!char) return false;

    return /^[A-Za-z]/.test(char);
};

type CreateStyleNodeTitleOptions = {
    selectors: string[];
    key: string;
    value: string;
};

type CreateStyleNodeTitleResult = {
    title: string;
};

const createStyleNodeTitle = ({
    selectors,
    key,
    value,
}: CreateStyleNodeTitleOptions): CreateStyleNodeTitleResult => {
    const prefix: string = isEnglishLetter(key[0]) ? key[0] : "a";

    let title: string;

    if (selectors.length === 0) {
        const key_hash: string = fixedFnv1a(key, 3);
        const value_hash: string = fixedFnv1a(value, 4);

        title = `${prefix}${key_hash}${value_hash}`;
    } else {
        const selectors_hash: string = fixedFnv1a(selectors.join(""), 3);
        const key_hash: string = fixedFnv1a(key, 2);
        const value_hash: string = fixedFnv1a(value, 2);

        title = `${prefix}${selectors_hash}${key_hash}${value_hash}`;
    }

    return {
        title,
    };
};

export type { CreateStyleNodeTitleOptions, CreateStyleNodeTitleResult };
export { createStyleNodeTitle };
