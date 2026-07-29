const noteRepository = require("../repositories/noteRepository");

const getNotes = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const rows = await noteRepository.getNotes(user_id, organization_id);
        const data = rows.map(row => ({
            id: row.note_id,
            title: row.title,
            content: row.content,
            type: row.type,
            createdAt: new Date(row.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        }));

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error retrieving notes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const createNote = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { title, content, type } = req.body;

        const note = await noteRepository.createNote({
            organization_id,
            user_id,
            title,
            content,
            type
        });

        return res.status(201).json({
            success: true,
            message: "Note created successfully.",
            data: {
                id: note.note_id,
                title: note.title,
                content: note.content,
                type: note.type,
                createdAt: new Date(note.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
            }
        });
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;
        const { title, content, type } = req.body;

        const existing = await noteRepository.getNoteById(id, user_id, organization_id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        const note = await noteRepository.updateNote(id, user_id, organization_id, {
            title: title !== undefined ? title : existing.title,
            content: content !== undefined ? content : existing.content,
            type: type || existing.type
        });

        return res.status(200).json({
            success: true,
            message: "Note updated successfully.",
            data: {
                id: note.note_id,
                title: note.title,
                content: note.content,
                type: note.type,
                createdAt: new Date(note.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
            }
        });
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const organization_id = req.user.organization_id;
        const { id } = req.params;

        const note = await noteRepository.deleteNote(id, user_id, organization_id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
