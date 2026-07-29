const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", authenticateToken, authorizeRoles(1, 2, 3), noteController.getNotes);
router.post("/", authenticateToken, authorizeRoles(1, 2, 3), noteController.createNote);
router.put("/:id", authenticateToken, authorizeRoles(1, 2, 3), noteController.updateNote);
router.delete("/:id", authenticateToken, authorizeRoles(1, 2, 3), noteController.deleteNote);

module.exports = router;
