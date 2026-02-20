import type { PluginOptions } from "#/@types/options";

import * as Path from "node:path";

type GetOutputOptions = {
    options?: PluginOptions;
};

type Output = {
    outName: string;
};

const getOutput = (options: GetOutputOptions): Output => {
    let outName: string = "";

    const parsed: Path.ParsedPath = Path.parse(
        options.options?.output?.fileName ?? "ammolite",
    );

    const hasExt: boolean = parsed.ext !== "";

    if (hasExt) {
        outName = `${parsed.name}${parsed.ext}`;
    } else {
        outName = `${parsed.name}.css`;
    }

    return {
        outName,
    };
};

export type { GetOutputOptions, Output };
export { getOutput };
