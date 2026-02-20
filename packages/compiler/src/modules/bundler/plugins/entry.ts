import type { LoadResult, Plugin } from "rolldown";

type EntryOverriderOptions = {
    file: string;
    code: string;
};

const entryOverrider = (options: EntryOverriderOptions): Plugin => {
    return {
        name: "@ammolite/transpiler/entry-overrider",
        load: (file: string): LoadResult => {
            if (file === options.file) return options.code;
            return void 0;
        },
    };
};

export type { EntryOverriderOptions };
export { entryOverrider };
