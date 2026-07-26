const db = require("../config/db");

const createProject = async ({
    organization_id,
    project_name,
    department,
    description,
    status,
    created_by
}) => {
    const query = `
        INSERT INTO projects (
            organization_id,
            project_name,
            department,
            description,
            status,
            created_by,
            updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $6)
        RETURNING *;
    `;

    const values = [
        organization_id,
        project_name,
        department || 'General Operations',
        description,
        status || 'ACTIVE',
        created_by
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const findActiveByNameInOrg = async (project_name, organization_id) => {
    const query = `
        SELECT *
        FROM projects
        WHERE project_name = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;

    const result = await db.query(query, [project_name, organization_id]);
    return result.rows[0];
};

const getProjectsByOrganization = async (organization_id, {
    page = 1,
    limit = 10,
    search = "",
    sort = "created_at",
    status = ""
}) => {
    const offset = (page - 1) * limit;
    let baseQuery = `
        SELECT * FROM projects
        WHERE organization_id = $1 AND is_deleted = FALSE
    `;
    const values = [organization_id];
    let paramIndex = 2;

    if (search) {
        baseQuery += ` AND (project_name ILIKE $${paramIndex} OR department ILIKE $${paramIndex})`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        baseQuery += ` AND status = $${paramIndex}`;
        values.push(status);
        paramIndex++;
    }

    // Validate sorting field to protect against SQL Injection
    const allowedSortFields = ["created_at", "project_name"];
    const sortField = allowedSortFields.includes(sort) ? sort : "created_at";
    
    baseQuery += ` ORDER BY ${sortField} DESC`;
    baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await db.query(baseQuery, values);

    // Get total items for metadata count
    let countQuery = `
        SELECT COUNT(*) FROM projects
        WHERE organization_id = $1 AND is_deleted = FALSE
    `;
    const countValues = [organization_id];
    let countParamIndex = 2;

    if (search) {
        countQuery += ` AND (project_name ILIKE $${countParamIndex} OR department ILIKE $${countParamIndex})`;
        countValues.push(`%${search}%`);
        countParamIndex++;
    }

    if (status) {
        countQuery += ` AND status = $${countParamIndex}`;
        countValues.push(status);
    }

    const countResult = await db.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return {
        projects: result.rows,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getProjectById = async (project_id, organization_id) => {
    const query = `
        SELECT *
        FROM projects
        WHERE project_id = $1 AND organization_id = $2 AND is_deleted = FALSE;
    `;

    const result = await db.query(query, [project_id, organization_id]);
    return result.rows[0];
};

const updateProject = async (project_id, organization_id, {
    project_name,
    department,
    description,
    status,
    updated_by
}) => {
    const query = `
        UPDATE projects
        SET
            project_name = $1,
            department = $2,
            description = $3,
            status = $4,
            updated_by = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $6 AND organization_id = $7 AND is_deleted = FALSE
        RETURNING *;
    `;

    const values = [
        project_name,
        department,
        description,
        status,
        updated_by,
        project_id,
        organization_id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteProject = async (project_id, organization_id, deleted_by) => {
    const query = `
        UPDATE projects
        SET
            is_deleted = TRUE,
            deleted_at = CURRENT_TIMESTAMP,
            updated_by = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $2 AND organization_id = $3 AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [deleted_by, project_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    createProject,
    findActiveByNameInOrg,
    getProjectsByOrganization,
    getProjectById,
    updateProject,
    deleteProject
};
