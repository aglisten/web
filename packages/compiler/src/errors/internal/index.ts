import type { Format, Partial } from "ts-vista";

import type { CompilerContext } from "#/contexts/compiler";
import type { Position } from "#/errors/common/position";

import { getPosition } from "#/errors/common/position";

type Span = Readonly<{
    start: number;
    end: number;
}>;

type CompleteInternalCompileErrorOptions = {
    context: CompilerContext;
    span: Span;
    message: string;
};

type InternalCompileErrorOptions = Format<
    Partial<CompleteInternalCompileErrorOptions, "span" | "message">
>;

class InternalCompileError extends Error {
    override name: string = InternalCompileError.name;

    constructor(options: InternalCompileErrorOptions) {
        const message: string = options.message ?? "Something went wrong";

        if (!options.span) {
            super(message);
        } else {
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
}

export type {
    Span,
    CompleteInternalCompileErrorOptions,
    InternalCompileErrorOptions,
};
export { InternalCompileError };
