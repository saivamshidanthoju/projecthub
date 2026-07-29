const express = require("express");
const router = express.Router();
const myWorkController = require("../controllers/myWorkController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/items", authenticateToken, authorizeRoles(1, 2, 3), myWorkController.getItems);
router.post("/items", authenticateToken, authorizeRoles(1, 2, 3), myWorkController.createItem);
router.put("/items/:id", authenticateToken, authorizeRoles(1, 2, 3), myWorkController.updateItem);
router.delete("/items/:id", authenticateToken, authorizeRoles(1, 2, 3), myWorkController.deleteItem);

module.exports = router;
