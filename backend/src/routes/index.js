const express = require("express");

const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const commentRoutes = require("./commentRoutes");
const activityRoutes = require("./activityRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const notificationRoutes = require("./notificationRoutes");
const attachmentRoutes = require("./attachmentRoutes");
const calendarRoutes = require("./calendarRoutes");
const teamRoutes = require("./teamRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/", commentRoutes);
router.use("/", activityRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", attachmentRoutes);
router.use("/calendar", calendarRoutes);
router.use("/team", teamRoutes);

module.exports = router;