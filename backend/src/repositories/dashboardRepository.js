const db = require("../config/db");

const getOverviewMetrics = async (organization_id) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM projects WHERE organization_id = $1 AND is_deleted = FALSE) AS total_projects,
            (SELECT COUNT(*) FROM tasks WHERE organization_id = $1 AND is_deleted = FALSE) AS total_tasks,
            (SELECT COUNT(*) FROM tasks WHERE organization_id = $1 AND is_deleted = FALSE AND status = 'DONE') AS completed_tasks,
            (SELECT COUNT(*) FROM tasks WHERE organization_id = $1 AND is_deleted = FALSE AND status = 'TODO') AS pending_tasks,
            (SELECT COUNT(*) FROM tasks WHERE organization_id = $1 AND is_deleted = FALSE AND status = 'IN_PROGRESS') AS tasks_in_progress,
            (SELECT COUNT(*) FROM tasks WHERE organization_id = $1 AND is_deleted = FALSE AND status != 'DONE' AND due_date < CURRENT_TIMESTAMP) AS overdue_tasks,
            (SELECT COUNT(*) FROM projects WHERE organization_id = $1 AND is_deleted = FALSE AND status = 'ARCHIVED') AS archived_projects,
            (SELECT COUNT(*) FROM users WHERE organization_id = $1) AS total_users,
            (SELECT COUNT(*) FROM comments WHERE organization_id = $1 AND is_deleted = FALSE) AS total_comments,
            (SELECT COUNT(*) FROM activity_logs WHERE organization_id = $1) AS total_activities;
    `;

    const result = await db.query(query, [organization_id]);
    return result.rows[0];
};

const getProjectAnalytics = async (organization_id) => {
    // 1. Projects by Status
    const statusQuery = `
        SELECT status, COUNT(*) as count 
        FROM projects 
        WHERE organization_id = $1 AND is_deleted = FALSE 
        GROUP BY status;
    `;
    const statusRes = await db.query(statusQuery, [organization_id]);

    // 2. Projects Created Per Month (last 12 months)
    const monthlyQuery = `
        SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
        FROM projects
        WHERE organization_id = $1 AND is_deleted = FALSE AND created_at >= CURRENT_TIMESTAMP - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month ASC;
    `;
    const monthlyRes = await db.query(monthlyQuery, [organization_id]);

    // 3. Projects Updated Recently (last 5 projects)
    const recentQuery = `
        SELECT project_id, project_name, status, updated_at
        FROM projects
        WHERE organization_id = $1 AND is_deleted = FALSE
        ORDER BY updated_at DESC
        LIMIT 5;
    `;
    const recentRes = await db.query(recentQuery, [organization_id]);

    // 4. Top Active Projects (projects with most activities in last 30 days)
    const activeProjectsQuery = `
        SELECT p.project_id, p.project_name, COUNT(a.activity_id) as activity_count
        FROM projects p
        JOIN activity_logs a ON p.project_id = a.project_id
        WHERE p.organization_id = $1 AND p.is_deleted = FALSE AND a.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        GROUP BY p.project_id, p.project_name
        ORDER BY activity_count DESC
        LIMIT 5;
    `;
    const activeProjectsRes = await db.query(activeProjectsQuery, [organization_id]);

    return {
        projectsByStatus: statusRes.rows,
        projectsCreatedPerMonth: monthlyRes.rows,
        projectsUpdatedRecently: recentRes.rows,
        topActiveProjects: activeProjectsRes.rows
    };
};

const getTaskAnalytics = async (organization_id) => {
    // 1. Tasks by Status
    const statusQuery = `
        SELECT status, COUNT(*) as count
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE
        GROUP BY status;
    `;
    const statusRes = await db.query(statusQuery, [organization_id]);

    // 2. Tasks by Priority
    const priorityQuery = `
        SELECT priority, COUNT(*) as count
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE
        GROUP BY priority;
    `;
    const priorityRes = await db.query(priorityQuery, [organization_id]);

    // 3. Tasks Due Today
    const dueTodayQuery = `
        SELECT task_id, title, due_date
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE AND status != 'DONE' AND due_date::date = CURRENT_DATE;
    `;
    const dueTodayRes = await db.query(dueTodayQuery, [organization_id]);

    // 4. Tasks Due This Week
    const dueWeekQuery = `
        SELECT task_id, title, due_date
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE AND status != 'DONE' AND due_date >= DATE_TRUNC('week', CURRENT_TIMESTAMP) AND due_date < DATE_TRUNC('week', CURRENT_TIMESTAMP) + INTERVAL '7 days';
    `;
    const dueWeekRes = await db.query(dueWeekQuery, [organization_id]);

    // 5. Tasks Due This Month
    const dueMonthQuery = `
        SELECT task_id, title, due_date
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE AND status != 'DONE' AND due_date >= DATE_TRUNC('month', CURRENT_TIMESTAMP) AND due_date < DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month';
    `;
    const dueMonthRes = await db.query(dueMonthQuery, [organization_id]);

    // 6. Overdue Tasks
    const overdueQuery = `
        SELECT task_id, title, due_date
        FROM tasks
        WHERE organization_id = $1 AND is_deleted = FALSE AND status != 'DONE' AND due_date < CURRENT_TIMESTAMP
        ORDER BY due_date ASC;
    `;
    const overdueRes = await db.query(overdueQuery, [organization_id]);

    // 7. Average Completion Time (in hours)
    const avgCompletionQuery = `
        SELECT EXTRACT(epoch FROM AVG(a.created_at - t.created_at)) / 3600 AS avg_completion_hours
        FROM tasks t
        JOIN activity_logs a ON t.task_id = a.entity_id
        WHERE t.organization_id = $1 
          AND t.is_deleted = FALSE 
          AND a.entity_type = 'TASK' 
          AND a.action = 'UPDATE' 
          AND a.new_value->>'status' = 'DONE';
    `;
    const avgCompletionRes = await db.query(avgCompletionQuery, [organization_id]);
    const avgCompletionHours = avgCompletionRes.rows[0]?.avg_completion_hours 
        ? parseFloat(avgCompletionRes.rows[0].avg_completion_hours).toFixed(2)
        : 0;

    // 8. Completed Tasks Per Month (last 12 months)
    const completedMonthlyQuery = `
        SELECT TO_CHAR(a.created_at, 'YYYY-MM') as month, COUNT(DISTINCT t.task_id) as count
        FROM tasks t
        JOIN activity_logs a ON t.task_id = a.entity_id
        WHERE t.organization_id = $1 
          AND t.is_deleted = FALSE 
          AND a.entity_type = 'TASK' 
          AND a.action = 'UPDATE' 
          AND a.new_value->>'status' = 'DONE'
          AND a.created_at >= CURRENT_TIMESTAMP - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month ASC;
    `;
    const completedMonthlyRes = await db.query(completedMonthlyQuery, [organization_id]);

    return {
        tasksByStatus: statusRes.rows,
        tasksByPriority: priorityRes.rows,
        tasksDueToday: dueTodayRes.rows,
        tasksDueThisWeek: dueWeekRes.rows,
        tasksDueThisMonth: dueMonthRes.rows,
        overdueTasks: overdueRes.rows,
        avgCompletionHours: parseFloat(avgCompletionHours),
        completedTasksPerMonth: completedMonthlyRes.rows
    };
};

const getUserAnalytics = async (organization_id) => {
    // 1. Tasks Assigned Per User
    const assignedQuery = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, COUNT(t.task_id) as assigned_tasks_count
        FROM users u
        LEFT JOIN tasks t ON u.user_id = t.assigned_to AND t.is_deleted = FALSE
        WHERE u.organization_id = $1
        GROUP BY u.user_id, u.first_name, u.last_name, u.email
        ORDER BY assigned_tasks_count DESC;
    `;
    const assignedRes = await db.query(assignedQuery, [organization_id]);

    // 2. Completed Tasks Per User
    const completedQuery = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, COUNT(t.task_id) as completed_tasks_count
        FROM users u
        LEFT JOIN tasks t ON u.user_id = t.assigned_to AND t.is_deleted = FALSE AND t.status = 'DONE'
        WHERE u.organization_id = $1
        GROUP BY u.user_id, u.first_name, u.last_name, u.email
        ORDER BY completed_tasks_count DESC;
    `;
    const completedRes = await db.query(completedQuery, [organization_id]);

    // 3. Most Active Users (activities count in last 30 days)
    const activeUsersQuery = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, COUNT(a.activity_id) as activity_count
        FROM users u
        JOIN activity_logs a ON u.user_id = a.user_id
        WHERE u.organization_id = $1 AND a.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        GROUP BY u.user_id, u.first_name, u.last_name, u.email
        ORDER BY activity_count DESC
        LIMIT 5;
    `;
    const activeUsersRes = await db.query(activeUsersQuery, [organization_id]);

    return {
        tasksAssignedPerUser: assignedRes.rows,
        completedTasksPerUser: completedRes.rows,
        mostActiveUsers: activeUsersRes.rows
    };
};

