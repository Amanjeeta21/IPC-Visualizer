
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  GitBranch,
  RotateCcw,
  Send,
  Terminal,
  Users,
  Workflow,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import PipeChannel from "../components/PipeChannel";
import ExecutionLog from "../components/ExecutionLog";
import ProcessLifecycle from "../components/ProcessLifecycle";
import { runPipeIPC } from "../services/ipcService";

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour12: false });

const createInitialLogs = (message = "Simulation initialized") => [
  {
    operation: "SYSTEM",
    type: "info",
    message,
    time: getTime(),
  },
];

function Dashboard() {
  const [message, setMessage] = useState("Hello from Parent Process");

  const [pipeCreated, setPipeCreated] = useState(false);
  const [childCreated, setChildCreated] = useState(false);

  const [isRequesting, setIsRequesting] = useState(false);
  const [isPacketMoving, setIsPacketMoving] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [bufferMessage, setBufferMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  const [backendResult, setBackendResult] = useState(null);
  const [logs, setLogs] = useState(createInitialLogs);
  const [step, setStep] = useState(0);

  const timersRef = useRef([]);
  const requestLockRef = useRef(false);
  const cycleRef = useRef(0);

  const byteCount = new TextEncoder().encode(message).length;
  const isWriting = isRequesting || isPacketMoving;

  const clearPendingTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timer = setTimeout(() => {
      timersRef.current = timersRef.current.filter(
        (existing) => existing !== timer
      );
      callback();
    }, delay);

    timersRef.current.push(timer);
    return timer;
  };

  useEffect(() => {
    return () => {
      cycleRef.current += 1;
      clearPendingTimers();
    };
  }, []);

  const addLog = (operation, message, type = "info") => {
    setLogs((previous) => [
      ...previous,
      {
        operation,
        message,
        type,
        time: getTime(),
      },
    ]);
  };

  const appendBackendLogs = (backendLogs = []) => {
    const normalizedLogs = backendLogs.map((log) => ({
      operation: log.operation || "BACKEND",
      message: log.description || log.message || "Backend event",
      type:
        log.status === "error"
          ? "error"
          : log.status === "success"
            ? "success"
            : "info",
      time: log.timestamp
        ? new Date(log.timestamp).toLocaleTimeString("en-IN", {
            hour12: false,
          })
        : getTime(),
    }));

    setLogs((previous) => [...previous, ...normalizedLogs]);
  };

  const createPipe = () => {
    if (pipeCreated && step !== 6) return;

    const newCycle = cycleRef.current + 1;
    cycleRef.current = newCycle;

    clearPendingTimers();
    requestLockRef.current = false;

    setChildCreated(false);
    setIsRequesting(false);
    setIsPacketMoving(false);
    setIsReading(false);

    setBufferMessage("");
    setReceivedMessage("");
    setBackendResult(null);

    setPipeCreated(true);
    setStep(1);

    setLogs(createInitialLogs("Creating a new communication channel"));

    addLog("PIPE", "pipe() invoked by parent process");

    schedule(() => {
      if (cycleRef.current !== newCycle) return;

      addLog("PIPE", "Read descriptor fd[0] initialized", "success");
      addLog("PIPE", "Write descriptor fd[1] initialized", "success");
    }, 350);
  };

  const forkChild = () => {
    if (!pipeCreated || childCreated || step !== 1) return;

    setChildCreated(true);
    setStep(2);

    addLog("FORK", "fork() invoked by parent process");

    schedule(() => {
      addLog("FORK", "Child process created successfully", "success");
      addLog("FORK", "Child inherited pipe descriptors", "success");
    }, 350);
  };

  const writeToPipe = async () => {
    // A ref prevents two rapid clicks before React updates the UI.
    if (requestLockRef.current) return;

    if (
      !pipeCreated ||
      !childCreated ||
      step !== 2 ||
      !message.trim() ||
      bufferMessage ||
      receivedMessage
    ) {
      addLog(
        "WRITE",
        "Write could not start. Complete pipe() and fork() first.",
        "error"
      );
      return;
    }

    requestLockRef.current = true;

    const currentCycle = cycleRef.current;

    setIsRequesting(true);
    setIsPacketMoving(false);
    setStep(3);

    addLog("WRITE", "Sending message to the backend simulation");

    try {
      const result = await runPipeIPC(message);

      if (cycleRef.current !== currentCycle) return;

      setBackendResult(result);
      setIsRequesting(false);

      if (!result.message && result.message !== "") {
        throw new Error("The backend returned an invalid message.");
      }

      if (!result.success) {
        throw new Error("Backend IPC simulation was unsuccessful.");
      }

      addLog(
        "BACKEND",
        `Backend confirmed simulated child PID ${result.childPid}`,
        "success"
      );

      addLog(
        "WRITE",
        `${result.bytesWritten} UTF-8 bytes written successfully`,
        "success"
      );

      // Show the packet moving from parent to the pipe buffer.
      setIsPacketMoving(true);

      schedule(() => {
        if (cycleRef.current !== currentCycle) return;

        setIsPacketMoving(false);
        setBufferMessage(result.message);
        setStep(4);
        requestLockRef.current = false;

        addLog(
          "BUFFER",
          "Message is now waiting inside the pipe buffer",
          "success"
        );

        appendBackendLogs(result.logs || []);
      }, 1450);
    } catch (error) {
      if (cycleRef.current !== currentCycle) return;

      requestLockRef.current = false;
      setIsRequesting(false);
      setIsPacketMoving(false);
      setStep(2);

      addLog(
        "WRITE",
        error.message || "Unable to complete the backend request",
        "error"
      );
    }
  };

  const readFromPipe = () => {
    if (
      !childCreated ||
      !bufferMessage ||
      !backendResult ||
      isReading ||
      receivedMessage ||
      step !== 4
    ) {
      return;
    }

    const currentCycle = cycleRef.current;

    setIsReading(true);
    setStep(5);

    addLog("READ", "Child process invokes read()");

    schedule(() => {
      if (cycleRef.current !== currentCycle) return;

      setReceivedMessage(backendResult.message);
      setBufferMessage("");
      setIsReading(false);
      setStep(6);

      addLog(
        "READ",
        `${backendResult.bytesRead} UTF-8 bytes received by child process`,
        "success"
      );

      addLog(
        "DONE",
        "Parent-child communication completed successfully",
        "success"
      );
    }, 1200);
  };

  const resetSimulation = () => {
    cycleRef.current += 1;

    clearPendingTimers();
    requestLockRef.current = false;

    setPipeCreated(false);
    setChildCreated(false);

    setIsRequesting(false);
    setIsPacketMoving(false);
    setIsReading(false);

    setBufferMessage("");
    setReceivedMessage("");
    setBackendResult(null);

    setStep(0);
    setLogs(createInitialLogs("Simulation reset. Ready for a new run."));
  };

  const parentStatus = isRequesting
    ? "Requesting backend..."
    : isPacketMoving
      ? "Transferring data..."
      : bufferMessage || receivedMessage
        ? "Data sent"
        : pipeCreated
          ? "Ready"
          : "Idle";

  const childStatus = isReading
    ? "Reading data..."
    : receivedMessage
      ? "Data received"
      : bufferMessage
        ? "Waiting to read"
        : childCreated
          ? "Ready"
          : "Not created";

  return (
    <div className="app-shell">
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-brand">
            <div className="brand-mark">
              <GitBranch size={21} />
            </div>
            <span>IPC / VISUALIZER</span>
          </div>

          <div className="topbar-actions">
            <div className="live-indicator">
              <span />
              SIMULATION READY
            </div>

            <Link className="documentation-link" to="/documentation">
              <BookOpen size={15} />
              Documentation
            </Link>

            <button className="reset-button" onClick={resetSimulation}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </header>

        <section className="content">
          <div className="dashboard-heading">
            <span className="heading-overline">
              <Activity size={14} />
              INTER-PROCESS COMMUNICATION
            </span>

            <h1>Pipe IPC Simulator</h1>

            <p>
              Explore how a parent process communicates with a child process
              through an unnamed pipe.
            </p>

            <div className="heading-tags">
              <span>pipe()</span>
              <ArrowRight size={13} />
              <span>fork()</span>
              <ArrowRight size={13} />
              <span>write()</span>
              <ArrowRight size={13} />
              <span>read()</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat">
              <span>PARENT PROCESS</span>
              <strong>PID {backendResult?.parentPid ?? 1024}</strong>
              <small>Process A</small>
            </div>

            <div className="stat">
              <span>CHILD PROCESS</span>
              <strong>
                {childCreated
                  ? `PID ${backendResult?.childPid ?? 1025}`
                  : "NOT CREATED"}
              </strong>
              <small>Process B</small>
            </div>

            <div className="stat">
              <span>PIPE STATUS</span>
              <strong className={pipeCreated ? "green" : ""}>
                {pipeCreated ? "ACTIVE" : "INACTIVE"}
              </strong>
              <small>
                {pipeCreated ? "fd[0] / fd[1]" : "Waiting for pipe()"}
              </small>
            </div>

            <div className="stat">
              <span>DATA TRANSFER</span>
              <strong>{backendResult ? `${backendResult.bytesWritten} B` : "—"}</strong>
              <small>UTF-8 payload</small>
            </div>
          </div>

          <ProcessLifecycle step={step} />

          <section className="visualization-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LIVE PROCESS TOPOLOGY</span>
                <h2>Communication Flow</h2>
              </div>

              <span className={`pipe-state ${pipeCreated ? "active" : ""}`}>
                <span className="state-dot" />
                {pipeCreated ? "CHANNEL ACTIVE" : "CHANNEL INACTIVE"}
              </span>
            </div>

            <div className="process-flow">
              <motion.div
                className={`process-card parent ${isWriting ? "process-active" : ""}`}
                animate={{ y: isWriting ? -3 : 0 }}
              >
                <div className="process-header">
                  <div className="process-icon">
                    <Cpu size={23} />
                  </div>
                  <span className="process-type">PROCESS A</span>
                </div>

                <h3>Parent Process</h3>

                <div className="pid">
                  <span>PROCESS ID</span>
                  <strong>{backendResult?.parentPid ?? 1024}</strong>
                </div>

                <div className="process-status">
                  <span className="status-dot" />
                  {parentStatus}
                </div>
              </motion.div>

              <PipeChannel
                isWriting={isPacketMoving}
                isReading={isReading}
                message={bufferMessage || message}
                bufferMessage={bufferMessage}
                pipeCreated={pipeCreated}
              />

              <motion.div
                className={`process-card child ${
                  childCreated ? "child-created" : "child-pending"
                } ${isReading ? "process-active" : ""}`}
                animate={{ y: isReading ? -3 : 0 }}
              >
                <div className="process-header">
                  <div className="process-icon">
                    <Users size={23} />
                  </div>
                  <span className="process-type">PROCESS B</span>
                </div>

                <h3>Child Process</h3>

                <div className="pid">
                  <span>PROCESS ID</span>
                  <strong>
                    {childCreated
                      ? backendResult?.childPid ?? 1025
                      : "—"}
                  </strong>
                </div>

                <div className="process-status">
                  <span className="status-dot" />
                  {childStatus}
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {receivedMessage && (
                <motion.div
                  className="received-message"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                >
                  <div className="received-icon">
                    <CheckCircle2 size={21} />
                  </div>

                  <div>
                    <span>MESSAGE RECEIVED BY CHILD PROCESS</span>
                    <strong>{receivedMessage}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <div className="control-grid">
            <section className="control-card">
              <div className="card-title">
                <div>
                  <span className="section-kicker">INPUT / OUTPUT</span>
                  <h2>Message Payload</h2>
                </div>

                <span className="byte-count">{byteCount} BYTES</span>
              </div>

              <div className="input-wrapper">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={
                    isWriting ||
                    isReading ||
                    !!bufferMessage ||
                    !!receivedMessage
                  }
                  placeholder="Enter a message to send..."
                  maxLength={120}
                />

                <div className="input-footer">
                  <span>{message.length}/120 CHARACTERS</span>
                  <span>UTF-8 ENCODING</span>
                </div>
              </div>

              <div className="control-buttons">
                <button
                  className="primary-button"
                  onClick={createPipe}
                  disabled={pipeCreated && step !== 6}
                >
                  <GitBranch size={16} />
                  {step === 6
                    ? "Recreate Pipe"
                    : pipeCreated
                      ? "Pipe Created"
                      : "Create Pipe"}
                </button>

                <button
                  className="secondary-button"
                  onClick={forkChild}
                  disabled={!pipeCreated || childCreated || step !== 1}
                >
                  <Users size={16} />
                  Fork
                </button>

                <button
                  className="secondary-button"
                  onClick={writeToPipe}
                  disabled={
                    !pipeCreated ||
                    !childCreated ||
                    isWriting ||
                    isReading ||
                    !!bufferMessage ||
                    !!receivedMessage ||
                    !message.trim() ||
                    step !== 2
                  }
                >
                  <Send size={16} />
                  {isRequesting
                    ? "Connecting..."
                    : isPacketMoving
                      ? "Transferring..."
                      : "Write"}
                </button>

                <button
                  className="secondary-button"
                  onClick={readFromPipe}
                  disabled={
                    !childCreated ||
                    !bufferMessage ||
                    !backendResult ||
                    isReading ||
                    !!receivedMessage ||
                    step !== 4
                  }
                >
                  <Terminal size={16} />
                  {isReading ? "Reading..." : "Read"}
                </button>
              </div>

              <div className="control-hint">
                {!pipeCreated
                  ? "Start by creating a communication pipe."
                  : !childCreated
                    ? "Create the child process using fork()."
                    : step === 2
                      ? "The channel is ready. Write your message."
                      : step === 4
                        ? "Data is waiting in the buffer. Read it from the child process."
                        : step === 6
                          ? "Communication completed. Recreate the pipe to run again."
                          : "Simulation in progress..."}
              </div>
            </section>

            <ExecutionLog logs={logs} />
          </div>

          <footer className="simulation-footer">
            <span className="status-dot" />
            Windows-compatible simulation. The backend models pipe(), fork(),
            write(), and read(); it does not create actual OS processes or pipes.
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
