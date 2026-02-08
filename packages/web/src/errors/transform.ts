class TransformError extends Error {
    override name: string = TransformError.name;

    constructor(functionName: string) {
        let message: string = "";

        message += `The function "${functionName}" must be transformed at compile time, `;
        message += `but the compiler did not perform this transformation. `;
        message += `Please check if the configuration is correct, `;
        message += `or open an issue on GitHub if you believe this is a bug.`;

        super(message);

        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, TransformError);
        }
    }
}

export { TransformError };
