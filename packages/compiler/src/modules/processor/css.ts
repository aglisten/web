type CssBlock = {
    selector: string;
    body: string;
};

const parseCss = (css: string): CssBlock => {
    const start: number = css.indexOf("{");
    const end: number = css.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        return {
            selector: css.trim(),
            body: "",
        };
    }

    return {
        selector: css.slice(0, start).trim(),
        body: css.slice(start + 1, end).trim(),
    };
};

const getPriority = (css: string): number => {
    if (css.startsWith(":root")) return 0;
    if (css.startsWith("@")) return 1;
    if (/^[a-zA-Z]/.test(css)) return 2;
    if (css.startsWith(".")) return 3;
    return 4;
};

/**
 * This function will sort CSS list by selector.
 *
 * For example, `:root { xxx }` and other `:root { xxx }` will be sorted together,
 * and `.xxx { xxx }` will be sorted after them.
 */
const sortCssList = (cssList: string[]): string[] => {
    return [
        ...cssList,
    ].sort((a: string, b: string): number => {
        const sa: CssBlock = parseCss(a);
        const sb: CssBlock = parseCss(b);

        const pa: number = getPriority(sa.selector);
        const pb: number = getPriority(sb.selector);

        if (pa !== pb) return pa - pb;

        return sa.selector.localeCompare(sb.selector);
    });
};

/**
 * This function will merge CSS list by selector.
 *
 * For example, `:root { display: block }` and `:root { color: blue }`
 * will be merged to `:root { display: block; color: blue }`.
 */
const mergeCssList = (cssList: string[]): string[] => {
    const map: Map<string, Set<string>> = new Map();

    for (let i: number = 0; i < cssList.length; i++) {
        const css: string | undefined = cssList[i];

        if (!css) continue;

        const { selector, body }: CssBlock = parseCss(css);

        if (!body) continue;

        const declarations: string[] = body
            .split(";")
            .map((d: string): string => d.trim())
            .filter(Boolean);

        const existing: Set<string> = map.get(selector) ?? new Set<string>();

        for (const decl of declarations) {
            existing.add(decl);
        }

        map.set(selector, existing);
    }

    const result: string[] = [];

    map.forEach((set: Set<string>, selector: string): void => {
        const body: string = Array.from(set).join(";");
        result.push(`${selector}{${body}}`);
    });

    return result;
};

/**
 * This function will transform CSS list.
 */
const transformCssList = (cssList: string[]): string[] => {
    return sortCssList(mergeCssList(cssList));
};

export { transformCssList };
