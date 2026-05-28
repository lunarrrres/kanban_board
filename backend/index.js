const express = require("express");
const cors = require("cors");

const taskRoutes = require("./src/routes/tasks");
const authRoutes = require("./src/routes/auth");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "https://kanban-board-ashy-three.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow explicitly listed origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
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
