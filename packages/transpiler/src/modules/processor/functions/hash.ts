const OFFSET_BASIS = 2166136261 as const;
const PRIME = 16777619 as const;

const u32ToBase36 = (number: number): string => {
    let num: number = number >>> 0;

    let result: string = "";

    const digits: string = "0123456789abcdefghijklmnopqrstuvwxyz";

    while (num > 0) {
        const remainder: number = num % 36;

        result += digits[remainder];

        num = Math.floor(num / 36);
    }

    if (result.length === 0) result = "0";

    return result.split("").reverse().join("");
};

const fnv1a = (input: string): string => {
    let result: number = OFFSET_BASIS;

    for (let i: number = 0; i < input.length; i++) {
        result ^= input.charCodeAt(i);

        result = Math.imul(result, PRIME) >>> 0;
    }

    return u32ToBase36(result);
};

const fixedFnv1a = (input: string, length: number): string => {
    const hashed: string = fnv1a(input);

    if (hashed.length < length) {
        return hashed + "0".repeat(length - hashed.length);
    }

    const startLen: number = Math.floor(length / 3);

    const endLen: number = Math.floor(length / 3);

    const centerLen: number = length - startLen - endLen;

    const start: string = hashed.slice(0, startLen);

    const end: string = hashed.slice(hashed.length - endLen);

    const centerStart: number = Math.floor((hashed.length - centerLen) / 2);

    const center: string = hashed.slice(centerStart, centerStart + centerLen);

    return `${start}${center}${end}`;
};

export { fixedFnv1a };
