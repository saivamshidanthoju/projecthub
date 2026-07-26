const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const metrics = require("../utils/metrics");

let io;

const initSocket = (server, app) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Share io instance with express app
    app.set("io", io);

    // JWT authentication middleware for sockets during handshake
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers["authorization"];
        if (!token) {
            return next(new Error("Authentication error: Token is required"));
        }

        const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        try {
            const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const { user_id, organization_id } = socket.user;

        // Join tenant-specific room
        const orgRoom = `org_${organization_id}`;
        socket.join(orgRoom);

        // Join user-specific room
        const userRoom = `user_${user_id}`;
        socket.join(userRoom);

        // Update socket active connections metric
        metrics.setSocketConnections(io.engine.clientsCount);
        console.log(`🔌 Socket connected: User ${user_id} joined Org Room: ${orgRoom}, User Room: ${userRoom}`);

        socket.on("disconnect", () => {
            metrics.setSocketConnections(io.engine.clientsCount);
            console.log(`🔌 Socket disconnected: User ${user_id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initSocket,
    getIo
};
