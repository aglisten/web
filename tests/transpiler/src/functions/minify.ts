import { minify as oxcMinify } from "oxc-minify";

const minify = async (filename: string, source: string) => {
    return await oxcMinify(filename, source, {
        mangle: false,
        compress: false,
    });
};

export { minify };
