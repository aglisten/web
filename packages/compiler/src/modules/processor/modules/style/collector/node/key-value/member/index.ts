import type { MemberExpression, Program } from "oxc-parser";

import type { CompilerContext } from "#/contexts/compiler";
import type { StyleNodePlan } from "##/processor/style/@types";

import { handleKeyValue } from "##/processor/style/collector/node/key-value";
import { collectMemberPath } from "##/processor/style/collector/node/key-value/member/collect";
import { resolvePathToExpr } from "##/processor/style/collector/node/key-value/member/resolve";

type HandleMemberValueOptions = {
    context: CompilerContext;
    program: Program;
    selectors: readonly string[];
    key: string;
    member: MemberExpression;
};

type HandleMemberValueResult = {
    plans: StyleNodePlan[];
};

const handleMemberValue = (
    options: HandleMemberValueOptions,
): HandleMemberValueResult => {
    const { path } = collectMemberPath({
        context: options.context,
        program: options.program,
        member: options.member,
    });

    const { expr } = resolvePathToExpr({
        context: options.context,
        program: options.program,
        member: options.member,
        path,
    });

    return handleKeyValue({
        context: options.context,
        program: options.program,
        selectors: options.selectors,
        key: options.key,
        value: expr,
    });
};

export type { HandleMemberValueOptions, HandleMemberValueResult };
export { handleMemberValue };
