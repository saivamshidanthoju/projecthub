const db = require("../config/db");

const findUserByEmail = async (email) => {
    const query = `
        SELECT *
        FROM users
        WHERE email = $1
    `;

    const result = await db.query(query, [email]);
    return result.rows[0];
};

const findUserById = async (user_id) => {
    const query = `
        SELECT
            user_id,
            organization_id,
            role_id,
            first_name,
            last_name,
            email,
            is_active,
            created_at
        FROM users
        WHERE user_id = $1
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
};

const createUser = async ({
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
            password_hash
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            user_id,
            organization_id,
            role_id,
            first_name,
            last_name,
            email,
            is_active,
            created_at;
    `;

    const values = [
        organization_id,
        role_id,
        first_name,
        last_name,
        email,
        password_hash
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};