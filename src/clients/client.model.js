import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        logo: {
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

export default mongoose.model("Client", clientSchema);
