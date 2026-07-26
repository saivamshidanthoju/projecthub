const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected Route
router.get(
    "/me",
    authenticateToken,
    authController.getCurrentUser
);

module.exports = router;