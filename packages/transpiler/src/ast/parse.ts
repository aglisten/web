import type { ParseResult } from "oxc-parser";

import { parse as oxcParse } from "oxc-parser";

type ParseOptions = {
    filename: string;
    source: string;
};

const parse = async (options: ParseOptions): Promise<ParseResult> => {
    return await oxcParse(options.filename, options.source);
};

export type { ParseOptions, ParseResult };
export { parse };
