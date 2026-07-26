const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Protected CRUD Calendar Routes (Admin, Manager, Member all have access)
router.get("/events", authenticateToken, authorizeRoles(1, 2, 3), calendarController.getEvents);
router.post("/events", authenticateToken, authorizeRoles(1, 2, 3), calendarController.createEvent);
router.put("/events/:id", authenticateToken, authorizeRoles(1, 2, 3), calendarController.updateEvent);
router.delete("/events/:id", authenticateToken, authorizeRoles(1, 2, 3), calendarController.deleteEvent);

module.exports = router;
