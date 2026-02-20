import type { Runtime } from "@ammolite/runtime";
import type { Format, Partial } from "ts-vista";

type CompleteCreatePluginOptions = {
    name: string;
    runtime: Runtime;
};

type CreatePluginOptions = Format<Partial<CompleteCreatePluginOptions>>;

export type { CompleteCreatePluginOptions, CreatePluginOptions };
