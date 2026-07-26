const notificationRepository = require("../repositories/notificationRepository");
const db = require("../config/db");

const sendNotification = async (req, { organization_id, user_id, title, message, type, reference_type, reference_id }) => {
    const notification = await notificationRepository.createNotification({
        organization_id,
        user_id,
        title,
        message,
        type,
        reference_type,
        reference_id
    });

    const io = req.app.get("io");
    if (io) {
        io.to(`user_${user_id}`).emit("notification:new", notification);
    }
    return notification;
};

const notifyProjectCreated = async (req, project) => {
    const organization_id = project.organization_id;
    const creator_id = project.created_by;

    // Get all users in the organization except the creator
    const usersQuery = `SELECT user_id FROM users WHERE organization_id = $1 AND user_id != $2`;
    const usersResult = await db.query(usersQuery, [organization_id, creator_id]);

    for (const row of usersResult.rows) {
        await sendNotification(req, {
            organization_id,
            user_id: row.user_id,
            title: "Project Created",
            message: `A new project has been created: ${project.project_name}`,
            type: "PROJECT_CREATED",
            reference_type: "PROJECT",
            reference_id: project.project_id
        });
    }

    // Broadcast project created to entire organization room
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("project:created", project);
    }
};

const notifyProjectUpdated = async (req, project, statusChangedToArchived = false) => {
    const organization_id = project.organization_id;
    const updater_id = req.user.user_id;

    // Get all users in the organization except the updater
    const usersQuery = `SELECT user_id FROM users WHERE organization_id = $1 AND user_id != $2`;
    const usersResult = await db.query(usersQuery, [organization_id, updater_id]);

    const title = statusChangedToArchived ? "Project Archived" : "Project Updated";
    const type = statusChangedToArchived ? "PROJECT_ARCHIVED" : "PROJECT_UPDATED";
    const message = statusChangedToArchived 
        ? `Project '${project.project_name}' has been archived.`
        : `Project '${project.project_name}' has been updated.`;

    for (const row of usersResult.rows) {
        await sendNotification(req, {
            organization_id,
            user_id: row.user_id,
            title,
            message,
            type,
            reference_type: "PROJECT",
            reference_id: project.project_id
        });
    }

    // Broadcast project updated to entire organization room
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("project:updated", project);
    }
};

const notifyTaskCreated = async (req, task) => {
    const organization_id = task.organization_id;
    const creator_id = task.created_by;

    // If task is assigned to someone else, notify them
    if (task.assigned_to && task.assigned_to !== creator_id) {
        await sendNotification(req, {
            organization_id,
            user_id: task.assigned_to,
            title: "Task Assigned",
            message: `You have been assigned the task: ${task.title}`,
            type: "TASK_ASSIGNED",
            reference_type: "TASK",
            reference_id: task.task_id
        });
    }

    // Broadcast task created
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("task:created", task);
    }
};

const notifyTaskUpdated = async (req, task, oldTask) => {
    const organization_id = task.organization_id;
    const updater_id = req.user.user_id;

    // 1. Check if assignee changed
    if (task.assigned_to && task.assigned_to !== oldTask.assigned_to && task.assigned_to !== updater_id) {
        await sendNotification(req, {
            organization_id,
            user_id: task.assigned_to,
            title: "Task Assigned",
            message: `You have been assigned the task: ${task.title}`,
            type: "TASK_ASSIGNED",
            reference_type: "TASK",
            reference_id: task.task_id
        });
    }

    // 2. Check if status changed
    if (task.status !== oldTask.status) {
        const isCompleted = task.status === "DONE";
        const title = isCompleted ? "Task Completed" : "Task Status Changed";
        const type = isCompleted ? "TASK_COMPLETED" : "TASK_UPDATED";
        const message = isCompleted
            ? `Task '${task.title}' has been completed.`
            : `Task '${task.title}' status was changed to ${task.status}`;

        // Notify creator & assignee if they are not the updater
        const recipients = new Set();
        if (task.created_by && task.created_by !== updater_id) recipients.add(task.created_by);
        if (task.assigned_to && task.assigned_to !== updater_id) recipients.add(task.assigned_to);

        for (const recipientId of recipients) {
            await sendNotification(req, {
                organization_id,
                user_id: recipientId,
                title,
                message,
                type,
                reference_type: "TASK",
                reference_id: task.task_id
            });
        }
    }

    // Broadcast task updated
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("task:updated", task);
    }
};

const notifyTaskDeleted = async (req, task_id, organization_id) => {
    // Broadcast task deleted
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("task:deleted", { task_id });
    }
};

const notifyCommentAdded = async (req, comment, task) => {
    const organization_id = comment.organization_id;
    const author_id = comment.user_id;

    // Fetch author details
    const authorQuery = `SELECT first_name, last_name FROM users WHERE user_id = $1`;
    const authorResult = await db.query(authorQuery, [author_id]);
    const author = authorResult.rows[0] || { first_name: "Someone" };

    // 1. Detect Mentions
    const mentionRegex = /@(\w+)/g;
    const matches = [...comment.comment.matchAll(mentionRegex)];
    const notifiedUserIds = new Set();

    for (const match of matches) {
        const name = match[1];
        const userQuery = `
            SELECT user_id FROM users 
            WHERE organization_id = $1 AND (first_name ILIKE $2 OR last_name ILIKE $2)
            LIMIT 1;
        `;
        const userRes = await db.query(userQuery, [organization_id, name]);
        if (userRes.rows.length > 0) {
            const target_id = userRes.rows[0].user_id;
            if (target_id !== author_id) {
                notifiedUserIds.add(target_id);
                await sendNotification(req, {
                    organization_id,
                    user_id: target_id,
                    title: "You were mentioned",
                    message: `${author.first_name} mentioned you in a comment: "${comment.comment}"`,
                    type: "MENTION",
                    reference_type: "COMMENT",
                    reference_id: comment.comment_id
                });
            }
        }
    }

    // 2. Notify Assignee and Creator (if they were not mentioned and are not the author)
    const otherRecipients = new Set();
    if (task.created_by && task.created_by !== author_id) otherRecipients.add(task.created_by);
    if (task.assigned_to && task.assigned_to !== author_id) otherRecipients.add(task.assigned_to);

    for (const recipientId of otherRecipients) {
        if (!notifiedUserIds.has(recipientId)) {
            await sendNotification(req, {
                organization_id,
                user_id: recipientId,
                title: "New Comment Added",
                message: `A new comment was added on task: ${task.title}`,
                type: "TASK_COMMENTED",
                reference_type: "COMMENT",
                reference_id: comment.comment_id
            });
        }
    }

    // Broadcast comment added to organization
    const io = req.app.get("io");
    if (io) {
        io.to(`org_${organization_id}`).emit("comment:added", comment);
    }
};

module.exports = {
    notifyProjectCreated,
    notifyProjectUpdated,
    notifyTaskCreated,
    notifyTaskUpdated,
    notifyTaskDeleted,
    notifyCommentAdded
};
