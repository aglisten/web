import type { MinifyResult } from "oxc-minify";

import { minifySync } from "oxc-minify";

type MinifyCodeResult = {
    code: string;
};

const minifyCode = (filename: string, source: string): MinifyCodeResult => {
    const result: MinifyResult = minifySync(filename, source, {
        mangle: false,
        compress: false,
    });

    return {
        code: result.code,
    };
};

export type { MinifyCodeResult };
export { minifyCode };
