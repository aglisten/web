import { Processor } from "postcss";
// @ts-expect-error
import { default as minify } from "postcss-minify";

type MinifyCSSOptions = {
    source: string;
};

type MinifyCSSResult = {
    code: string;
};

const minifyCSS = (options: MinifyCSSOptions): MinifyCSSResult => {
    const processor: Processor = new Processor([
        minify(),
    ]);

    const { css } = processor.process(options.source).sync();

    return {
        code: css,
    };
};

export type { MinifyCSSResult };
export { minifyCSS };
