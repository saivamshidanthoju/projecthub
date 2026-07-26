const attachmentRepository = require("../repositories/attachmentRepository");
const projectRepository = require("../repositories/projectRepository");
const taskRepository = require("../repositories/taskRepository");
const commentRepository = require("../repositories/commentRepository");
const storageService = require("../services/storageService");

const uploadToProject = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const uploaded_by = req.user.user_id;
        const { id } = req.params; // project_id

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Verify project exists and belongs to organization
        const project = await projectRepository.getProjectById(id, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Save file to storage
        const storageResult = await storageService.saveFile(req.file, organization_id);

        // Register in DB
        const attachment = await attachmentRepository.createAttachment({
            organization_id,
            project_id: project.project_id,
            uploaded_by,
            original_name: req.file.originalname,
            stored_name: storageResult.stored_name,
            mime_type: req.file.mimetype,
            file_size: req.file.size,
            storage_path: storageResult.storage_path
        });

        return res.status(201).json({
            success: true,
            message: "File uploaded to project successfully.",
            data: attachment
        });
    } catch (error) {
        console.error("Error uploading project attachment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const uploadToTask = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const uploaded_by = req.user.user_id;
        const { id } = req.params; // task_id

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Verify task exists and belongs to organization
        const task = await taskRepository.getTaskById(id, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // Save file to storage
        const storageResult = await storageService.saveFile(req.file, organization_id);

        // Register in DB (link to task and project)
        const attachment = await attachmentRepository.createAttachment({
            organization_id,
            project_id: task.project_id,
            task_id: task.task_id,
            uploaded_by,
            original_name: req.file.originalname,
            stored_name: storageResult.stored_name,
            mime_type: req.file.mimetype,
            file_size: req.file.size,
            storage_path: storageResult.storage_path
        });

        return res.status(201).json({
            success: true,
            message: "File uploaded to task successfully.",
            data: attachment
        });
    } catch (error) {
        console.error("Error uploading task attachment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const uploadToComment = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const uploaded_by = req.user.user_id;
        const { id } = req.params; // comment_id

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Verify comment exists and belongs to organization
        const comment = await commentRepository.getCommentById(id, organization_id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        // Fetch task to get project_id
        const task = await taskRepository.getTaskById(comment.task_id, organization_id);
        const project_id = task ? task.project_id : null;

        // Save file to storage
        const storageResult = await storageService.saveFile(req.file, organization_id);

        // Register in DB
        const attachment = await attachmentRepository.createAttachment({
            organization_id,
            project_id,
            task_id: comment.task_id,
            comment_id: comment.comment_id,
            uploaded_by,
            original_name: req.file.originalname,
            stored_name: storageResult.stored_name,
            mime_type: req.file.mimetype,
            file_size: req.file.size,
            storage_path: storageResult.storage_path
        });

        return res.status(201).json({
            success: true,
            message: "File uploaded to comment successfully.",
            data: attachment
        });
    } catch (error) {
        console.error("Error uploading comment attachment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const downloadAttachment = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params; // attachment_id

        // Fetch attachment and verify tenant
        const attachment = await attachmentRepository.getAttachment(id, organization_id);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found."
            });
        }

        // Set response headers
        res.setHeader("Content-Type", attachment.mime_type);
        res.setHeader("Content-Disposition", `attachment; filename="${attachment.original_name}"`);

        // Pipe storage stream to client
        const stream = storageService.getFileStream(attachment.storage_path);
        stream.on("error", (err) => {
            console.error("Error streaming file:", err);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Error reading file." });
            }
        });
        stream.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getProjectAttachments = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params; // project_id

        // Verify project exists
        const project = await projectRepository.getProjectById(id, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await attachmentRepository.getAttachmentsByProject(id, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.attachments,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving project attachments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getTaskAttachments = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params; // task_id

        // Verify task exists
        const task = await taskRepository.getTaskById(id, organization_id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await attachmentRepository.getAttachmentsByTask(id, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.attachments,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving task attachments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getCommentAttachments = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params; // comment_id

        // Verify comment exists
        const comment = await commentRepository.getCommentById(id, organization_id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const result = await attachmentRepository.getAttachmentsByComment(id, organization_id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.attachments,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving comment attachments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const user_id = req.user.user_id;
        const role_id = req.user.role_id;
        const { id } = req.params; // attachment_id

        // Fetch attachment and verify tenant
        const attachment = await attachmentRepository.getAttachment(id, organization_id);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found."
            });
        }

        // Authorization check: Uploader or Admin can delete
        if (attachment.uploaded_by !== user_id && role_id !== 1) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this attachment."
            });
        }

        // Soft delete in database
        await attachmentRepository.deleteAttachment(id, organization_id);

        // Delete physical file from storage
        await storageService.deleteFile(attachment.storage_path);

        return res.status(200).json({
            success: true,
            message: "Attachment deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting attachment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    uploadToProject,
    uploadToTask,
    uploadToComment,
    downloadAttachment,
    getProjectAttachments,
    getTaskAttachments,
    getCommentAttachments,
    deleteAttachment
};
