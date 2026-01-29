/**
 * JavaScript File filter.
 *
 * Include: *.js | *.cjs | *.mjs | *.ts | *.cts | *.mts | *.jsx | *.tsx
 */
const FILTER_JS: RegExp = /.*\.(js|cjs|mjs|ts|cts|mts|jsx|tsx)(\?.*)?(#.*)?$/;

/**
 * Advanced JavaScript file filter.
 *
 * Include: *.js | *.cjs | *.mjs | *.ts | *.cts | *.mts | *.jsx | *.tsx
 *
 * Exclude: *.d.ts
 */
const FILTER_JS_ADVANCED: RegExp =
    /^(?!.*\.d\.ts$).*\.(js|cjs|mjs|ts|cts|mts|jsx|tsx)(\?.*)?(#.*)?$/;

/**
 * CSS File filter.
 *
 * Include: *.css | *.sass | *.scss | *.less
 */
const FILTER_CSS: RegExp = /.*\.(css|sass|scss|less)(\?.*)?(#.*)?$/;

export { FILTER_JS, FILTER_JS_ADVANCED, FILTER_CSS };
