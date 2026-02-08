const isEnglishLetter = (char?: string): char is string => {
    if (!char) return false;

    return /^[A-Za-z]/.test(char);
};

export { isEnglishLetter };
