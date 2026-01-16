import type { MinifyResult } from "oxc-minify";

import { minifySync } from "oxc-minify";

const minify = (filename: string, source: string): MinifyResult => {
    return minifySync(filename, source, {
        mangle: false,
        compress: false,
    });
};

export { minify };
