
import express from "express";
import cors from "cors";
import ipcRoutes from "./routes/ipcRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://172.16.0.2:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked this origin: ${origin}`));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IPC Visualizer backend is running.",
    status: "OK",
  });
});

// IPC simulation routes
app.use("/api/ipc", ipcRoutes);

// Invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested API route was not found.",
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log("======================================");
  console.log("       IPC VISUALIZER BACKEND");
  console.log("======================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("IPC:    POST /api/ipc/run");
  console.log("Mode:   Windows-compatible simulation");
  console.log("======================================");
});
