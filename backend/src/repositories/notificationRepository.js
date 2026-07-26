const db = require("../config/db");

const createNotification = async ({
    organization_id,
    user_id,
    title,
    message,
    type,
    reference_type = null,
    reference_id = null
}) => {
    const query = `
        INSERT INTO notifications (
            organization_id,
            user_id,
            title,
            message,
            type,
            reference_type,
            reference_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [organization_id, user_id, title, message, type, reference_type, reference_id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getUserNotifications = async (user_id, organization_id, { page = 1, limit = 20 } = {}) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM notifications
        WHERE user_id = $1 AND organization_id = $2
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4;
    `;
    const result = await db.query(query, [user_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*) FROM notifications
        WHERE user_id = $1 AND organization_id = $2;
    `;
    const countResult = await db.query(countQuery, [user_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        notifications: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const markAsRead = async (notification_id, user_id, organization_id) => {
    const query = `
        UPDATE notifications
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE notification_id = $1 AND user_id = $2 AND organization_id = $3
        RETURNING *;
    `;
    const result = await db.query(query, [notification_id, user_id, organization_id]);
    return result.rows[0];
};

const markAllAsRead = async (user_id, organization_id) => {
    const query = `
        UPDATE notifications
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND organization_id = $2 AND is_read = FALSE
        RETURNING *;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows;
};

const deleteNotification = async (notification_id, user_id, organization_id) => {
    const query = `
        DELETE FROM notifications
        WHERE notification_id = $1 AND user_id = $2 AND organization_id = $3
        RETURNING *;
    `;
    const result = await db.query(query, [notification_id, user_id, organization_id]);
    return result.rows[0];
};

const countUnread = async (user_id, organization_id) => {
    const query = `
        SELECT COUNT(*) FROM notifications
        WHERE user_id = $1 AND organization_id = $2 AND is_read = FALSE;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return parseInt(result.rows[0].count, 10);
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    countUnread
};
