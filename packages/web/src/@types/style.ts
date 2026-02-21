import type { AtRules, PropertiesFallback, Pseudos } from "csstype";
import type { HtmlElementsAttributesMap } from "html-tag-types";
import type { Format } from "ts-vista";

type CSSValue = string | number;

type CSSProperties = PropertiesFallback<CSSValue>;

type HtmlTag = keyof HtmlElementsAttributesMap;

type CSSSelector =
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

type CSSNested = {
    [key in CSSSelector]?: CSSObject;
};

type CSSVariables = {
    [K in `--${string}`]?: CSSValue | CSSValue[];
};

type CSSObject = CSSProperties & CSSNested & CSSVariables;

/** CSS. */
type CSS = Format<CSSObject>;

/** Keyframes. */
type Keyframes = {
    [key in "from" | "to" | `${number}%` | number]?: CSSObject;
};

export type { CSS, Keyframes };
