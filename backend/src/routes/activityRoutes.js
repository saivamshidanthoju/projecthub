const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /projects/:projectId/activity - Read Project Activity Timeline (Admin + Manager + Member)
router.get(
    "/projects/:projectId/activity",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    activityController.getProjectActivity
);

// GET /tasks/:taskId/activity - Read Task Activity Timeline (Admin + Manager + Member)
router.get(
    "/tasks/:taskId/activity",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    activityController.getTaskActivity
);

module.exports = router;
