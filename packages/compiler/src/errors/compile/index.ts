import type { Format, Partial } from "ts-vista";

import type { CompilerContext } from "#/contexts/compiler";
import type { Position } from "#/errors/common/position";
import type { Span } from "#/errors/internal";

import { getPosition } from "#/errors/common/position";

type CompleteCompileErrorOptions = {
    context: CompilerContext;
    span: Span;
    message: string;
};

type CompileErrorOptions = Format<
    Partial<CompleteCompileErrorOptions, "message">
>;

class CompileError extends Error {
    override name: string = CompileError.name;

    constructor(options: CompileErrorOptions) {
        const message: string = options.message ?? "Something went wrong";

        const file: string = options.context.file;

        const position: Position = getPosition(
            options.context.code,
            options.span.start,
        );

        const source: string = `${file}:${position.line}:${position.column}`;

        let result: string = "";

        result += `${message}\n\n`;

        result += ` --> ${source}\n`;

        super(result);
    }
}

export type { Span, CompleteCompileErrorOptions, CompileErrorOptions };
export { CompileError };
