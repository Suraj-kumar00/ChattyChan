import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import prisma from "./lib/prisma.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// Database connection check
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("api/message", messageRoutes);

// Server startup
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDatabaseConnection(); // Connect to PostgreSQL
});
