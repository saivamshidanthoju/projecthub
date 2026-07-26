const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || req.user.role_id === undefined || req.user.role_id === null) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        next();
    };
};

module.exports = {
    authorizeRoles
};
