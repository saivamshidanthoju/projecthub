const db = require("../config/db");

const getLogs = async (user_id, organization_id) => {
    const query = `
        SELECT *
        FROM time_logs
        WHERE user_id = $1 AND organization_id = $2
        ORDER BY log_date DESC, created_at DESC;
    `;
    const result = await db.query(query, [user_id, organization_id]);
    return result.rows;
};

const getLogById = async (log_id, user_id, organization_id) => {
    const query = `
        SELECT *
        FROM time_logs
        WHERE log_id = $1 AND user_id = $2 AND organization_id = $3;
    `;
    const result = await db.query(query, [log_id, user_id, organization_id]);
    return result.rows[0];
};

const createLog = async ({
    organization_id,
    user_id,
    title,
    comment,
    time_reported,
    log_date
}) => {
    const query = `
        INSERT INTO time_logs (
            organization_id,
            user_id,
            title,
            comment,
            time_reported,
            log_date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
        organization_id,
        user_id,
        title,
        comment || '',
        parseFloat(time_reported),
        log_date
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const updateLog = async (log_id, user_id, organization_id, {
    title,
    comment,
    time_reported,
    log_date
}) => {
    const query = `
        UPDATE time_logs
        SET
            title = $1,
            comment = $2,
            time_reported = $3,
            log_date = $4
        WHERE log_id = $5 AND user_id = $6 AND organization_id = $7
        RETURNING *;
    `;
    const values = [
        title,
        comment,
        parseFloat(time_reported),
        log_date,
        log_id,
        user_id,
        organization_id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteLog = async (log_id, user_id, organization_id) => {
    const query = `
        DELETE FROM time_logs
        WHERE log_id = $1 AND user_id = $2 AND organization_id = $3
        RETURNING *;
    `;
    const result = await db.query(query, [log_id, user_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    getLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog
};
