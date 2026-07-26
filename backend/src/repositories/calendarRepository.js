const db = require("../config/db");

const getEvents = async (organization_id) => {
    const query = `
        SELECT *
        FROM calendar_events
        WHERE organization_id = $1
        ORDER BY event_date ASC, event_time ASC;
    `;
    const result = await db.query(query, [organization_id]);
    return result.rows;
};

const getEventById = async (event_id, organization_id) => {
    const query = `
        SELECT *
        FROM calendar_events
        WHERE event_id = $1 AND organization_id = $2;
    `;
    const result = await db.query(query, [event_id, organization_id]);
    return result.rows[0];
};

const createEvent = async ({
    organization_id,
    title,
    description,
    event_date,
    event_time,
    color,
    created_by
}) => {
    const query = `
        INSERT INTO calendar_events (
            organization_id,
            title,
            description,
            event_date,
            event_time,
            color,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        organization_id,
        title,
        description,
        event_date,
        event_time || null,
        color || 'blue',
        created_by
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const updateEvent = async (event_id, organization_id, {
    title,
    description,
    event_date,
    event_time,
    color
}) => {
    const query = `
        UPDATE calendar_events
        SET
            title = $1,
            description = $2,
            event_date = $3,
            event_time = $4,
            color = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE event_id = $6 AND organization_id = $7
        RETURNING *;
    `;

    const values = [
        title,
        description,
        event_date,
        event_time,
        color,
        event_id,
        organization_id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteEvent = async (event_id, organization_id) => {
    const query = `
        DELETE FROM calendar_events
        WHERE event_id = $1 AND organization_id = $2
        RETURNING *;
    `;
    const result = await db.query(query, [event_id, organization_id]);
    return result.rows[0];
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
