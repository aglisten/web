import * as Fs from "node:fs";
import * as Path from "node:path";

import { compile } from "@ammolite/compiler";
import {
    INCLUDED_FUNCTIONS_DEFAULT,
    PACKAGE_NAME_DEFAULT,
} from "@ammolite/runtime/helper";
import { bench } from "vitest";

const file: string = Path.resolve(process.cwd(), "src", "index.ts");

const code: string = Fs.readFileSync(file, "utf-8");

bench("keyframes", async (): Promise<void> => {
    await compile({
        cwd: process.cwd(),
        packageName: PACKAGE_NAME_DEFAULT,
        includedFunctions: INCLUDED_FUNCTIONS_DEFAULT,
        include: [],
        exclude: [],
        file,
        code,
    });
});
