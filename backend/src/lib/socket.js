import { Server } from "socket.io";

import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

export function getReceiverSocketId(userId) {
  // Convert userId to string for consistent comparison
  return userSocketMap[userId.toString()];
}

// used to store online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != null && userId !== "undefined") {
    // Store userId as string
    userSocketMap[userId.toString()] = socket.id;
    // Emit online users immediately after a new user connects
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle reconnection
  socket.on("reconnect", () => {
    if (userId != null && userId !== "undefined") {
      userSocketMap[userId.toString()] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId != null && userId !== "undefined") {
      delete userSocketMap[userId.toString()];
      // Emit updated online users list after user disconnects
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Cleanup on error
  socket.on("error", () => {
    if (userId != null && userId !== "undefined") {
      delete userSocketMap[userId.toString()];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
