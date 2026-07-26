const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /dashboard/overview - Admin + Manager
router.get(
    "/overview",
    authenticateToken,
    authorizeRoles(1, 2),
    dashboardController.getOverview
);

// GET /dashboard/projects - Admin + Manager
router.get(
    "/projects",
    authenticateToken,
    authorizeRoles(1, 2),
    dashboardController.getProjects
);

// GET /dashboard/tasks - Admin + Manager
router.get(
    "/tasks",
    authenticateToken,
    authorizeRoles(1, 2),
    dashboardController.getTasks
);

// GET /dashboard/users - Admin only
router.get(
    "/users",
    authenticateToken,
    authorizeRoles(1),
    dashboardController.getUsers
);

// GET /dashboard/activity - Admin + Manager
router.get(
    "/activity",
    authenticateToken,
    authorizeRoles(1, 2),
    dashboardController.getActivity
);

module.exports = router;
