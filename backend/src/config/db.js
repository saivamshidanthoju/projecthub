const { Pool } = require("pg");
const metrics = require("../utils/metrics");


const isLocal = (process.env.DB_HOST || "localhost") === "localhost" || (process.env.DB_HOST || "localhost") === "127.0.0.1";
const ssl = isLocal ? false : { rejectUnauthorized: false };

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Iqoo@2005",
    database: process.env.DB_NAME || "projecthub",
    ssl: ssl || undefined,
});

pool.on("error", (err) => {
    console.error("💥 Unexpected database pool error:", err.message);
});

module.exports = {
    query: (text, params) => {
        metrics.incrementDbQuery();
        return pool.query(text, params);
    },
    pool,
};
console.log("DB module loaded");