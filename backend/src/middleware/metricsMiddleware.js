const metrics = require("../utils/metrics");

const metricsMiddleware = (req, res, next) => {
    const startTime = process.hrtime();

    // Hook response completion events to update metrics
    res.on("finish", () => {
        const diff = process.hrtime(startTime);
        const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6);

        // Normalize path route strings (e.g. remove ID parameters values)
        let route = req.baseUrl + (req.route ? req.route.path : req.path);
        if (!route) route = "/unknown";

        const method = req.method;
        const status = res.statusCode;

        // Record request metrics
        metrics.incrementRequest(method, route, status);
        metrics.recordDuration(method, route, durationMs);

        // Record metrics if response was a client/server error
        if (status >= 400) {
            metrics.incrementError(method, route, status);
        }
    });

    next();
};

module.exports = metricsMiddleware;
