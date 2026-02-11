import type { Compilation, Compiler } from "webpack";

type HtmlBeforeEmitHook = {
    tapPromise(
        name: string,
        handler: (data: {
            html: string;
            outputName: string;
            plugin: unknown;
        }) => Promise<unknown>,
    ): void;
};

type HtmlCompilationHooks = {
    beforeEmit?: HtmlBeforeEmitHook;
};

const getHtmlHooks = (
    compilation: Compilation,
    compiler: Compiler,
): HtmlCompilationHooks[] => {
    const hooks: HtmlCompilationHooks[] = [];

    for (const plugin of compiler.options.plugins ?? []) {
        const anyPlugin = plugin as unknown as {
            constructor?: {
                getCompilationHooks?: (
                    compilation: Compilation,
                ) => HtmlCompilationHooks;
            };
        };

        if (anyPlugin?.constructor?.getCompilationHooks) {
            try {
                const result =
                    anyPlugin.constructor.getCompilationHooks(compilation);

                if (result?.beforeEmit) {
                    hooks.push(result);
                }
            } catch {
                // ignore incompatible plugins
            }
        }
    }

    return hooks;
};

export type { HtmlBeforeEmitHook, HtmlCompilationHooks };
export { getHtmlHooks };
