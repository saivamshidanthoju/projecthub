const db = require("../config/db");

const getItems = async (user_id, organization_id) => {
    const query = `
        SELECT *
        FROM my_work
        WHERE user_id = $1 AND organization_id = $2
        ORDER BY created_at ASC;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows;
};

const getItemById = async (work_id, user_id, organization_id) => {
    const query = `
        SELECT *
        FROM my_work
        WHERE work_id = $1 AND user_id = $2 AND organization_id = $3;
    `;
    const result = await db.query(query, [work_id, user_id, organization_id]);
    return result.rows[0];
};

const createItem = async ({
    organization_id,
    user_id,
    title,
    column_key,
    assigned_user
}) => {
    const query = `
        INSERT INTO my_work (
            organization_id,
            user_id,
            title,
            column_key,
            assigned_user
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        organization_id,
        user_id,
        title,
        column_key,
        assigned_user || 'Me'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const updateItem = async (work_id, user_id, organization_id, {
    title,
    column_key,
    assigned_user
}) => {
    const query = `
        UPDATE my_work
        SET
            title = $1,
            column_key = $2,
            assigned_user = $3
        WHERE work_id = $4 AND user_id = $5 AND organization_id = $6
        RETURNING *;
    `;
    const values = [
        title,
        column_key,
        assigned_user,
        work_id,
        user_id,
        organization_id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteItem = async (work_id, user_id, organization_id) => {
    const query = `
        DELETE FROM my_work
        WHERE work_id = $1 AND user_id = $2 AND organization_id = $3
        RETURNING *;
    `;
    const result = await db.query(query, [work_id, user_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
