const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// Helper to ensure target directories exist
const ensureDir = async (dirPath) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        if (err.code !== "EEXIST") throw err;
    }
};

const generateStoredName = (original_name) => {
    const ext = path.extname(original_name);
    const randomBytes = crypto.randomBytes(16).toString("hex");
    return `${randomBytes}${ext}`;
};

const saveFile = async (file, organization_id) => {
    const storedName = generateStoredName(file.originalname);
    const relativeFolder = `org_${organization_id}`;
    const targetFolder = path.join(UPLOADS_DIR, relativeFolder);

    await ensureDir(targetFolder);

    const storagePath = path.join(targetFolder, storedName);
    await fs.writeFile(storagePath, file.buffer);

    // Return relative storage path (relative to uploads root)
    return {
        stored_name: storedName,
        storage_path: path.join(relativeFolder, storedName).replace(/\\/g, "/")
    };
};

const deleteFile = async (storage_path) => {
    const fullPath = path.join(UPLOADS_DIR, storage_path);
    try {
        // Prevent directory traversal: verify path resolves inside UPLOADS_DIR
        const resolvedPath = path.resolve(fullPath);
        const resolvedUploadsDir = path.resolve(UPLOADS_DIR);
        if (!resolvedPath.startsWith(resolvedUploadsDir)) {
            throw new Error("Directory traversal attempt detected!");
        }

        await fs.unlink(resolvedPath);
        return true;
    } catch (err) {
        console.error("Error deleting file:", err);
        return false;
    }
};

const getFileStream = (storage_path) => {
    const fullPath = path.join(UPLOADS_DIR, storage_path);
    const resolvedPath = path.resolve(fullPath);
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR);
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
        throw new Error("Directory traversal attempt detected!");
    }

    const fsSync = require("fs");
    return fsSync.createReadStream(resolvedPath);
};

module.exports = {
    saveFile,
    deleteFile,
    getFileStream
};
