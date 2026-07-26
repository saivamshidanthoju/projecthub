const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const contextStorage = require("../utils/context");

const LOGS_DIR = path.join(__dirname, "../../logs");

// Custom log formatter combining JSON output with async request context properties
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const context = contextStorage.getStore() || {};
        
        const logData = {
            timestamp,
            level,
            message,
            requestId: context.requestId || null,
            userId: context.userId || null,
            organizationId: context.organizationId || null,
            ...meta
        };

        if (stack) logData.stack = stack;

        return JSON.stringify(logData);
    })
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        // Daily rotation for application errors
        new DailyRotateFile({
            filename: path.join(LOGS_DIR, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            level: "error"
        }),
        // Daily rotation for all application events
        new DailyRotateFile({
            filename: path.join(LOGS_DIR, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d"
        })
    ]
});

// If not in production, log to console with simple layout format
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Separate stream for HTTP access logging via Morgan
logger.accessStream = {
    write: (message) => {
        logger.info(message.trim(), { logType: "access" });
    }
};

module.exports = logger;
