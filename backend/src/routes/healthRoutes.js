const express = require("express");
const router = express.Router();
const db = require("../config/db");
const packageJson = require("../../package.json");
const { getIo } = require("../config/socket");
const fs = require("fs").promises;
const path = require("path");


// Kubernetes Liveness Probe: simple check if application is responding
router.get("/live", (req, res) => {
    return res.status(200).json({
        success: true,
        status: "ALIVE",
        timestamp: Date.now()
    });
});

// Kubernetes Readiness Probe: checks if external dependency systems are available
router.get("/ready", async (req, res) => {
    const checks = {
        database: "UP",
        storage: "UP"
    };

    // 1. Verify database queries can execute
    try {
        await db.query("SELECT 1");
    } catch (err) {
        checks.database = "DOWN";
    }

    // 2. Verify files storage directory write/access permissions
    try {
        const testPath = path.join(__dirname, "../../uploads");
        await fs.access(testPath);
    } catch (err) {
        checks.storage = "DOWN";
    }

    const isReady = Object.values(checks).every(status => status === "UP");

    return res.status(isReady ? 200 : 503).json({
        success: isReady,
        status: isReady ? "READY" : "NOT_READY",
        checks,
        timestamp: Date.now()
    });
});

// Overall Health Status: returns full subsystem summaries and uptime metrics
router.get("/health", async (req, res) => {
    const health = {
        uptime: process.uptime(),
        version: packageJson.version,
        timestamp: Date.now(),
        checks: {
            database: "UP",
            storage: "UP",
            socket: "UP"
        }
    };

    // 1. Database Check
    try {
        await db.query("SELECT 1");
    } catch (err) {
        health.checks.database = "DOWN";
    }

    // 2. Storage Check
    try {
        const testPath = path.join(__dirname, "../../uploads");
        await fs.access(testPath);
    } catch (err) {
        health.checks.storage = "DOWN";
    }

    // 3. Socket Check
    try {
        getIo();
    } catch (err) {
        health.checks.socket = "DOWN";
    }

    const isHealthy = Object.values(health.checks).every(status => status === "UP");

    return res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        data: health
    });
});

module.exports = router;
