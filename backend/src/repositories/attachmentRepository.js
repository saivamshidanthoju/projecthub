const db = require("../config/db");

const createAttachment = async ({
    organization_id,
    project_id = null,
    task_id = null,
    comment_id = null,
    uploaded_by,
    original_name,
    stored_name,
    mime_type,
    file_size,
    storage_path
}) => {
    const query = `
        INSERT INTO attachments (
            organization_id,
            project_id,
            task_id,
            comment_id,
            uploaded_by,
            original_name,
            stored_name,
            mime_type,
            file_size,
            storage_path
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    const values = [
        organization_id,
        project_id,
        task_id,
        comment_id,
        uploaded_by,
        original_name,
        stored_name,
        mime_type,
        file_size,
        storage_path
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const getAttachment = async (attachment_id, organization_id) => {
    const query = `
        SELECT * FROM attachments
        WHERE attachment_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;
    const result = await db.query(query, [attachment_id, organization_id]);
    return result.rows[0];
};

const getAttachmentsByTask = async (task_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT a.*, u.first_name, u.last_name
        FROM attachments a
        LEFT JOIN users u ON a.uploaded_by = u.user_id
        WHERE a.task_id = $1 AND a.organization_id = $2 AND a.is_deleted = FALSE
        ORDER BY a.created_at DESC
        LIMIT $3 OFFSET $4;
    `;
    const result = await db.query(query, [task_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*) FROM attachments
        WHERE task_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;
    const countResult = await db.query(countQuery, [task_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        attachments: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getAttachmentsByProject = async (project_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT a.*, u.first_name, u.last_name
        FROM attachments a
        LEFT JOIN users u ON a.uploaded_by = u.user_id
        WHERE a.project_id = $1 AND a.organization_id = $2 AND a.is_deleted = FALSE
        ORDER BY a.created_at DESC
        LIMIT $3 OFFSET $4;
    `;
    const result = await db.query(query, [project_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*) FROM attachments
        WHERE project_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;
    const countResult = await db.query(countQuery, [project_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        attachments: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getAttachmentsByComment = async (comment_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT a.*, u.first_name, u.last_name
        FROM attachments a
        LEFT JOIN users u ON a.uploaded_by = u.user_id
        WHERE a.comment_id = $1 AND a.organization_id = $2 AND a.is_deleted = FALSE
        ORDER BY a.created_at DESC
        LIMIT $3 OFFSET $4;
    `;
    const result = await db.query(query, [comment_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*) FROM attachments
        WHERE comment_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;
    const countResult = await db.query(countQuery, [comment_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        attachments: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const deleteAttachment = async (attachment_id, organization_id) => {
    const query = `
        UPDATE attachments
        SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
        WHERE attachment_id = $1 AND organization_id = $2 AND is_deleted = FALSE
        RETURNING *;
    `;
    const result = await db.query(query, [attachment_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    createAttachment,
    getAttachment,
    getAttachmentsByTask,
    getAttachmentsByProject,
    getAttachmentsByComment,
    deleteAttachment
};
