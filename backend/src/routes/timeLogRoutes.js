const express = require("express");
const router = express.Router();
const timeLogController = require("../controllers/timeLogController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/logs", authenticateToken, authorizeRoles(1, 2, 3), timeLogController.getLogs);
router.post("/logs", authenticateToken, authorizeRoles(1, 2, 3), timeLogController.createLog);
router.put("/logs/:id", authenticateToken, authorizeRoles(1, 2, 3), timeLogController.updateLog);
router.delete("/logs/:id", authenticateToken, authorizeRoles(1, 2, 3), timeLogController.deleteLog);

module.exports = router;
