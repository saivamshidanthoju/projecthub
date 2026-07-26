require("dotenv").config();
require("./database/db_setup");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server, app);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});