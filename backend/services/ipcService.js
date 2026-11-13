
const MAX_MESSAGE_SIZE = 1023;

export async function runPipeIPC(message) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("A valid message is required.");
  }

  const bytes = Buffer.byteLength(message, "utf8");

  if (bytes > MAX_MESSAGE_SIZE) {
    throw new Error(
      `Message exceeds the maximum size of ${MAX_MESSAGE_SIZE} UTF-8 bytes.`
    );
  }

  // Simulated process identifiers, not operating-system PIDs.
  const parentPid = 1024;
  const childPid = 1025;

  const logs = [];
  const steps = [];

  let pipeBuffer = "";
  let receivedMessage = "";

  const addLog = (operation, description, status = "success") => {
    logs.push({
      operation,
      description,
      status,
      timestamp: new Date().toISOString(),
    });
  };

  // Stage 1: pipe()
  const pipe = {
    readDescriptor: 0,
    writeDescriptor: 1,
    active: true,
  };

  steps.push("pipe() created");
  addLog(
    "PIPE",
    "pipe() created successfully. Read and write descriptors initialized."
  );

  // Stage 2: fork()
  const childProcess = {
    pid: childPid,
    parentPid,
    created: true,
  };

  steps.push("fork() created child");
  addLog(
    "FORK",
    `fork() simulated successfully. Child process ${childPid} created.`
  );

  // Stage 3: write()
  pipeBuffer = message;

  const bytesWritten = Buffer.byteLength(pipeBuffer, "utf8");

  steps.push("write() completed");
  addLog(
    "WRITE",
    `Parent process wrote ${bytesWritten} UTF-8 bytes into the pipe.`
  );

  // Stage 4: Pipe buffer transfer
  addLog(
    "BUFFER",
    "Message is now available inside the simulated pipe buffer."
  );

  // Stage 5: read()
  receivedMessage = pipeBuffer;

  const bytesRead = Buffer.byteLength(receivedMessage, "utf8");

  pipeBuffer = "";

  steps.push("read() completed");
  addLog(
    "READ",
    `Child process successfully read ${bytesRead} UTF-8 bytes.`
  );

  // Stage 6: Completion
  pipe.active = false;

  steps.push("IPC communication completed");
  addLog(
    "DONE",
    "Simulated parent-child communication completed successfully."
  );

  return {
    success: true,
    simulation: true,
    message: receivedMessage,
    parentPid,
    childPid,
    bytesWritten,
    bytesRead,
    pipe: {
      created: true,
      readDescriptor: 0,
      writeDescriptor: 1,
      active: false,
    },
    childProcess,
    steps,
    logs,
    rawOutput: logs.map((log) => log.description).join("\n"),
  };
}
