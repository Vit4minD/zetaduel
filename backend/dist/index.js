"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const gameManager_1 = require("./gameManager");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || "http://localhost:3000",
            "https://zetaduel.vercel.app", // Add your Vercel domain here
            /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "https://zetaduel.vercel.app", // Add your Vercel domain here
        /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Game manager instance
const gameManager = new gameManager_1.GameManager(io);
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    // Handle player joining queue
    socket.on('joinQueue', () => {
        gameManager.addPlayerToQueue(socket);
    });
    // Handle player leaving queue
    socket.on('leaveQueue', () => {
        gameManager.removePlayerFromQueue(socket.id);
    });
    // Handle answer submission
    socket.on('submitAnswer', (data) => {
        gameManager.handleAnswer(socket.id, data.answer);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        gameManager.handleDisconnect(socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`🚀 ZetaDuel server running on port ${PORT}`);
    console.log(`📡 Socket.IO server ready for connections`);
});
//# sourceMappingURL=index.js.map