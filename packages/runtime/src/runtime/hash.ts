import { createHash } from "node:crypto";

const getMD5 = (code: string): string => {
    return createHash("md5").update(code).digest("hex");
};

export { getMD5 };
