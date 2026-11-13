
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, Cpu, Database, GitBranch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import ProcessCard from "../components/ProcessCard";
import ControlPanel from "../components/ControlPanel";
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

  const addLog = (operation, logMessage, type = "info") => {
    setLogs((previous) => [
      ...previous,
      {
        operation,
        message: logMessage,
        type,
        time: getTime(),
      },
    ]);
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
    setLogs(createInitialLogs("Initializing a new communication channel"));

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

    addLog("WRITE", "Sending payload to the IPC simulation backend");

    try {
      const result = await runPipeIPC(message);

      if (cycleRef.current !== currentCycle) return;

      if (!result?.success || typeof result.message !== "string") {
        throw new Error("The backend returned an invalid IPC response.");
      }

      setBackendResult(result);
      setIsRequesting(false);

      addLog(
        "BACKEND",
        `Simulation backend acknowledged child PID ${result.childPid}`,
        "success"
      );

      addLog(
        "WRITE",
        `${result.bytesWritten} UTF-8 bytes written to the pipe`,
        "success"
      );

      setIsPacketMoving(true);

      schedule(() => {
        if (cycleRef.current !== currentCycle) return;

        setIsPacketMoving(false);
        setBufferMessage(result.message);
        setStep(4);
        requestLockRef.current = false;

        addLog(
          "BUFFER",
          `Payload stored in pipe buffer (${result.bytesWritten} bytes)`,
          "success"
        );
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

    addLog("READ", "Child process invokes read() on fd[0]");

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
    ? "Sending request..."
    : isPacketMoving
      ? "Transferring data..."
      : bufferMessage || receivedMessage
        ? "Payload sent"
        : pipeCreated
          ? "Ready"
          : "Idle";

  const childStatus = isReading
    ? "Reading from pipe..."
    : receivedMessage
      ? "Message received"
      : bufferMessage
        ? "Waiting for data"
        : childCreated
          ? "Ready"
          : "Not created";

  return (
    <div className="app-shell">
      <main className="main-content">
        <Header onReset={resetSimulation} step={step} />

        <section className="content">
          <div className="dashboard-heading">
            <span className="heading-overline">
              <Activity size={14} />
              INTER-PROCESS COMMUNICATION / SIMULATION
            </span>

            <h1>Pipe IPC Simulator</h1>

            <p>
              Trace how data moves between parent and child processes through
              an unnamed pipe.
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
              <span>PROCESS A / PARENT</span>
              <strong>PID {backendResult?.parentPid ?? 1024}</strong>
              <small>{pipeCreated ? "Initialized" : "Waiting for execution"}</small>
            </div>

            <div className="stat">
              <span>PROCESS B / CHILD</span>
              <strong>
                {childCreated ? `PID ${backendResult?.childPid ?? 1025}` : "NOT CREATED"}
              </strong>
              <small>{childCreated ? "Fork completed" : "Waiting for fork()"}</small>
            </div>

            <div className="stat">
              <span>PIPE CHANNEL</span>
              <strong className={pipeCreated ? "green" : ""}>
                {pipeCreated ? "ACTIVE" : "INACTIVE"}
              </strong>
              <small>{pipeCreated ? "fd[0] / fd[1]" : "No descriptors"}</small>
            </div>

            <div className="stat">
              <span>PAYLOAD SIZE</span>
              <strong>{backendResult ? `${backendResult.bytesWritten} B` : `${byteCount} B`}</strong>
              <small>UTF-8 encoded message</small>
            </div>
          </div>

          <ProcessLifecycle step={step} />

          <section className="visualization-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LIVE PROCESS TOPOLOGY / 01</span>
                <h2>Communication Flow</h2>
              </div>

              <span className={`pipe-state ${pipeCreated ? "active" : ""}`}>
                <span className="state-dot" />
                {pipeCreated ? "CHANNEL ACTIVE" : "CHANNEL INACTIVE"}
              </span>
            </div>

            <div className="process-flow">
              <ProcessCard
                type="parent"
                pid={backendResult?.parentPid ?? 1024}
                status={parentStatus}
                active={isWriting}
                created
              />

              <PipeChannel
                isWriting={isPacketMoving}
                isReading={isReading}
                message={bufferMessage || message}
                bufferMessage={bufferMessage}
                pipeCreated={pipeCreated}
              />

              <ProcessCard
                type="child"
                pid={backendResult?.childPid ?? 1025}
                status={childStatus}
                active={isReading}
                created={childCreated}
              />
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
                    <Database size={19} />
                  </div>

                  <div>
                    <span>CHILD PROCESS / MESSAGE RECEIVED</span>
                    <strong>{receivedMessage}</strong>
                  </div>

                  <span className="received-bytes">
                    {backendResult?.bytesRead ?? 0} BYTES
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <div className="control-grid">
            <ControlPanel
              message={message}
              onMessageChange={setMessage}
              byteCount={byteCount}
              pipeCreated={pipeCreated}
              childCreated={childCreated}
              step={step}
              isWriting={isWriting}
              isReading={isReading}
              isRequesting={isRequesting}
              onCreatePipe={createPipe}
              onForkChild={forkChild}
              onWrite={writeToPipe}
              onRead={readFromPipe}
            />

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
