const timeLogRepository = require("../repositories/timeLogRepository");

const getLogs = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const rows = await timeLogRepository.getLogs(user_id, organization_id);
        const data = rows.map(row => ({
            id: row.log_id,
            title: row.title,
            comment: row.comment,
            time: parseFloat(row.time_reported) || 0,
            dateString: new Date(row.log_date).toLocaleDateString(),
            createdAt: new Date(row.created_at).toLocaleDateString()
        }));

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error retrieving time logs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const createLog = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { title, comment, time, dateString } = req.body;

        if (!title || !time || !dateString) {
            return res.status(400).json({
                success: false,
                message: "Title, time, and log date are required."
            });
        }

        const log = await timeLogRepository.createLog({
            organization_id,
            user_id,
            title,
            comment,
            time_reported: time,
            log_date: new Date(dateString)
        });

        return res.status(201).json({
            success: true,
            message: "Time log created successfully.",
            data: {
                id: log.log_id,
                title: log.title,
                comment: log.comment,
                time: parseFloat(log.time_reported) || 0,
                dateString: new Date(log.log_date).toLocaleDateString(),
                createdAt: new Date(log.created_at).toLocaleDateString()
            }
        });
    } catch (error) {
        console.error("Error creating time log:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateLog = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { title, comment, time, dateString } = req.body;

        const existing = await timeLogRepository.getLogById(id, user_id, organization_id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Time log not found."
            });
        }

        const log = await timeLogRepository.updateLog(id, user_id, organization_id, {
            title: title !== undefined ? title : existing.title,
            comment: comment !== undefined ? comment : existing.comment,
            time_reported: time !== undefined ? time : existing.time_reported,
            log_date: dateString ? new Date(dateString) : existing.log_date
        });

        return res.status(200).json({
            success: true,
            message: "Time log updated successfully.",
            data: {
                id: log.log_id,
                title: log.title,
                comment: log.comment,
                time: parseFloat(log.time_reported) || 0,
                dateString: new Date(log.log_date).toLocaleDateString(),
                createdAt: new Date(log.created_at).toLocaleDateString()
            }
        });
    } catch (error) {
        console.error("Error updating time log:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteLog = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const log = await timeLogRepository.deleteLog(id, user_id, organization_id);
        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Time log not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Time log deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting time log:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getLogs,
    createLog,
    updateLog,
    deleteLog
};
