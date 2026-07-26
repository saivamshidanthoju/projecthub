const commentRepository = require("../repositories/commentRepository");
const taskRepository = require("../repositories/taskRepository");
const activityRepository = require("../repositories/activityRepository");
const notificationService = require("../services/notificationService");
const { pool } = require("../config/db");

const createComment = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const user_id = req.user.user_id;
        const { taskId } = req.params;
        const { comment } = req.body;

        // 1. Verify that the task exists and belongs to organization
        const task = await taskRepository.getTaskById(taskId, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // Initialize transaction
        const client = await pool.connect();
        let newComment;
        try {
            await client.query("BEGIN");

            newComment = await commentRepository.createComment({
                task_id: task.task_id,
                organization_id,
                user_id,
                comment
            }, client);

            // Log activity
            await activityRepository.logActivity({
                organization_id,
                project_id: task.project_id,
                task_id: task.task_id,
                user_id,
                action: "CREATE",
                entity_type: "COMMENT",
                entity_id: newComment.comment_id,
                new_value: { comment }
            }, client);

            await client.query("COMMIT");
        } catch (txError) {
            await client.query("ROLLBACK");
            throw txError;
        } finally {
            client.release();
        }

        // Trigger comment added notifications (outside critical transactional boundary)
        await notificationService.notifyCommentAdded(req, newComment, task);

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            data: newComment
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        next(error); // forward to global error handler
    }
};

const getComments = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const { taskId } = req.params;

        // 1. Verify task exists
        const task = await taskRepository.getTaskById(taskId, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // 2. Parse query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const search = req.query.search ? req.query.search.trim() : "";

        const result = await commentRepository.getCommentsByTask(task.task_id, organization_id, {
            page,
            limit,
            search
        });

        return res.status(200).json({
            success: true,
            data: result.comments,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving comments:", error);
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const user_id = req.user.user_id;
        const role_id = req.user.role_id;
        const { id } = req.params;
        const { comment } = req.body;

        // 1. Fetch comment and verify tenant
        const existingComment = await commentRepository.getCommentById(id, organization_id);
        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        // 2. Authorization check: Comment owner or Admin can update
        if (existingComment.user_id !== user_id && role_id !== 1) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this comment."
            });
        }

        const updatedComment = await commentRepository.updateComment(id, organization_id, comment);

        // Fetch task to get project_id for activity log
        const task = await taskRepository.getTaskById(updatedComment.task_id, organization_id);

        // 3. Log activity
        if (task) {
            await activityRepository.logActivity({
                organization_id,
                project_id: task.project_id,
                task_id: task.task_id,
                user_id,
                action: "UPDATE",
                entity_type: "COMMENT",
                entity_id: updatedComment.comment_id,
                old_value: { comment: existingComment.comment },
                new_value: { comment }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully.",
            data: updatedComment
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const organization_id = req.user.organization_id;
        const user_id = req.user.user_id;
        const role_id = req.user.role_id;
        const { id } = req.params;

        // 1. Fetch comment and verify tenant
        const existingComment = await commentRepository.getCommentById(id, organization_id);
        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        // 2. Authorization check: Comment owner or Admin can delete
        if (existingComment.user_id !== user_id && role_id !== 1) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this comment."
            });
        }

        await commentRepository.deleteComment(id, organization_id);

        // Fetch task for logging
        const task = await taskRepository.getTaskById(existingComment.task_id, organization_id);

        // 3. Log activity
        if (task) {
            await activityRepository.logActivity({
                organization_id,
                project_id: task.project_id,
                task_id: task.task_id,
                user_id,
                action: "DELETE",
                entity_type: "COMMENT",
                entity_id: existingComment.comment_id,
                old_value: { comment: existingComment.comment }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        next(error);
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};
