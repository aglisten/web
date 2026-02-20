import { style } from "ammolite";

const container: string = style({
    display: "block",
    padding: "24px",
    border: "1px solid #000",
});

const subContainer: string = style({
    display: "block",
    padding: "12px",
    border: "1px solid #000",
});

const title: string = style({
    fontSize: "32px",
    color: "#000",
    fontWeight: "bold",
});

const subTitle: string = style({
    fontSize: "24px",
    color: "#000",
});

const text: string = style({
    fontSize: "16px",
    color: "#000",
});

const subText: string = style({
    fontSize: "16px",
    color: "#999",
});

const link: string = style({
    fontSize: "16px",
    color: "#007acc",
});

const button: string = style({
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#3496db",
});

const input: string = style({
    fontSize: "16px",
    color: "#000",
});

const select: string = style({
    fontSize: "16px",
    color: "#000",
});

export {
    container,
    subContainer,
    title,
    subTitle,
    text,
    subText,
    link,
    button,
    input,
    select,
};
