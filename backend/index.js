/**
 * Main Express server for Kanban Board backend
 * Handles task management via REST API
 * Database: JSON file-based storage
 */
import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kanban-board-ashy-three.vercel.app/",
    ],
  }),
);
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./src/routes/tasks");
const authRoutes = require("./src/routes/auth");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// ==================== ERROR HANDLING ====================
app.use(errorHandler);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`✅ Kanban Board Server running on http://localhost:${PORT}`);
  console.log(`📝 API documentation: http://localhost:${PORT}/api/health`);
});

module.exports = app;
