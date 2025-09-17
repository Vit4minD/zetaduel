import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './gameManager';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
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
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://zetaduel.vercel.app", // Add your Vercel domain here
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Game manager instance
const gameManager = new GameManager(io);

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
