const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/authMiddleware");

// GET /notifications - Get list
router.get("/", authenticateToken, notificationController.getNotifications);

// GET /notifications/unread-count - Get unread count
router.get("/unread-count", authenticateToken, notificationController.getUnreadCount);

// PUT /notifications/:id/read - Mark single as read
router.put("/:id/read", authenticateToken, notificationController.markAsRead);

// PUT /notifications/read-all - Mark all as read
router.put("/read-all", authenticateToken, notificationController.markAllAsRead);

// DELETE /notifications/:id - Delete single notification
router.delete("/:id", authenticateToken, notificationController.deleteNotification);

module.exports = router;
