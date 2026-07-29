const myWorkRepository = require("../repositories/myWorkRepository");

const getItems = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const rows = await myWorkRepository.getItems(user_id, organization_id);
        
        const data = {
            inbox: [],
            today: [],
            tomorrow: [],
            upcoming: []
        };
        rows.forEach(row => {
            const col = row.column_key;
            if (data[col]) {
                data[col].push({
                    id: row.work_id,
                    title: row.title,
                    assignedUser: row.assigned_user,
                    createdAt: row.created_at
                });
            }
        });

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error retrieving My Work items:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const createItem = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { title, column_key, assigned_user } = req.body;

        if (!title || !column_key) {
            return res.status(400).json({
                success: false,
                message: "Title and column key are required."
            });
        }

        const item = await myWorkRepository.createItem({
            organization_id,
            user_id,
            title,
            column_key,
            assigned_user
        });

        return res.status(201).json({
            success: true,
            message: "Item created successfully.",
            data: {
                id: item.work_id,
                title: item.title,
                assignedUser: item.assigned_user,
                createdAt: item.created_at
            }
        });
    } catch (error) {
        console.error("Error creating My Work item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateItem = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { title, column_key, assigned_user } = req.body;

        const existing = await myWorkRepository.getItemById(id, user_id, organization_id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        const item = await myWorkRepository.updateItem(id, user_id, organization_id, {
            title: title || existing.title,
            column_key: column_key || existing.column_key,
            assigned_user: assigned_user !== undefined ? assigned_user : existing.assigned_user
        });

        return res.status(200).json({
            success: true,
            message: "Item updated successfully.",
            data: {
                id: item.work_id,
                title: item.title,
                assignedUser: item.assigned_user,
                createdAt: item.created_at
            }
        });
    } catch (error) {
        console.error("Error updating My Work item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const item = await myWorkRepository.deleteItem(id, user_id, organization_id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting My Work item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem
};
