import Joi from "joi";

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        next();
    };
};

// Project validation schemas
export const projectSchemas = {
    create: Joi.object({
        title: Joi.string().required().min(3).max(100).trim()
            .messages({
                "string.empty": "Title is required",
                "string.min": "Title must be at least 3 characters long",
                "string.max": "Title cannot exceed 100 characters",
            }),
        category: Joi.string().required().trim()
            .messages({
                "string.empty": "Category is required",
            }),
        client: Joi.string().required().trim()
            .messages({
                "string.empty": "Client is required",
            }),
        status: Joi.string().required().trim()
            .messages({
                "string.empty": "Status is required",
            }),
    }),
    updateStatus: Joi.object({
        status: Joi.string().required().trim()
            .messages({
                "string.empty": "Status is required",
            }),
    }),
};

// Team member validation schemas
export const teamSchemas = {
    create: Joi.object({
        name: Joi.string().required().min(2).max(100).trim()
            .messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 2 characters long",
                "string.max": "Name cannot exceed 100 characters",
            }),
        role: Joi.string().required().trim()
            .messages({
                "string.empty": "Role is required",
            }),
        bio: Joi.string().allow("").max(500).trim()
            .messages({
                "string.max": "Bio cannot exceed 500 characters",
            }),
    }),
};

// Activity validation schemas
export const activitySchemas = {
    create: Joi.object({
        title: Joi.string().required().min(3).max(100).trim()
            .messages({
                "string.empty": "Title is required",
                "string.min": "Title must be at least 3 characters long",
                "string.max": "Title cannot exceed 100 characters",
            }),
        description: Joi.string().allow("").max(1000).trim()
            .messages({
                "string.max": "Description cannot exceed 1000 characters",
            }),
        date: Joi.date().iso()
            .messages({
                "date.base": "Invalid date format",
            }),
    }),
};

// Client validation schemas
export const clientSchemas = {
    create: Joi.object({
        name: Joi.string().required().min(2).max(100).trim()
            .messages({
                "string.empty": "Client name is required",
                "string.min": "Client name must be at least 2 characters long",
                "string.max": "Client name cannot exceed 100 characters",
            }),
        logo: Joi.string().allow("").trim(),
    }),
};

// Contact form validation schema
export const contactSchemas = {
    create: Joi.object({
        name: Joi.string().required().min(2).max(100).trim()
            .messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 2 characters long",
                "string.max": "Name cannot exceed 100 characters",
            }),
        email: Joi.string().required().email().trim().lowercase()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Please provide a valid email address",
            }),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).allow("")
            .messages({
                "string.pattern.base": "Phone number must be 10-15 digits",
            }),
        subject: Joi.string().required().min(3).max(200).trim()
            .messages({
                "string.empty": "Subject is required",
                "string.min": "Subject must be at least 3 characters long",
                "string.max": "Subject cannot exceed 200 characters",
            }),
        message: Joi.string().required().min(10).max(2000).trim()
            .messages({
                "string.empty": "Message is required",
                "string.min": "Message must be at least 10 characters long",
                "string.max": "Message cannot exceed 2000 characters",
            }),
    }),
};

// MongoDB ObjectId validation
export const idSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.pattern.base": "Invalid ID format",
        }),
});
