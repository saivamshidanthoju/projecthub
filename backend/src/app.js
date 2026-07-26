const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const logger = require("./config/logger");
const routes = require("./routes");
const healthRoutes = require("./routes/healthRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const xssSanitizer = require("./middleware/xssMiddleware");
const rateLimit = require("./middleware/rateLimitMiddleware");
const contextMiddleware = require("./middleware/contextMiddleware");
const metricsMiddleware = require("./middleware/metricsMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Enable Trust Proxy for rate limiters to read client IP
app.set("trust proxy", 1);

// Standard Security & Optimizations
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(compression());
app.use(express.json());

// 1. Mount Context Middleware globally first
app.use(contextMiddleware);

// 2. Mount Metrics Middleware globally next
app.use(metricsMiddleware);

// Apply HTTP logger configured with Winston stream
app.use(morgan("combined", { stream: logger.accessStream }));

// Input XSS filter
app.use(xssSanitizer);

// Rate Limiters Configuration
const defaultLimiter = rateLimit(100, 15 * 60 * 1000); // 100 req per 15 mins
const authLimiter = rateLimit(20, 15 * 60 * 1000);    // 20 req per 15 mins (Login / Register)
const uploadLimiter = rateLimit(30, 15 * 60 * 1000);  // 30 req per 15 mins (Uploads)

// Apply Global Rate Limiting
app.use(defaultLimiter);

// Health Endpoint (Mount outside rate limiter for monitoring queries)
app.use("/", healthRoutes);

// Prometheus scraper endpoint
app.use("/", metricsRoutes);

// Apply strict rate limits to auth, uploads and notifications
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/projects/:id/attachments", uploadLimiter);
app.use("/api/tasks/:id/attachments", uploadLimiter);
app.use("/api/comments/:id/attachments", uploadLimiter);

// Main Application Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;