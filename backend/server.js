import express from "express";
import cors from "cors";

import ipcRoutes from "./routes/ipcRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "IPC Visualizer backend is running",
    status: "OK",
  });
});

app.use("/api/ipc", ipcRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log("       IPC VISUALIZER BACKEND");
  console.log("========================================");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Health check: /api/health");
  console.log("IPC endpoint: POST /api/ipc/run");
  console.log("========================================");
});