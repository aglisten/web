import type { StyleNode } from "##/processor/style/@types";

type KeyframeNode = {
    // "from" | "to" | "0%" | "100%"
    title: string;
    // Style nodes
    children: StyleNode[];
};

type Keyframes = {
    // ID of the keyframes
    id: string;
    // title, (e.g. "fade-in", "fade-out") but hashed
    title: string;
    // Keyframe nodes
    children: KeyframeNode[];
};

export type { KeyframeNode, Keyframes };
