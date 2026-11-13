
import express from "express";
import { runPipeIPC } from "../services/ipcService.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message.",
      });
    }

    if (Buffer.byteLength(message, "utf8") > 1023) {
      return res.status(400).json({
        success: false,
        message: "Message must not exceed 1023 UTF-8 bytes.",
      });
    }

    const result = await runPipeIPC(message);

    return res.status(200).json(result);
  } catch (error) {
    console.error("IPC simulation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "IPC simulation failed.",
    });
  }
});

export default router;
