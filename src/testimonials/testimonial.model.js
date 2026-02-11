import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 5,
        },
        image: {
            type: String, // image path
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
