const { body, validationResult } = require("express-validator");

const validateCreateTask = [
    body("project_id")
        .notEmpty()
        .withMessage("Project ID is required.")
        .isInt()
        .withMessage("Project ID must be an integer."),
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters."),
    body("priority")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        .withMessage("Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL"),
    body("status")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
        .withMessage("Invalid status. Allowed values: TODO, IN_PROGRESS, IN_REVIEW, DONE"),
    body("assigned_to")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Assigned user ID must be an integer."),
    body("due_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date."),
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

const validateUpdateTask = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty.")
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters."),
    body("priority")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        .withMessage("Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL"),
    body("status")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
        .withMessage("Invalid status. Allowed values: TODO, IN_PROGRESS, IN_REVIEW, DONE"),
    body("assigned_to")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Assigned user ID must be an integer."),
    body("due_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date."),
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
    validateCreateTask,
    validateUpdateTask
};
