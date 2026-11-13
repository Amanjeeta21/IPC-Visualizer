import express from "express";
import { runPipeIPC } from "../services/ipcService.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    if (message.length > 1023) {
      return res.status(400).json({
        success: false,
        message: "Message must be 1023 characters or fewer.",
      });
    }

    const result = await runPipeIPC(message);

    return res.status(200).json(result);
  } catch (error) {
    console.error("IPC route error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to execute IPC program.",
    });
  }
});

export default router;