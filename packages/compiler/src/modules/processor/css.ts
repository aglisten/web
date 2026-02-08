const getPriority = (css: string): number => {
    if (css.startsWith(":root")) return 0;

    if (/^[a-zA-Z]/.test(css)) return 1;

    if (css.startsWith(".")) return 2;

    return 3;
};

const getSelector = (css: string): string => {
    const idx: number = css.indexOf("{");
    return idx === -1 ? css : css.slice(0, idx).trim();
};

const sortCssList = (cssList: string[]): string[] => {
    return cssList.sort((a: string, b: string): number => {
        const pa: number = getPriority(a);
        const pb: number = getPriority(b);

        if (pa !== pb) return pa - pb;

        const sa: string = getSelector(a);
        const sb: string = getSelector(b);

        return sa.localeCompare(sb);
    });
};

export { sortCssList };
