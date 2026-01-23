import type { AtRules, PropertiesFallback, Pseudos } from "csstype";
import type { HtmlElementsAttributesMap } from "html-tag-types";
import type { Format } from "ts-vista";

type HtmlTag = keyof HtmlElementsAttributesMap;

type CSSProperties = PropertiesFallback<string | number>;

type CSSSituation =
    | `&${Pseudos}` // &:hover
    | `&${Pseudos}${string}` // &:not(...)
    | `${AtRules}${string}` // @media
    | `&#${string}` // &#id
    | `&.${string}` // &.class
    | `&[${string}]` // &[data-attr]
    | Pseudos // :hover
    | `${Pseudos}${string}` // :not(...)
    | `#${string}` // #child-id
    | `.${string}` // .child-class
    | `[${string}]` // [child-data-attr]
    | `${string} > ${string}` // parent > child
    | `${string} + ${string}` // sibling + sibling
    | `${string} ~ ${string}` // sibling ~ sibling
    | `${string}::${string}` // selector::after
    | HtmlTag; // HTML element

type CSSObject = CSSProperties & {
    [key in CSSSituation]?: CSSObject;
} & {
    // CSS variable
    [key in `--${string}`]?: string | number | (string | number)[];
};

/** CSS. */
type CSS = Format<CSSObject>;

/** Keyframes. */
type Keyframes = Format<{
    [key in "from" | "to" | `${number}%` | number]?: CSSObject;
}>;

export type { CSS, Keyframes };
