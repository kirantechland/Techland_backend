import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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



const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Required for Render and other reverse proxies
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Essential for serving images from the same server
}));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {

    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost (development)
    if (origin.includes("localhost")) {
      return callback(null, true);
    }

    // Allow Hostinger domains
    if (origin.includes("hostingersite.com")) {
      return callback(null, true);
    }

    // Allow Vercel deployments
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // Allow Render deployments
    if (origin.includes("onrender.com")) {
      return callback(null, true);
    }

    // Allow Main domains
    if (origin.includes("techlanditsolutions.com")) {
      return callback(null, true);
    }

    console.log("🚫 CORS Blocked:", origin);
    callback(new Error("Not allowed by CORS"));
  },
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

// Favicon (avoid 404s in logs)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

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

// Unified startup function
const startServer = async () => {
  try {
    // 1. Connect to Database FIRST
    await connectDB();

    // 2. Start Listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
