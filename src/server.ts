import dotenv from "dotenv";
import http from "node:http";
import path from "node:path";
import createExpressApp from "./app.js";
import { startCronJobs } from "./config/cronjob.js";
import createWebSocketServer from "./config/socket.js";

// .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// config
startCronJobs();

// create express app
const app = createExpressApp();

// create server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Initialize WebSocket server and attach it to HTTP server
const wsServer = createWebSocketServer({
    path: "/ws",
    pingInterval: 30000,
    maxPayload: 50 * 1024
});

wsServer.initialize(server);

// Start server
server.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
