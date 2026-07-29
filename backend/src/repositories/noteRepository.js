const db = require("../config/db");

const getNotes = async (user_id, organization_id) => {
    const query = `
        SELECT *
        FROM notes
        WHERE user_id = $1 AND organization_id = $2
        ORDER BY updated_at DESC, created_at DESC;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows;
};

const getNoteById = async (note_id, user_id, organization_id) => {
    const query = `
        SELECT *
        FROM notes
        WHERE note_id = $1 AND user_id = $2 AND organization_id = $3;
    `;
    const result = await db.query(query, [note_id, user_id, organization_id]);
    return result.rows[0];
};

const createNote = async ({
    organization_id,
    user_id,
    title,
    content,
    type
}) => {
    const query = `
        INSERT INTO notes (
            organization_id,
            user_id,
            title,
            content,
            type
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        organization_id,
        user_id,
        title || 'Untitled',
        content || '',
        type || 'plain'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const updateNote = async (note_id, user_id, organization_id, {
    title,
    content,
    type
}) => {
    const query = `
        UPDATE notes
        SET
            title = $1,
            content = $2,
            type = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE note_id = $4 AND user_id = $5 AND organization_id = $6
        RETURNING *;
    `;
    const values = [
        title,
        content,
        type,
        note_id,
        user_id,
        organization_id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteNote = async (note_id, user_id, organization_id) => {
    const query = `
        DELETE FROM notes
        WHERE note_id = $1 AND user_id = $2 AND organization_id = $3
        RETURNING *;
    `;
    const result = await db.query(query, [note_id, user_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
