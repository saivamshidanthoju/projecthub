const dashboardRepository = require("../repositories/dashboardRepository");

const getOverview = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const metrics = await dashboardRepository.getOverviewMetrics(organization_id);

        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalProjects: parseInt(metrics.total_projects, 10),
                    totalTasks: parseInt(metrics.total_tasks, 10),
                    completedTasks: parseInt(metrics.completed_tasks, 10),
                    pendingTasks: parseInt(metrics.pending_tasks, 10),
                    tasksInProgress: parseInt(metrics.tasks_in_progress, 10),
                    overdueTasks: parseInt(metrics.overdue_tasks, 10),
                    archivedProjects: parseInt(metrics.archived_projects, 10),
                    totalUsers: parseInt(metrics.total_users, 10),
                    totalComments: parseInt(metrics.total_comments, 10),
                    totalActivities: parseInt(metrics.total_activities, 10)
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving dashboard overview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const data = await dashboardRepository.getProjectAnalytics(organization_id);

        return res.status(200).json({
            success: true,
            data: {
                projects: {
                    projectsByStatus: data.projectsByStatus,
                    projectsCreatedPerMonth: data.projectsCreatedPerMonth,
                    projectsUpdatedRecently: data.projectsUpdatedRecently,
                    topActiveProjects: data.topActiveProjects
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving project analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const data = await dashboardRepository.getTaskAnalytics(organization_id);

        return res.status(200).json({
            success: true,
            data: {
                tasks: {
                    tasksByStatus: data.tasksByStatus,
                    tasksByPriority: data.tasksByPriority,
                    tasksDueToday: data.tasksDueToday,
                    tasksDueThisWeek: data.tasksDueThisWeek,
                    tasksDueThisMonth: data.tasksDueThisMonth,
                    overdueTasks: data.overdueTasks,
                    avgCompletionHours: data.avgCompletionHours,
                    completedTasksPerMonth: data.completedTasksPerMonth
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving task analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const data = await dashboardRepository.getUserAnalytics(organization_id);

        return res.status(200).json({
            success: true,
            data: {
                users: {
                    tasksAssignedPerUser: data.tasksAssignedPerUser,
                    completedTasksPerUser: data.completedTasksPerUser,
                    mostActiveUsers: data.mostActiveUsers
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving user analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getActivity = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const data = await dashboardRepository.getActivityAnalytics(organization_id);

        return res.status(200).json({
            success: true,
            data: {
                activity: {
                    recentActivities: data.recentActivities,
                    activityCountByType: data.activityCountByType,
                    mostActiveProjects: data.mostActiveProjects,
                    mostActiveTasks: data.mostActiveTasks
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving activity analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getOverview,
    getProjects,
    getTasks,
    getUsers,
    getActivity
};
