import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDirectory = path.resolve(__dirname, "..");

const executablePath = path.join(
  backendDirectory,
  "ipc",
  "pipe_ipc"
);

function parseOutput(stdout) {
  const result = {
    success: true,
    rawOutput: stdout,
    parentPid: null,
    childPid: null,
    bytesWritten: 0,
    bytesRead: 0,
    message: null,
    steps: [],
  };

  const parentPidMatch = stdout.match(/Parent PID:\s*(\d+)/);
  const childPidMatch = stdout.match(/Child PID:\s*(\d+)/);
  const bytesWrittenMatch = stdout.match(/Bytes written:\s*(\d+)/);
  const bytesReadMatch = stdout.match(/Bytes read:\s*(\d+)/);
  const receivedMessageMatch = stdout.match(
    /Child received:\s*(.*)/
  );

  if (parentPidMatch) {
    result.parentPid = Number(parentPidMatch[1]);
  }

  if (childPidMatch) {
    result.childPid = Number(childPidMatch[1]);
  }

  if (bytesWrittenMatch) {
    result.bytesWritten = Number(bytesWrittenMatch[1]);
  }

  if (bytesReadMatch) {
    result.bytesRead = Number(bytesReadMatch[1]);
  }

  if (receivedMessageMatch) {
    result.message = receivedMessageMatch[1].trim();
  }

  if (stdout.includes("PIPE_CREATED")) {
    result.steps.push("pipe() created");
  }

  if (stdout.includes("CHILD_CREATED")) {
    result.steps.push("fork() created child");
  }

  if (stdout.includes("WRITE_COMPLETED")) {
    result.steps.push("write() completed");
  }

  if (
    stdout.includes("WRITE_COMPLETED") &&
    stdout.includes("READ_COMPLETED")
  ) {
    result.steps.push("data transferred through pipe");
  }

  if (stdout.includes("READ_COMPLETED")) {
    result.steps.push("read() completed");
  }

  if (stdout.includes("IPC_COMPLETED")) {
    result.steps.push("IPC communication completed");
  }

  return result;
}

export async function runPipeIPC(message) {
  try {
    const { stdout, stderr } = await execFileAsync(
      executablePath,
      [message],
      {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
      }
    );

    const result = parseOutput(stdout);

    if (stderr && stderr.trim()) {
      result.stderr = stderr.trim();
    }

    return result;
  } catch (error) {
    const stderr = error.stderr || "";
    const stdout = error.stdout || "";

    const executionError = new Error(
      stderr.trim() ||
      stdout.trim() ||
      error.message ||
      "C IPC program failed."
    );

    executionError.code = error.code;

    throw executionError;
  }
}