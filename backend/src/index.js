import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./lib/prisma.js";

dotenv.config();
const PORT = process.env.PORT;

// Initialize Express and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Database connection check
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); // Fixed missing slash

// Configure request payload limits
app.use(express.json({ limit: "25mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "25mb" })); // For URL-encoded

app.use(
  express.raw({
    type: "application/octet-stream",
    limit: "25mb",
  })
);

// Server startup
httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDatabaseConnection();
});

// Export for use in socket.js
export { io };
