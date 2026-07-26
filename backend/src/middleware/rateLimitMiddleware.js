const ipRequests = new Map();

const rateLimit = (limit = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        // Bypass rate limiting in development/local environments for seamless testing
        if (process.env.NODE_ENV !== "production") {
            return next();
        }

        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!ipRequests.has(ip)) {
            ipRequests.set(ip, []);
        }

        // Clean out timestamps older than the window limit
        const timestamps = ipRequests.get(ip).filter(time => now - time < windowMs);
        
        if (timestamps.length >= limit) {
            return res.status(429).json({
                success: false,
                message: "Too many requests from this IP, please try again later."
            });
        }

        timestamps.push(now);
        ipRequests.set(ip, timestamps);
        next();
    };
};

module.exports = rateLimit;
