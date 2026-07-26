const { body, validationResult } = require("express-validator");

const validateProject = [
    body("project_name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required.")
        .isLength({ max: 100 })
        .withMessage("Project name cannot exceed 100 characters."),
    body("description")
        .optional()
        .trim(),
    body("status")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(["ACTIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"])
        .withMessage("Invalid status value. Allowed values: ACTIVE, IN_PROGRESS, COMPLETED, ARCHIVED"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }
        next();
    }
];

module.exports = {
    validateProject
};