const getActivityAnalytics = async (organization_id) => {
    // 1. Recent Activities (last 10 logs)
    const recentQuery = `
        SELECT a.*, u.first_name, u.last_name, u.email
        FROM activity_logs a
        LEFT JOIN users u ON a.user_id = u.user_id
        WHERE a.organization_id = $1
        ORDER BY a.created_at DESC
        LIMIT 10;
    `;
    const recentRes = await db.query(recentQuery, [organization_id]);

    // 2. Activity Count by Type
    const typeQuery = `
        SELECT entity_type, COUNT(*) as count
        FROM activity_logs
        WHERE organization_id = $1
        GROUP BY entity_type;
    `;
    const typeRes = await db.query(typeQuery, [organization_id]);

    // 3. Most Active Projects
    const activeProjectsQuery = `
        SELECT p.project_id, p.project_name, COUNT(a.activity_id) as activity_count
        FROM projects p
        JOIN activity_logs a ON p.project_id = a.project_id
        WHERE p.organization_id = $1 AND p.is_deleted = FALSE
        GROUP BY p.project_id, p.project_name
        ORDER BY activity_count DESC
        LIMIT 5;
    `;
    const activeProjectsRes = await db.query(activeProjectsQuery, [organization_id]);

    // 4. Most Active Tasks
    const activeTasksQuery = `
        SELECT t.task_id, t.title, COUNT(a.activity_id) as activity_count
        FROM tasks t
        JOIN activity_logs a ON t.task_id = a.task_id
        WHERE t.organization_id = $1 AND t.is_deleted = FALSE
        GROUP BY t.task_id, t.title
        ORDER BY activity_count DESC
        LIMIT 5;
    `;
    const activeTasksRes = await db.query(activeTasksQuery, [organization_id]);

    return {
        recentActivities: recentRes.rows,
        activityCountByType: typeRes.rows,
        mostActiveProjects: activeProjectsRes.rows,
        mostActiveTasks: activeTasksRes.rows
    };
};

module.exports = {
    getOverviewMetrics,
    getProjectAnalytics,
    getTaskAnalytics,
    getUserAnalytics,
    getActivityAnalytics
};
