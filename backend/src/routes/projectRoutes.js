const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateProject } = require("../middleware/projectValidator");

// POST /projects - Create Project (Admin + Manager only)
router.post(
    "/",
    authenticateToken,
    authorizeRoles(1, 2),
    validateProject,
    projectController.createProject
);

// GET /projects - Get Projects (Admin + Manager + Member)
router.get(
    "/",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    projectController.getProjects
);

// GET /projects/:id - Get Project by ID (Admin + Manager + Member)
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    projectController.getProject
);

// GET /projects/:projectId/tasks - Get tasks by Project ID (Admin + Manager + Member)
router.get(
    "/:projectId/tasks",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    taskController.getTasksByProject
);

// PUT /projects/:id - Update Project (Admin + Manager only)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles(1, 2),
    validateProject,
    projectController.updateProject
);

// DELETE /projects/:id - Delete Project (Admin only)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles(1),
    projectController.deleteProject
);

module.exports = router;
