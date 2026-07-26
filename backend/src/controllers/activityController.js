const activityRepository = require("../repositories/activityRepository");
const projectRepository = require("../repositories/projectRepository");
const taskRepository = require("../repositories/taskRepository");

const getProjectActivity = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { projectId } = req.params;

        // 1. Verify project exists in the same tenant
        const project = await projectRepository.getProjectById(projectId, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // 2. Parse pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await activityRepository.getProjectActivity(projectId, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.activities,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving project activities:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getTaskActivity = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { taskId } = req.params;

        // 1. Verify task exists in the same tenant
        const task = await taskRepository.getTaskById(taskId, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // 2. Parse pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await activityRepository.getTaskActivity(taskId, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.activities,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving task activities:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getProjectActivity,
    getTaskActivity
};
