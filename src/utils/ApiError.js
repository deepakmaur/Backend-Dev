// Custom error class that extends the built-in JavaScript Error
class ApiError extends Error {
    constructor(
        statusCode,                   // HTTP status code (e.g., 400, 404, 500)
        message = "Something went wrong", // Default error message if not provided
        errors = [],                  // Optional array of detailed error messages
        stack = ""                    // Optional stack trace (for advanced debugging)
    ) {
        super(message);              // Call the parent Error constructor with the message

        // Add custom properties to the error
        this.statusCode = statusCode; // Store the status code for API response
        this.data = null;             // You can include additional data here if needed
        this.message = message;       // Error message (already handled by Error, but good to be explicit)
        this.success = false;         // Flag to indicate that the operation failed
        this.errors = errors;         // Array to hold specific validation or error details

        // Capture or assign the error stack trace
        if (stack) {
            this.stack = stack; // Use the provided stack trace (useful for rethrowing errors)
        } else {
            // Automatically capture the stack trace from where this error was created
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
