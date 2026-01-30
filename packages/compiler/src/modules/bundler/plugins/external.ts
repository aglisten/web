import type { Plugin, ResolveIdResult } from "rolldown";

import * as Path from "node:path";

import { fdir } from "fdir";

const isThisPath = (id: string): boolean =>
    id.startsWith(".") || id.startsWith("/");

type GetIncludeExcludeOptions = {
    include: readonly string[];
    exclude: readonly string[];
};

type PathsAndPackages = {
    paths: readonly string[];
    packages: readonly string[];
};

type GetIncludeExcludeResult = {
    include: PathsAndPackages;
    exclude: PathsAndPackages;
};

const managePackagesAndPaths = (
    packagesOrPaths: readonly string[],
): PathsAndPackages => {
    const paths: string[] = [];
    const packages: string[] = [];

    for (const packageOrPath of packagesOrPaths) {
        const isPath: boolean = isThisPath(packageOrPath);

        if (!isPath) {
            packages.push(packageOrPath);
            continue;
        }

        const foundPaths: string[] = new fdir()
            .withFullPaths()
            .crawl(packageOrPath)
            .sync();

        paths.push(...foundPaths);
    }

    return {
        paths,
        packages,
    };
};

const getIncludeAndExclude = (
    options: GetIncludeExcludeOptions,
): GetIncludeExcludeResult => {
    const include: PathsAndPackages = managePackagesAndPaths(options.include);
    const exclude: PathsAndPackages = managePackagesAndPaths(options.exclude);

    return {
        include,
        exclude,
    };
};

const isPackage = (id: string): boolean => /^[^./]/.test(id);

const isJsFile = (id: string): boolean => {
    // check if the file have extension
    const hasExtension: boolean = Path.extname(id) !== "";

    // treat file without extension as js
    if (!hasExtension) return true;

    return (
        id.endsWith(".ts") ||
        id.endsWith(".tsx") ||
        id.endsWith(".js") ||
        id.endsWith(".jsx") ||
        id.endsWith(".cjs") ||
        id.endsWith(".mjs") ||
        id.endsWith(".cts") ||
        id.endsWith(".mts")
    );
};

type ExternalResolverOptions = {
    packageName: string;
    exclude: readonly string[];
    include: readonly string[];
};

const externalResolver = (options: ExternalResolverOptions): Plugin => {
    const { exclude, include } = getIncludeAndExclude(options);

    return {
        name: "@aglisten/transpiler/external-resolver",
        resolveId: (id: string): ResolveIdResult => {
            // CSS-in-JS package
            if (id === options.packageName) {
                return {
                    id,
                    external: true,
                };
            }

            const isPath: boolean = isThisPath(id);

            // path
            if (isPath) {
                if (exclude.paths.includes(id)) {
                    return {
                        id,
                        external: true,
                    };
                }

                if (include.paths.includes(id)) {
                    return void 0;
                }
            }

            // package
            else {
                for (const pkg of exclude.packages) {
                    if (id.startsWith(pkg)) {
                        return {
                            id,
                            external: true,
                        };
                    }
                }

                for (const pkg of include.packages) {
                    if (id.startsWith(pkg)) {
                        return void 0;
                    }
                }
            }

            // exclude packages
            if (isPackage(id)) {
                return {
                    id,
                    external: true,
                };
            }

            // bundle JS files
            if (isJsFile(id)) {
                return void 0;
            }

            // unknown file
            return {
                id,
                external: true,
            };
        },
    };
};

export type { ExternalResolverOptions };
export { externalResolver };
