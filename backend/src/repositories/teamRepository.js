const db = require("../config/db");

const getTeam = async (organization_id) => {
    const query = `
        SELECT u.user_id, u.organization_id, u.role_id, u.first_name, u.last_name, u.email, u.is_active, u.created_at, r.role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.organization_id = $1
        ORDER BY u.user_id ASC;
    `;
    const result = await db.query(query, [organization_id]);
    return result.rows;
};

const getMemberById = async (user_id, organization_id) => {
    const query = `
        SELECT u.user_id, u.organization_id, u.role_id, u.first_name, u.last_name, u.email, u.is_active, u.created_at, r.role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.user_id = $1 AND u.organization_id = $2;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows[0];
};

const createMember = async ({
    organization_id,
    role_id,
    first_name,
    last_name,
    email,
    password_hash
}) => {
    const query = `
        INSERT INTO users (
            organization_id,
            role_id,
            first_name,
            last_name,
            email,
            password_hash,
            is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, TRUE)
        RETURNING user_id, organization_id, role_id, first_name, last_name, email, is_active, created_at;
    `;
    const values = [
        organization_id,
        role_id || 3, // Default to Member
        first_name,
        last_name,
        email,
        password_hash
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const updateMember = async (user_id, organization_id, {
    role_id,
    is_active
}) => {
    const query = `
        UPDATE users
        SET
            role_id = COALESCE($1, role_id),
            is_active = COALESCE($2, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3 AND organization_id = $4
        RETURNING user_id, organization_id, role_id, first_name, last_name, email, is_active, created_at;
    `;
    const values = [role_id, is_active, user_id, organization_id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteMember = async (user_id, organization_id) => {
    const query = `
        DELETE FROM users
        WHERE user_id = $1 AND organization_id = $2
        RETURNING user_id, email;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    getTeam,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};
