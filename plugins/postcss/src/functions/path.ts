import * as fs from "node:fs";
import * as path from "node:path";

import { FILTER_JS_ADVANCED } from "@ammolite/runtime/helper";
import { fdir } from "fdir";

type GetPathsOptions = {
    cwd: string;
    paths: readonly string[];
};

const resolveLocalPath = async (pa: string): Promise<string[]> => {
    return await new fdir()
        .withFullPaths()
        .filter((current): boolean => {
            return FILTER_JS_ADVANCED.test(current);
        })
        .crawl(pa)
        .withPromise();
};

const getPaths = async (options: GetPathsOptions): Promise<string[]> => {
    const result: string[] = [];

    for await (const input of options.paths) {
        const inputPath: string = path.resolve(options.cwd, input);

        // path
        if (fs.existsSync(inputPath)) {
            // directory
            if (fs.statSync(inputPath).isDirectory()) {
                result.push(...(await resolveLocalPath(inputPath)));
            }
            // file
            else {
                // only push JS files
                if (FILTER_JS_ADVANCED.test(inputPath)) {
                    result.push(inputPath);
                }
            }
        }
        // dependency
        else {
            const depPath: string = path.resolve(
                options.cwd,
                "node_modules",
                input,
            );

            if (!fs.existsSync(depPath)) {
                throw new Error(`Failed to load: ${input}`);
            }

            result.push(...(await resolveLocalPath(depPath)));
        }
    }

    return result;
};

export type { GetPathsOptions };
export { getPaths };
