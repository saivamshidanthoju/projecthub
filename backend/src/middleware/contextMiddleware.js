const crypto = require("crypto");
const contextStorage = require("../utils/context");

const generateRequestId = () => {
    return crypto.randomBytes(8).toString("hex");
};

const contextMiddleware = (req, res, next) => {
    // Read or generate correlation request ID
    const requestId = req.headers["x-request-id"] || generateRequestId();
    
    // Create execution context state
    const context = {
        requestId,
        userId: req.user?.user_id || null,
        organizationId: req.user?.organization_id || null
    };

    res.setHeader("X-Request-ID", requestId);

    // Run context store block wrapping execution threads
    contextStorage.run(context, () => {
        next();
    });
};

module.exports = contextMiddleware;
