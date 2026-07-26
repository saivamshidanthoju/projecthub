const projectRepository = require("../repositories/projectRepository");
const activityRepository = require("../repositories/activityRepository");
const notificationService = require("../services/notificationService");

const createProject = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const created_by = req.user.user_id;
        const { project_name, department, description, status } = req.body;

        // Check for duplicates inside the same organization
        const existingProject = await projectRepository.findActiveByNameInOrg(project_name, organization_id);
        if (existingProject) {
            return res.status(409).json({
                success: false,
                message: "A project with this name already exists in your organization."
            });
        }

        const project = await projectRepository.createProject({
            organization_id,
            project_name,
            department,
            description,
            status: status ? status.toUpperCase() : "ACTIVE",
            created_by
        });

        // Log project creation activity
        await activityRepository.logActivity({
            organization_id,
            project_id: project.project_id,
            user_id: created_by,
            action: "CREATE",
            entity_type: "PROJECT",
            entity_id: project.project_id,
            new_value: {
                project_name: project.project_name,
                department: project.department,
                description: project.description,
                status: project.status
            }
        });

        // Trigger project creation notification
        await notificationService.notifyProjectCreated(req, project);

        return res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: project
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        
        // Parse pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 100) limit = 100; // Hard limit for safety

        const search = req.query.search ? req.query.search.trim() : "";
        const sort = req.query.sort ? req.query.sort.trim() : "created_at";
        const status = req.query.status ? req.query.status.trim().toUpperCase() : "";

        const result = await projectRepository.getProjectsByOrganization(organization_id, {
            page,
            limit,
            search,
            sort,
            status
        });

        return res.status(200).json({
            success: true,
            data: result.projects,
            pagination: {
                totalCount: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving projects:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getProject = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const project = await projectRepository.getProjectById(id, organization_id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error("Error retrieving project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { project_name, department, description, status } = req.body;
        const updated_by = req.user.user_id;

        // Check if project exists and is active
        const project = await projectRepository.getProjectById(id, organization_id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // If the name is changing, check for duplicates inside the organization
        if (project_name && project_name.trim().toLowerCase() !== project.project_name.toLowerCase()) {
            const existingProject = await projectRepository.findActiveByNameInOrg(project_name, organization_id);
            if (existingProject) {
                return res.status(409).json({
                    success: false,
                    message: "A project with this name already exists in your organization."
                });
            }
        }

        const updatedProject = await projectRepository.updateProject(id, organization_id, {
            project_name: project_name || project.project_name,
            department: department !== undefined ? department : project.department,
            description: description !== undefined ? description : project.description,
            status: status ? status.toUpperCase() : project.status,
            updated_by
        });

        // Log project update activity
        await activityRepository.logActivity({
            organization_id,
            project_id: updatedProject.project_id,
            user_id: updated_by,
            action: "UPDATE",
            entity_type: "PROJECT",
            entity_id: updatedProject.project_id,
            old_value: {
                project_name: project.project_name,
                department: project.department,
                description: project.description,
                status: project.status
            },
            new_value: {
                project_name: updatedProject.project_name,
                department: updatedProject.department,
                description: updatedProject.description,
                status: updatedProject.status
            }
        });

        // Trigger project update/archived notifications
        const isArchived = updatedProject.status === "ARCHIVED" && project.status !== "ARCHIVED";
        await notificationService.notifyProjectUpdated(req, updatedProject, isArchived);

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const deleted_by = req.user.user_id;

        const project = await projectRepository.deleteProject(id, organization_id, deleted_by);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Log project delete activity
        await activityRepository.logActivity({
            organization_id,
            project_id: project.project_id,
            user_id: deleted_by,
            action: "DELETE",
            entity_type: "PROJECT",
            entity_id: project.project_id,
            old_value: {
                project_name: project.project_name
            }
        });

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};
