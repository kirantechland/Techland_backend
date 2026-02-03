import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import routes from "./routes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Essential for serving images from the same server
}));
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Serving static files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      readyState: mongoose.connection.readyState,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
  };

  res.status(200).json(healthStatus);
});

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "TechLand API is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
