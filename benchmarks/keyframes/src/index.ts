import { keyframes } from "ammolite";

const fadeIn: string = keyframes({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
});

const fadeOut: string = keyframes({
    from: {
        opacity: 1,
    },
    to: {
        opacity: 0,
    },
});

const scale: string = keyframes({
    from: {
        transform: "scale(1)",
    },
    to: {
        transform: "scale(2)",
    },
});

const scaleX: string = keyframes({
    from: {
        transform: "scaleX(1)",
    },
    to: {
        transform: "scaleX(2)",
    },
});

const scaleY: string = keyframes({
    from: {
        transform: "scaleY(1)",
    },
    to: {
        transform: "scaleY(2)",
    },
});

const scaleZ: string = keyframes({
    from: {
        transform: "scaleZ(1)",
    },
    to: {
        transform: "scaleZ(2)",
    },
});

const translate: string = keyframes({
    from: {
        transform: "translate(0px, 0px)",
    },
    to: {
        transform: "translate(100px, 100px)",
    },
});

const translateX: string = keyframes({
    from: {
        transform: "translateX(0px)",
    },
    to: {
        transform: "translateX(100px)",
    },
});

const translateY: string = keyframes({
    from: {
        transform: "translateY(0px)",
    },
    to: {
        transform: "translateY(100px)",
    },
});

const translateZ: string = keyframes({
    from: {
        transform: "translateZ(0px)",
    },
    to: {
        transform: "translateZ(100px)",
    },
});

export {
    fadeIn,
    fadeOut,
    scale,
    scaleX,
    scaleY,
    scaleZ,
    translate,
    translateX,
    translateY,
    translateZ,
};
