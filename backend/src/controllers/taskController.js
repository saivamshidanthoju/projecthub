const taskRepository = require("../repositories/taskRepository");
const projectRepository = require("../repositories/projectRepository");
const userRepository = require("../repositories/userRepository");
const activityRepository = require("../repositories/activityRepository");
const notificationService = require("../services/notificationService");
const { pool } = require("../config/db");

const createTask = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const created_by = req.user.user_id;
        const {
            project_id,
            title,
            description,
            status,
            priority,
            assigned_to,
            due_date
        } = req.body;

        // 1. Verify that the project exists and belongs to the user's organization
        const project = await projectRepository.getProjectById(project_id, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // 2. Verify that the assignee belongs to the user's organization
        if (assigned_to) {
            const assignee = await userRepository.findUserById(assigned_to);
            if (!assignee || assignee.organization_id !== organization_id) {
                return res.status(400).json({
                    success: false,
                    message: "Assigned user must belong to your organization."
                });
            }
        }

        const client = await pool.connect();
        let task;
        try {
            await client.query("BEGIN");

            task = await taskRepository.createTask({
                project_id,
                organization_id,
                title,
                description,
                status: status ? status.toUpperCase() : "TODO",
                priority: priority ? priority.toUpperCase() : "MEDIUM",
                assigned_to,
                created_by,
                due_date
            }, client);

            // Log task creation activity
            await activityRepository.logActivity({
                organization_id,
                project_id: task.project_id,
                task_id: task.task_id,
                user_id: created_by,
                action: "CREATE",
                entity_type: "TASK",
                entity_id: task.task_id,
                new_value: {
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    assigned_to: task.assigned_to
                }
            }, client);

            await client.query("COMMIT");
        } catch (txError) {
            await client.query("ROLLBACK");
            throw txError;
        } finally {
            client.release();
        }

        // Trigger task creation and assign notifications (outside database transaction block)
        await notificationService.notifyTaskCreated(req, task);

        return res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: task
        });
    } catch (error) {
        console.error("Error creating task:", error);
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;

        // Parse query params
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 100) limit = 100; // Cap limits for safety

        const search = req.query.search ? req.query.search.trim() : "";
        const status = req.query.status ? req.query.status.trim().toUpperCase() : "";
        const priority = req.query.priority ? req.query.priority.trim().toUpperCase() : "";
        const project_id = req.query.project ? req.query.project.trim() : "";
        const assigned_to = req.query.assigned_to ? req.query.assigned_to.trim() : "";
        const sort = req.query.sort ? req.query.sort.trim() : "created_at";

        const result = await taskRepository.getTasks(organization_id, {
            page,
            limit,
            search,
            status,
            priority,
            project_id,
            assigned_to,
            sort
        });

        return res.status(200).json({
            success: true,
            data: result.tasks,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        next(error);
    }
};

const getTask = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const task = await taskRepository.getTaskById(id, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error("Error retrieving task:", error);
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const {
            title,
            description,
            status,
            priority,
            assigned_to,
            due_date
        } = req.body;
        const user_id = req.user.user_id;

        // 1. Check if the task exists and belongs to the user's organization
        const task = await taskRepository.getTaskById(id, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // 2. Verify assignee belongs to organization if assigned_to is changed
        if (assigned_to && assigned_to !== task.assigned_to) {
            const assignee = await userRepository.findUserById(assigned_to);
            if (!assignee || assignee.organization_id !== organization_id) {
                return res.status(400).json({
                    success: false,
                    message: "Assigned user must belong to your organization."
                });
            }
        }

        const updatedTask = await taskRepository.updateTask(id, organization_id, {
            title: title !== undefined ? title : task.title,
            description: description !== undefined ? description : task.description,
            status: status ? status.toUpperCase() : task.status,
            priority: priority ? priority.toUpperCase() : task.priority,
            assigned_to: assigned_to !== undefined ? assigned_to : task.assigned_to,
            due_date: due_date !== undefined ? due_date : task.due_date
        });

        // Log task update activity
        await activityRepository.logActivity({
            organization_id,
            project_id: updatedTask.project_id,
            task_id: updatedTask.task_id,
            user_id,
            action: "UPDATE",
            entity_type: "TASK",
            entity_id: updatedTask.task_id,
            old_value: {
                title: task.title,
                status: task.status,
                priority: task.priority,
                assigned_to: task.assigned_to
            },
            new_value: {
                title: updatedTask.title,
                status: updatedTask.status,
                priority: updatedTask.priority,
                assigned_to: updatedTask.assigned_to
            }
        });

        // Trigger task update/status change notifications
        await notificationService.notifyTaskUpdated(req, updatedTask, task);

        return res.status(200).json({
            success: true,
            message: "Task updated successfully.",
            data: updatedTask
        });
    } catch (error) {
        console.error("Error updating task:", error);
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const deleted_by = req.user.user_id;

        const task = await taskRepository.deleteTask(id, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // Log task deletion activity
        await activityRepository.logActivity({
            organization_id,
            project_id: task.project_id,
            task_id: task.task_id,
            user_id: deleted_by,
            action: "DELETE",
            entity_type: "TASK",
            entity_id: task.task_id,
            old_value: {
                title: task.title
            }
        });

        // Trigger real-time task deletion broadcast
        await notificationService.notifyTaskDeleted(req, id, organization_id);

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        next(error);
    }
};

const getTasksByProject = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const { projectId } = req.params;

        // 1. Verify that the project exists and belongs to organization
        const project = await projectRepository.getProjectById(projectId, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // 2. Parse pagination query params
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await taskRepository.getTasksByProject(projectId, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.tasks,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving tasks for project:", error);
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getTasksByProject
};
