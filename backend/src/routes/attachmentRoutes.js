const express = require("express");
const router = express.Router();
const attachmentController = require("../controllers/attachmentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

// POST /projects/:id/attachments - Upload project attachment (Admin + Manager + Member)
router.post(
    "/projects/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    uploadMiddleware,
    attachmentController.uploadToProject
);

// POST /tasks/:id/attachments - Upload task attachment (Admin + Manager + Member)
router.post(
    "/tasks/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    uploadMiddleware,
    attachmentController.uploadToTask
);

// POST /comments/:id/attachments - Upload comment attachment (Admin + Manager + Member)
router.post(
    "/comments/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    uploadMiddleware,
    attachmentController.uploadToComment
);

// GET /attachments/:id - Download attachment (Org members only)
router.get(
    "/attachments/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    attachmentController.downloadAttachment
);

// GET /projects/:id/attachments - List project attachments (Org members only)
router.get(
    "/projects/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    attachmentController.getProjectAttachments
);

// GET /tasks/:id/attachments - List task attachments (Org members only)
router.get(
    "/tasks/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    attachmentController.getTaskAttachments
);

// GET /comments/:id/attachments - List comment attachments (Org members only)
router.get(
    "/comments/:id/attachments",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    attachmentController.getCommentAttachments
);

// DELETE /attachments/:id - Delete attachment (Uploader + Admin only)
router.delete(
    "/attachments/:id",
    authenticateToken,
    authorizeRoles(1, 2, 3),
    attachmentController.deleteAttachment
);

module.exports = router;
