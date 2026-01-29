import type { ParseResult } from "oxc-parser";

import { parseSync } from "oxc-parser";

type ParseOptions = {
    file: string;
    code: string;
};

const parse = (options: ParseOptions): ParseResult => {
    return parseSync(options.file, options.code);
};

export type { ParseOptions, ParseResult };
export { parse };
