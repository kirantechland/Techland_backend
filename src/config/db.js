import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ CRITICAL: MONGO_URI is not set in environment variables.");
            process.exit(1);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected! Attempting to reconnect...");
        });

        return conn;
    } catch (error) {
        console.error(`❌ Database Connection Failed: ${error.message}`);

        // In production, we should probably exit if the DB is required
        if (process.env.NODE_ENV === "production") {
            console.error("Shutting down server due to fatal database connection error.");
            process.exit(1);
        }

        console.warn("⚠️ Continuing in development mode without DB. Most features will fail.");
    }
};

export default connectDB;
