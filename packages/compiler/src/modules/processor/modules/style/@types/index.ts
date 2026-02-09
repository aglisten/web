import type { Format } from "ts-vista";

/**
 * Style node plan type.
 *
 * This is a plan for creating a style node.
 */
type StyleNodePlan = {
    /**
     * Included selectors for current style node.
     *
     * For example, `[".child"]` and `["@media (hover: hover)", "&:hover"]`.
     */
    selectors: string[];
    /**
     * Style key.
     *
     * For example, `display` and `backgroundColor`.
     */
    key: string;
    /**
     * Style value with the possibility of adding fallback values.
     *
     * For example, with the `display` key, it can be `["block"]` and `["flex", "grid"]`.
     */
    values: string[];
};

/**
 * Style node type.
 *
 * This is used to represent each style expression.
 */
type StyleNode = Format<
    {
        /**
         * Title of the style node.
         *
         * This is used for class name usage.
         */
        title: string;
    } & StyleNodePlan
>;

/**
 * Style type.
 *
 * This carries a list of style nodes.
 */
type Style = {
    /** ID of the style. */
    id: string;
    /** Style nodes. */
    children: StyleNode[];
};

export type { StyleNodePlan, StyleNode, Style };
