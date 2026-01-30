class TranspileError extends Error {
    override name: string = "TranspileError";

    constructor(function_name: string) {
        let message: string = `Something went wrong when transpiling the ${function_name} function,\n`;
        message += "please check if the configuration is correct.\n";

        super(message);

        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, TranspileError);
        }
    }
}

export { TranspileError };
