import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Limits each IP to 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for contact form submissions
 * Limits each IP to 5 submissions per hour to prevent spam
 */
export const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: {
        success: false,
        message: "Too many contact form submissions. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests, even successful ones
});

/**
 * Moderate rate limiter for file uploads
 * Limits each IP to 20 uploads per hour
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 uploads per hour
    message: {
        success: false,
        message: "Too many upload requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Very strict rate limiter for authentication endpoints
 * Limits each IP to 10 attempts per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});
