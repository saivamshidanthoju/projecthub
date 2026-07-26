const { Pool } = require("pg");
const metrics = require("../utils/metrics");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = {
    query: (text, params) => {
        metrics.incrementDbQuery();
        return pool.query(text, params);
    },
    pool,
};
console.log("DB module loaded");