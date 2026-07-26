const db = require("../config/db");

const createTask = async ({
    project_id,
    organization_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date
}, client = null) => {
    const query = `
        INSERT INTO tasks (
            project_id,
            organization_id,
            title,
            description,
            status,
            priority,
            assigned_to,
            created_by,
            due_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;

    const values = [
        project_id,
        organization_id,
        title,
        description,
        status || 'TODO',
        priority || 'MEDIUM',
        assigned_to,
        created_by,
        due_date
    ];

    const queryRunner = client || db;
    const result = await queryRunner.query(query, values);
    return result.rows[0];
};

const getTasks = async (organization_id, {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    priority = "",
    project_id = "",
    assigned_to = "",
    sort = "created_at"
}) => {
    const offset = (page - 1) * limit;
    let baseQuery = `
        SELECT * FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE
    `;
    const values = [organization_id];
    let paramIndex = 2;

    if (search) {
        baseQuery += ` AND title ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        baseQuery += ` AND status = $${paramIndex}`;
        values.push(status);
        paramIndex++;
    }

    if (priority) {
        baseQuery += ` AND priority = $${paramIndex}`;
        values.push(priority);
        paramIndex++;
    }

    if (project_id) {
        baseQuery += ` AND project_id = $${paramIndex}`;
        values.push(project_id);
        paramIndex++;
    }

    if (assigned_to) {
        baseQuery += ` AND assigned_to = $${paramIndex}`;
        values.push(assigned_to);
        paramIndex++;
    }

    // Sorting fields validation (prevent SQL injection)
    const allowedSortFields = ["created_at", "due_date", "priority", "title"];
    const sortField = allowedSortFields.includes(sort) ? sort : "created_at";

    baseQuery += ` ORDER BY ${sortField} DESC`;
    baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await db.query(baseQuery, values);

    // Get count for pagination metadata
    let countQuery = `
        SELECT COUNT(*) FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE
    `;
    const countValues = [organization_id];
    let countParamIndex = 2;

    if (search) {
        countQuery += ` AND title ILIKE $${countParamIndex}`;
        countValues.push(`%${search}%`);
        countParamIndex++;
    }

    if (status) {
        countQuery += ` AND status = $${countParamIndex}`;
        countValues.push(status);
        countParamIndex++;
    }

    if (priority) {
        countQuery += ` AND priority = $${countParamIndex}`;
        countValues.push(priority);
        countParamIndex++;
    }

    if (project_id) {
        countQuery += ` AND project_id = $${countParamIndex}`;
        countValues.push(project_id);
        countParamIndex++;
    }

    if (assigned_to) {
        countQuery += ` AND assigned_to = $${countParamIndex}`;
        countValues.push(assigned_to);
    }

    const countResult = await db.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        tasks: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getTaskById = async (task_id, organization_id) => {
    const query = `
        SELECT *
        FROM tasks
        WHERE task_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;

    const result = await db.query(query, [task_id, organization_id]);
    return result.rows[0];
};

const updateTask = async (task_id, organization_id, {
    title,
    description,
    status,
    priority,
    assigned_to,
    due_date
}) => {
    const query = `
        UPDATE tasks
        SET
            title = $1,
            description = $2,
            status = $3,
            priority = $4,
            assigned_to = $5,
            due_date = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE task_id = $7 AND organization_id = $8 AND is_deleted = FALSE
        RETURNING *;
    `;

    const values = [
        title,
        description,
        status,
        priority,
        assigned_to,
        due_date,
        task_id,
        organization_id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteTask = async (task_id, organization_id) => {
    const query = `
        UPDATE tasks
        SET
            is_deleted = TRUE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE task_id = $1 AND organization_id = $2 AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [task_id, organization_id]);
    return result.rows[0];
};

const getTasksByProject = async (project_id, organization_id, { page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;

    const query = `
        SELECT *
        FROM tasks
        WHERE project_id = $1 AND organization_id = $2 AND is_deleted = FALSE
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4;
    `;

    const result = await db.query(query, [project_id, organization_id, limit, offset]);

    const countQuery = `
        SELECT COUNT(*)
        FROM tasks
        WHERE project_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;

    const countResult = await db.query(countQuery, [project_id, organization_id]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        tasks: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByProject
};
