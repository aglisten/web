import { variables } from "@aglisten/web";

const colors = variables({
    blue: "#007acc",
});

type Colors = typeof colors;

export type { Colors };
export { colors };
