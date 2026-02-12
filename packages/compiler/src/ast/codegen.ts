import type { PrintOptions } from "esrap";
import type { Program } from "oxc-parser";

import { print } from "esrap";
import ts from "esrap/languages/ts";
import tsx from "esrap/languages/tsx";

/**
 * Source map class from `esrap`.
 */
type SourceMap = {
    version: number;
    sources: string[];
    names: string[];
    mappings: string;
    sourcesContent: string[];
    toString: () => string;
    toUrl: () => string;
};

const isString = (value: string | null): value is string => value !== null;

const toSourceMap = (map: any): SourceMap => {
    return {
        version: map.version,
        sources: map.sources.filter(isString),
        names: map.names,
        mappings: map.mappings,
        sourcesContent: map.sourcesContent.filter(isString),
        toString: map.toString,
        toUrl: map.toUrl,
    };
};

type CodegenOptions = {
    file: string;
    code?: string;
    program: Program;
};

type CodegenResult = {
    code: string;
    map: SourceMap;
};

const codegen = (options: CodegenOptions): CodegenResult => {
    const printOptions: PrintOptions = {
        sourceMapSource: options.file,
        sourceMapContent: options.code,
        sourceMapEncodeMappings: true,
        indent: "    ",
    };

    // tsx / jsx
    if (options.file.endsWith(".tsx") || options.file.endsWith(".jsx")) {
        const { code, map } = print(options.program, tsx(), printOptions);

        return {
            code,
            map: toSourceMap(map),
        };
    }

    // ts / js
    const { code, map } = print(options.program, ts(), printOptions);

    return {
        code,
        map: toSourceMap(map),
    };
};

export type { CodegenOptions, SourceMap, CodegenResult };
export { codegen };
