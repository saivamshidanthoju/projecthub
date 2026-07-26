const db = require("../config/db");

const createComment = async ({
    task_id,
    organization_id,
    user_id,
    comment
}, client = null) => {
    const query = `
        INSERT INTO comments (
            task_id,
            organization_id,
            user_id,
            comment
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [task_id, organization_id, user_id, comment];
    const queryRunner = client || db;
    const result = await queryRunner.query(query, values);
    return result.rows[0];
};

const getCommentsByTask = async (task_id, organization_id, {
    page = 1,
    limit = 10,
    search = ""
}) => {
    const offset = (page - 1) * limit;
    let baseQuery = `
        SELECT c.*, u.first_name, u.last_name, u.email
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.task_id = $1 AND c.organization_id = $2 AND c.is_deleted = FALSE
    `;
    const values = [task_id, organization_id];
    let paramIndex = 3;

    if (search) {
        baseQuery += ` AND c.comment ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    baseQuery += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await db.query(baseQuery, values);

    // Get total items for metadata count
    let countQuery = `
        SELECT COUNT(*) FROM comments
        WHERE task_id = $1 AND organization_id = $2 AND is_deleted = FALSE
    `;
    const countValues = [task_id, organization_id];
    let countParamIndex = 3;

    if (search) {
        countQuery += ` AND comment ILIKE $${countParamIndex}`;
        countValues.push(`%${search}%`);
    }

    const countResult = await db.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        comments: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getCommentById = async (comment_id, organization_id) => {
    const query = `
        SELECT *
        FROM comments
        WHERE comment_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;

    const result = await db.query(query, [comment_id, organization_id]);
    return result.rows[0];
};

const updateComment = async (comment_id, organization_id, comment) => {
    const query = `
        UPDATE comments
        SET
            comment = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE comment_id = $2 AND organization_id = $3 AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [comment, comment_id, organization_id]);
    return result.rows[0];
};

const deleteComment = async (comment_id, organization_id) => {
    const query = `
        UPDATE comments
        SET
            is_deleted = TRUE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE comment_id = $1 AND organization_id = $2 AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [comment_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    createComment,
    getCommentsByTask,
    getCommentById,
    updateComment,
    deleteComment
};
