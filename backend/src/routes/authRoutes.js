const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRegister, validateLogin } = require("../middleware/authValidator");

// Public Routes with Input Validation
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

// Protected Route
router.get(
    "/me",
    authenticateToken,
    authController.getCurrentUser
);  

// Admin Only Route
router.get(
    "/admin",
    authenticateToken,
    authorizeRoles(1),
    authController.adminTestEndpoint
);

module.exports = router;