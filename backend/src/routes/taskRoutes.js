const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateCreateTask, validateUpdateTask } = require("../middleware/taskValidator");

// POST /tasks - Create Task (Admin + Manager)
router.post(
    "/",
    authenticateToken,
    authorizeRoles(1, 2),
    validateCreateTask,
    taskController.createTask
);

// GET /tasks - Get Tasks (Admin + Manager + Member)
router.get(
    "/",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    taskController.getTasks
);

// GET /tasks/:id - Get Task by ID (Admin + Manager + Member)
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    taskController.getTask
);

// PUT /tasks/:id - Update Task (Admin + Manager)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles(1, 2),
    validateUpdateTask,
    taskController.updateTask
);

// DELETE /tasks/:id - Delete Task (Admin only)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles(1),
    taskController.deleteTask
);

module.exports = router;
