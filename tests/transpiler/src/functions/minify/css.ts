import type { TransformResult } from "lightningcss";

import { transform } from "lightningcss";

type MinifyCSSResult = {
    code: string;
};

const minifyCSS = (filename: string, source: string): MinifyCSSResult => {
    const result: TransformResult = transform({
        filename,
        code: new TextEncoder().encode(source),
        minify: true,
    });

    return {
        code: result.code.toString(),
    };
};

export type { MinifyCSSResult };
export { minifyCSS };
