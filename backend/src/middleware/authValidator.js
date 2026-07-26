const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
};

const validateRegister = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Must be a valid email address.")
        .normalizeEmail(),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("first_name")
        .trim()
        .notEmpty().withMessage("First name is required.")
        .isLength({ max: 50 }).withMessage("First name cannot exceed 50 characters."),
    body("last_name")
        .trim()
        .notEmpty().withMessage("Last name is required.")
        .isLength({ max: 50 }).withMessage("Last name cannot exceed 50 characters."),
    body("organization_id")
        .notEmpty().withMessage("Organization ID is required.")
        .isInt().withMessage("Organization ID must be an integer."),
    body("role_id")
        .optional()
        .isInt().withMessage("Role ID must be an integer."),
    handleValidationErrors
];

const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Must be a valid email address.")
        .normalizeEmail(),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required."),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin
};
