const express = require("express");
const cors = require("cors");

const taskRoutes = require("./src/routes/tasks");
const authRoutes = require("./src/routes/auth");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kanban-board-ashy-three.vercel.app",
    ],
  }),
);

app.use(express.json());

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// ==================== ERROR HANDLING ====================
app.use(errorHandler);

// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
