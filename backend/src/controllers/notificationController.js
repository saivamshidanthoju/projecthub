const notificationRepository = require("../repositories/notificationRepository");

const getNotifications = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;

        // Parse query pagination params
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 20;
        if (limit > 100) limit = 100; // Hard limit

        const result = await notificationRepository.getUserNotifications(user_id, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.notifications,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving user notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;

        const count = await notificationRepository.countUnread(user_id, organization_id);

        return res.status(200).json({
            success: true,
            data: { unreadCount: count }
        });
    } catch (error) {
        console.error("Error counting unread notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const notification = await notificationRepository.markAsRead(id, user_id, organization_id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Emit real-time notification read status to the user's specific room
        const io = req.app.get("io");
        if (io) {
            io.to(`user_${user_id}`).emit("notification:read", { notification_id: id });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;

        await notificationRepository.markAllAsRead(user_id, organization_id);

        // Emit real-time read-all status to the user's specific room
        const io = req.app.get("io");
        if (io) {
            io.to(`user_${user_id}`).emit("notification:read", { all: true });
        }

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read."
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const notification = await notificationRepository.deleteNotification(id, user_id, organization_id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
