const db = require("../config/db");

const logActivity = async ({
    organization_id,
    project_id,
    task_id = null,
    user_id,
    action,
    entity_type,
    entity_id,
    old_value = null,
    new_value = null
}, client = null) => {
    const query = `
        INSERT INTO activity_logs (
            organization_id,
            project_id,
            task_id,
            user_id,
            action,
            entity_type,
            entity_id,
            old_value,
            new_value
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;

    const values = [
        organization_id,
        project_id,
        task_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_value ? JSON.stringify(old_value) : null,
        new_value ? JSON.stringify(new_value) : null
    ];

    const queryRunner = client || db;
    const result = await queryRunner.query(query, values);
    return result.rows[0];
};

const getProjectActivity = async (project_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;

    const query = `
        SELECT a.*, u.first_name, u.last_name, u.email
        FROM activity_logs a
        LEFT JOIN users u ON a.user_id = u.user_id
        WHERE a.project_id = $1 AND a.organization_id = $2
        ORDER BY a.created_at DESC
        LIMIT $3 OFFSET $4;
    `;

    const result = await db.query(query, [project_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*)
        FROM activity_logs
        WHERE project_id = $1 AND organization_id = $2;
    `;

    const countResult = await db.query(countQuery, [project_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        activities: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getTaskActivity = async (task_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;

    const query = `
        SELECT a.*, u.first_name, u.last_name, u.email
        FROM activity_logs a
        LEFT JOIN users u ON a.user_id = u.user_id
        WHERE a.task_id = $1 AND a.organization_id = $2
        ORDER BY a.created_at DESC
        LIMIT $3 OFFSET $4;
    `;

    const result = await db.query(query, [task_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*)
        FROM activity_logs
        WHERE task_id = $1 AND organization_id = $2;
    `;

    const countResult = await db.query(countQuery, [task_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        activities: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

module.exports = {
    logActivity,
    getProjectActivity,
    getTaskActivity
};
