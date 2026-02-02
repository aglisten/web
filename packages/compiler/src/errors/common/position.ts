type Position = Readonly<{
    line: number;
    column: number;
}>;

const getPosition = (code: string, start: number): Position => {
    const lines: string[] = code.slice(0, start).split("\n");

    const lastLine: string | undefined = lines[lines.length - 1];

    if (lastLine) {
        return {
            line: lines.length,
            column: lastLine.length + 1,
        };
    }

    return {
        line: lines.length,
        column: 0,
    };
};

export type { Position };
export { getPosition };
