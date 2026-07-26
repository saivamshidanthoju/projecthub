const bcrypt = require("bcryptjs");
const teamRepository = require("../repositories/teamRepository");

const getTeam = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const members = await teamRepository.getTeam(organization_id);

        return res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error("Error retrieving team roster:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const createMember = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { first_name, last_name, email, role_id } = req.body;

        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, and email are required."
            });
        }

        // Check if user already exists
        const existingMembers = await teamRepository.getTeam(organization_id);
        const duplicate = existingMembers.find(m => m.email.toLowerCase() === email.toLowerCase());
        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists in your organization."
            });
        }

        // Hash default password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash("ProjectHub123!", salt);

        const newMember = await teamRepository.createMember({
            organization_id,
            role_id: role_id || 3, // Default to Member
            first_name,
            last_name,
            email,
            password_hash
        });

        return res.status(201).json({
            success: true,
            message: "Team member created successfully.",
            data: newMember
        });
    } catch (error) {
        console.error("Error creating team member:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateMember = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { role_id, is_active } = req.body;

        const member = await teamRepository.getMemberById(id, organization_id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Team member not found."
            });
        }

        const updated = await teamRepository.updateMember(id, organization_id, {
            role_id: role_id !== undefined ? role_id : member.role_id,
            is_active: is_active !== undefined ? is_active : member.is_active
        });

        return res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            data: updated
        });
    } catch (error) {
        console.error("Error updating team member:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteMember = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const member = await teamRepository.getMemberById(id, organization_id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Team member not found."
            });
        }

        // Prevent self-deletion
        if (Number(id) === Number(req.user.user_id)) {
            return res.status(400).json({
                success: false,
                message: "Self-deletion is not permitted."
            });
        }

        await teamRepository.deleteMember(id, organization_id);

        return res.status(200).json({
            success: true,
            message: "Team member removed successfully."
        });
    } catch (error) {
        console.error("Error deleting team member:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getTeam,
    createMember,
    updateMember,
    deleteMember
};
