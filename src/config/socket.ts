import { Server } from "http";
import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";

type MessageHandler = (ws: WebSocket, message: string) => void;
type ConnectionHandler = (ws: WebSocket, request: IncomingMessage) => void;
type ErrorHandler = (ws: WebSocket, err: Error) => void;

interface WebSocketServerConfig {
    port?: number;
    path?: string;
    maxPayload?: number;
    pingInterval?: number;
    pingTimeout?: number;
}

export default function createWebSocketServer(config: WebSocketServerConfig) {
    let wss: WebSocketServer;

    // Store active connections
    const clients = new Set<WebSocket>();

    const handleConnection: ConnectionHandler = (ws, request) => {
        clients.add(ws);
        console.log(`New client connected. Total clients: ${clients.size}`);
        console.log(`Connection from: ${request.socket.remoteAddress}`);

        // Setup ping-pong
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
            }
        }, config.pingInterval || 30000);

        // Send welcome message
        ws.send(
            JSON.stringify({
                type: "connection",
                message: "Connected to WebSocket server"
            })
        );

        // Handle client messages
        ws.on("message", (data) => {
            console.log("Received message:", data.toString());
            handleMessage(ws, data.toString());
        });

        // Handle client disconnection
        ws.on("close", () => {
            clients.delete(ws);
            clearInterval(pingInterval);
            console.log(`Client disconnected. Total clients: ${clients.size}`);
        });

        // Handle errors
        ws.on("error", (err) => {
            handleError(ws, err);
        });
    };

    const handleMessage: MessageHandler = (ws, message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log("Processing message:", parsedMessage);

            ws.send(
                JSON.stringify({
                    type: "response",
                    data: parsedMessage,
                    timestamp: new Date().toISOString()
                })
            );
        } catch (err) {
            console.error("Error parsing message:", err);
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Invalid message format"
                })
            );
        }
    };

    const handleError: ErrorHandler = (ws, err) => {
        console.error("WebSocket error:", err);
        ws.send(
            JSON.stringify({
                type: "error",
                message: "Internal server error"
            })
        );
    };

    // Broadcast message to all connected clients
    const broadcast = (message: any) => {
        const messageString = JSON.stringify(message);
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    };

    const initialize = (server?: Server) => {
        wss = new WebSocketServer({
            server: server,
            path: config.path || "/",
            maxPayload: config.maxPayload || 50 * 1024
        });

        wss.on("connection", handleConnection);

        wss.on("error", (error) => {
            console.error("WebSocket Server Error:", error);
        });

        console.log(`WebSocket server available at ws://localhost:8000${config.path || ""}`);
    };

    return {
        initialize,
        broadcast,
        getClients: () => clients.size,
        close: () => wss?.close()
    };
}
