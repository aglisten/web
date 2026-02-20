import { style } from "ammolite";

import { colors } from "./styles/color";
import { sizes } from "./styles/size";

const abc: string = style({
    backgroundColor: colors.bg,
    color: colors.font,
    fontSize: sizes.m,
});

export { abc, colors, sizes };
