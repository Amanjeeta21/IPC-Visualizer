
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
  Workflow,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import PipeChannel from "../components/PipeChannel";
import ExecutionLog from "../components/ExecutionLog";
import ProcessLifecycle from "../components/ProcessLifecycle";

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour12: false });

const getOperation = (message) => {
  const text = message.toLowerCase();

  if (text.includes("fork") || text.includes("child process")) return "FORK";
  if (text.includes("write") || text.includes("parent invokes")) return "WRITE";
  if (text.includes("buffer") || text.includes("bytes placed")) return "BUFFER";
  if (text.includes("read") || text.includes("received by child")) return "READ";
  if (text.includes("pipe") || text.includes("descriptor")) return "PIPE";
  if (text.includes("completed") || text.includes("complete")) return "DONE";

  return "SYSTEM";
};

const createInitialLogs = (message = "Frontend preview initialized") => [
  {
    operation: "SYSTEM",
    type: "info",
    message,
    time: getTime(),
  },
  {
    operation: "PIPE",
    type: "info",
    message: "Waiting for pipe() initialization",
    time: getTime(),
  },
];

function Dashboard() {
  const [message, setMessage] = useState("Hello from Parent Process");

  const [pipeCreated, setPipeCreated] = useState(false);
  const [childCreated, setChildCreated] = useState(false);

  const [isWriting, setIsWriting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [bufferMessage, setBufferMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  const [logs, setLogs] = useState(createInitialLogs);
  const [step, setStep] = useState(0);

  const timersRef = useRef([]);

  const byteCount = new TextEncoder().encode(message).length;

  const clearPendingTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  useEffect(() => {
    return () => clearPendingTimers();
  }, []);

  const addLog = (message, type = "info") => {
    setLogs((previous) => [
      ...previous,
      {
        operation: getOperation(message),
        type,
        message,
        time: getTime(),
      },
    ]);
  };

  // Create the pipe or recreate it after a completed cycle.
  const createPipe = () => {
    const isRecreating = step === 6;

    if (pipeCreated && !isRecreating) return;

    clearPendingTimers();

    if (isRecreating) {
      setChildCreated(false);
      setIsWriting(false);
      setIsReading(false);
      setBufferMessage("");
      setReceivedMessage("");
      setLogs(createInitialLogs("Previous IPC cycle reset"));
    }

    setPipeCreated(true);
    setStep(1);

    addLog("[SIMULATED] pipe(fd) invoked", "info");

    schedule(() => {
      addLog("Pipe created successfully", "success");
      addLog("Read descriptor fd[0] assigned", "info");
      addLog("Write descriptor fd[1] assigned", "info");
    }, 400);
  };

  const forkChild = () => {
    if (!pipeCreated || childCreated || step !== 1) return;

    setChildCreated(true);
    setStep(2);

    addLog("[SIMULATED] fork() invoked by parent", "info");

    schedule(() => {
      addLog("Child process created successfully", "success");
      addLog("Child inherited pipe descriptors", "success");
    }, 500);
  };

  const writeToPipe = () => {
    if (
      !pipeCreated ||
      !childCreated ||
      isWriting ||
      bufferMessage ||
      receivedMessage ||
      !message.trim() ||
      step !== 2
    ) {
      return;
    }

    setIsWriting(true);
    setStep(3);

    addLog("[SIMULATED] Parent invokes write()", "info");

    schedule(() => {
      setBufferMessage(message);
      addLog(
        `${byteCount} UTF-8 bytes placed in simulated pipe buffer`,
        "success"
      );
    }, 1300);

    schedule(() => {
      setIsWriting(false);
      setStep(4);
      addLog("Data is waiting inside the pipe buffer", "success");
    }, 1500);
  };

  const readFromPipe = () => {
    if (
      !childCreated ||
      !bufferMessage ||
      isReading ||
      receivedMessage ||
      step !== 4
    ) {
      return;
    }

    setIsReading(true);
    setStep(5);

    addLog("[SIMULATED] Child invokes read()", "info");

    schedule(() => {
      setBufferMessage((currentBuffer) => {
        setReceivedMessage(currentBuffer);

        const receivedBytes = new TextEncoder().encode(currentBuffer).length;

        addLog(
          `${receivedBytes} UTF-8 bytes received by child`,
          "success"
        );

        return "";
      });
    }, 800);

    schedule(() => {
      setIsReading(false);
      setStep(6);
      addLog("Simulated IPC sequence completed", "success");
    }, 1200);
  };

  const resetSimulation = () => {
    clearPendingTimers();

    setPipeCreated(false);
    setChildCreated(false);

    setIsWriting(false);
    setIsReading(false);

    setBufferMessage("");
    setReceivedMessage("");

    setStep(0);

    setLogs(createInitialLogs("Frontend preview reset"));
  };

  const parentStatus = isWriting
    ? "Writing data..."
    : step >= 4
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
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GitBranch size={21} strokeWidth={2.5} />
          </div>

          <div>
            <h1>IPC-Visualizer</h1>
            <p>Operating Systems Lab</p>
          </div>
        </div>

        <nav className="navigation">
          <Link className="nav-item active" to="/">
            <Workflow size={18} />
            <span>Visualizer</span>
          </Link>

          <Link className="nav-item" to="/documentation">
            <BookOpen size={18} />
            <span>Documentation</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <span className="status-label">SYSTEM STATUS</span>
              <strong>Frontend Preview</strong>
            </div>
          </div>

          <div className="version">IPC-VISUALIZER v1.0.0</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              <span>OS LAB</span>
              <ArrowRight size={13} />
              <span className="current">IPC VISUALIZER</span>
            </div>

            <h2>Inter-Process Communication</h2>
            <p>
              Visualize how two processes communicate using an unnamed pipe.
            </p>
          </div>

          <div className="topbar-actions">
            <div className="live-indicator">
              <span></span>
              FRONTEND PREVIEW
            </div>

            <button className="reset-button" onClick={resetSimulation}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </header>

        <section className="content">
          <div className="hero-grid">
            <div className="hero-card">
              <div className="hero-label">
                <Activity size={15} />
                PIPE() COMMUNICATION
              </div>

              <h3>
                Parent process.
                <br />
                <span>Child process.</span>
                <br />
                One communication channel.
              </h3>

              <p>
                Explore how a parent creates a child process and exchanges
                data through an unnamed pipe.
              </p>

              <div className="hero-tags">
                <span>pipe()</span>
                <span>fork()</span>
                <span>write()</span>
                <span>read()</span>
              </div>
            </div>

            <div className="stats-card">
              <div className="stat">
                <span>PROCESS A</span>
                <strong>PID 1024</strong>
                <small>Parent</small>
              </div>

              <div className="stat">
                <span>PROCESS B</span>
                <strong>{childCreated ? "PID 1025" : "NOT CREATED"}</strong>
                <small>Child process</small>
              </div>

              <div className="stat">
                <span>PIPE STATUS</span>
                <strong className={pipeCreated ? "green" : ""}>
                  {pipeCreated ? "ACTIVE" : "IDLE"}
                </strong>
                <small>{pipeCreated ? "fd[0] / fd[1]" : "Not created"}</small>
              </div>
            </div>
          </div>

          <ProcessLifecycle step={step} />

          <div className="visualization-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PROCESS TOPOLOGY</span>
                <h3>Communication Channel Preview</h3>
              </div>

              <div className="pipe-state">
                <span
                  className={`state-dot ${pipeCreated ? "active-state" : ""}`}
                ></span>
                {pipeCreated ? "PIPE ACTIVE" : "PIPE NOT CREATED"}
              </div>
            </div>

            <div className="process-flow">
              <div className="process-card parent">
                <div className="process-header">
                  <div className="process-icon">
                    <Cpu size={22} />
                  </div>
                  <span className="process-type">PROCESS A</span>
                </div>

                <h4>Parent Process</h4>

                <div className="pid">
                  <span>PID</span>
                  <strong>1024</strong>
                </div>

                <div className="process-status">
                  <span className="status-dot"></span>
                  {parentStatus}
                </div>
              </div>

              <PipeChannel
                isWriting={isWriting}
                message={message}
                bufferMessage={bufferMessage}
                pipeCreated={pipeCreated}
              />

              <div
                className={`process-card child ${
                  childCreated ? "child-created" : "child-pending"
                }`}
              >
                <div className="process-header">
                  <div className="process-icon">
                    {childCreated ? (
                      <Terminal size={22} />
                    ) : (
                      <Users size={22} />
                    )}
                  </div>
                  <span className="process-type">PROCESS B</span>
                </div>

                <h4>Child Process</h4>

                <div className="pid">
                  <span>PID</span>
                  <strong>{childCreated ? "1025" : "—"}</strong>
                </div>

                <div className="process-status">
                  <span className="status-dot"></span>
                  {childStatus}
                </div>
              </div>
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
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <span>CHILD PROCESS RECEIVED</span>
                    <strong>"{receivedMessage}"</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="control-grid">
            <div className="control-card">
              <div className="card-title">
                <div>
                  <span className="section-kicker">MESSAGE PAYLOAD</span>
                  <h3>Send Data Through Pipe</h3>
                </div>

                <span className="byte-count">{byteCount} bytes</span>
              </div>

              <div className="input-wrapper">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={
                    isWriting || !!bufferMessage || !!receivedMessage
                  }
                  placeholder="Enter message..."
                  maxLength={120}
                />

                <div className="input-footer">
                  <span>{message.length}/120 characters</span>
                  <span>UTF-8</span>
                </div>
              </div>

              <div className="control-buttons">
                <button
                  className="primary-button"
                  onClick={createPipe}
                  disabled={pipeCreated && step !== 6}
                >
                  <GitBranch size={17} />
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
                  {childCreated ? "Child Created" : "Fork Child"}
                </button>

                <button
                  className="secondary-button"
                  onClick={writeToPipe}
                  disabled={
                    !childCreated ||
                    isWriting ||
                    !!bufferMessage ||
                    !!receivedMessage ||
                    !message.trim() ||
                    step !== 2
                  }
                >
                  <Send size={16} />
                  Write
                </button>

                <button
                  className="secondary-button"
                  onClick={readFromPipe}
                  disabled={
                    !childCreated ||
                    !bufferMessage ||
                    isReading ||
                    !!receivedMessage ||
                    step !== 4
                  }
                >
                  <Terminal size={16} />
                  Read
                </button>
              </div>
            </div>

            <ExecutionLog logs={logs} />
          </div>

          <div className="preview-notice">
            <span className="status-dot"></span>
            This is a frontend simulation. Actual C system calls will run
            after backend integration.
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
