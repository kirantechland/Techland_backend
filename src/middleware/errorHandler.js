/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging (in production, use a proper logging service)
    console.error("Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    // Default error status and message
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";

    // Don't leak sensitive error details in production
    const response = {
        success: false,
        message: process.env.NODE_ENV === "production" && statusCode === 500
            ? "An unexpected error occurred. Please try again later."
            : message,
    };

    // Include error details in development mode
    if (process.env.NODE_ENV === "development") {
        response.error = {
            message: err.message,
            stack: err.stack,
            ...(err.errors && { validationErrors: err.errors }),
        };
    }

    res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Catches requests to non-existent routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Custom error classes
 */
export class ValidationError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
        this.errors = errors;
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized access") {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Access forbidden") {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

export class ConflictError extends Error {
    constructor(message = "Resource already exists") {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
    }
}
