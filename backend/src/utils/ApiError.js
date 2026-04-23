class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    )
    {
        super(message); // overwrite message in the super class
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.data = null;
        this.errors = errors;

        if(stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};