import type { ParseResult } from "oxc-parser";

import { parseSync } from "oxc-parser";

type ParseOptions = {
    filename: string;
    source: string;
};

const parse = (options: ParseOptions): ParseResult => {
    return parseSync(options.filename, options.source);
};

export type { ParseOptions, ParseResult };
export { parse };
