const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateComment } = require("../middleware/commentValidator");

// POST /tasks/:taskId/comments - Add Comment (Admin + Manager + Member)
router.post(
    "/tasks/:taskId/comments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    validateComment,
    commentController.createComment
);

// GET /tasks/:taskId/comments - Get Comments (Admin + Manager + Member)
router.get(
    "/tasks/:taskId/comments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    commentController.getComments
);

// PUT /comments/:id - Update Comment (Comment owner + Admin)
router.put(
    "/comments/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    validateComment,
    commentController.updateComment
);

// DELETE /comments/:id - Delete Comment (Comment owner + Admin)
router.delete(
    "/comments/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    commentController.deleteComment
);

module.exports = router;
