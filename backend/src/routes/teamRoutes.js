const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Protected Team Routes
router.get("/", authenticateToken, authorizeRoles(1, 2, 3), teamController.getTeam);
router.post("/", authenticateToken, authorizeRoles(1, 2), teamController.createMember);
router.put("/:id", authenticateToken, authorizeRoles(1, 2), teamController.updateMember);
router.delete("/:id", authenticateToken, authorizeRoles(1), teamController.deleteMember);

module.exports = router;
