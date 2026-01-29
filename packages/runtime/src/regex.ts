/**
 * JavaScript File filter.
 *
 * Include: *.js | *.cjs | *.mjs | *.ts | *.cts | *.mts | *.jsx | *.tsx
 */
const JS_FILTER: RegExp = /.*\.(js|cjs|mjs|ts|cts|mts|jsx|tsx)(\?.*)?(#.*)?$/;

/**
 * Advanced JavaScript file filter.
 *
 * Include: *.js | *.cjs | *.mjs | *.ts | *.cts | *.mts | *.jsx | *.tsx
 *
 * Exclude: *.d.ts
 */
const JS_FILTER_ADVANCED: RegExp =
    /^(?!.*\.d\.ts$).*\.(js|cjs|mjs|ts|cts|mts|jsx|tsx)(\?.*)?(#.*)?$/;

/**
 * CSS File filter.
 *
 * Include: *.css | *.sass | *.scss | *.less
 */
const CSS_FILTER: RegExp = /.*\.(css|sass|scss|less)(\?.*)?(#.*)?$/;

export { JS_FILTER, JS_FILTER_ADVANCED, CSS_FILTER };
