const { body, validationResult } = require("express-validator");

const validateComment = [
    body("comment")
        .trim()
        .notEmpty()
        .withMessage("Comment text is required."),
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
    validateComment
};
