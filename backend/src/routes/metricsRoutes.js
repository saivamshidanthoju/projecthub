const express = require("express");
const router = express.Router();
const metrics = require("../utils/metrics");

router.get("/metrics", (req, res) => {
    res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    res.status(200).send(metrics.formatPrometheus());
});

module.exports = router;
