const calendarRepository = require("../repositories/calendarRepository");

const getEvents = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const events = await calendarRepository.getEvents(organization_id);

        return res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error("Error retrieving calendar events:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const createEvent = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const created_by = req.user.user_id;
        const { title, description, event_date, event_time, color } = req.body;

        if (!title || !event_date) {
            return res.status(400).json({
                success: false,
                message: "Title and event date are required."
            });
        }

        const event = await calendarRepository.createEvent({
            organization_id,
            title,
            description,
            event_date,
            event_time,
            color,
            created_by
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully.",
            data: event
        });
    } catch (error) {
        console.error("Error creating calendar event:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { title, description, event_date, event_time, color } = req.body;

        const existingEvent = await calendarRepository.getEventById(id, organization_id);
        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        const updatedEvent = await calendarRepository.updateEvent(id, organization_id, {
            title: title || existingEvent.title,
            description: description !== undefined ? description : existingEvent.description,
            event_date: event_date || existingEvent.event_date,
            event_time: event_time !== undefined ? event_time : existingEvent.event_time,
            color: color || existingEvent.color
        });

        return res.status(200).json({
            success: true,
            message: "Event updated successfully.",
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error updating calendar event:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const event = await calendarRepository.deleteEvent(id, organization_id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting calendar event:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
