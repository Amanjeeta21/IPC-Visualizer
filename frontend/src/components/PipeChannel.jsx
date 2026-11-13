
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  Radio,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
  Info,
  Activity,
} from "lucide-react";
import DataPacket from "./DataPacket";
import "../styles/ipc-simulation.css";

const explanations = {
  write: {
    title: "Write end — fd[1]",
    syscall: "write()",
    description:
      "The parent process uses the write descriptor to send data into the pipe. The message enters the communication channel from this end.",
    state: "Parent process",
  },
  buffer: {
    title: "Pipe buffer",
    syscall: "Kernel-managed buffer",
    description:
      "The pipe temporarily stores the data written by the parent process. The child process can retrieve this data using its read descriptor.",
    state: "Intermediate storage",
  },
  read: {
    title: "Read end — fd[0]",
    syscall: "read()",
    description:
      "The child process uses the read descriptor to retrieve the data stored in the pipe. Once the read operation completes, the buffer becomes empty.",
    state: "Child process",
  },
  connection: {
    title: "Communication channel",
    syscall: "pipe()",
    description:
      "The pipe establishes a unidirectional communication channel. Data travels from the write end towards the read end.",
    state: "Parent → Child",
  },
};

function PipeChannel({
  isWriting = false,
  isReading = false,
  isCreating = false,
  message = "",
  bufferMessage = "",
  pipeCreated = false,
  childCreated = false,
}) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  const bufferFilled = Boolean(bufferMessage);
  const activePart = hoveredPart || selectedPart;
  const explanation = activePart ? explanations[activePart] : null;

  const isTransferring = isWriting || isReading;

  const getStatus = () => {
    if (isCreating) return "pipe() — creating communication channel";
    if (isWriting) return "write() — transferring data into pipe";
    if (bufferFilled) return "BUFFER OCCUPIED — waiting for read()";
    if (isReading) return "read() — transferring data to child";
    if (childCreated) return "CHANNEL READY — waiting for data";
    if (pipeCreated) return "PIPE CREATED — waiting for child process";
    return "WAITING — create a pipe to begin";
  };

  const setPart = (part) => {
    setSelectedPart((current) => (current === part ? null : part));
  };

  const handleHover = (part) => setHoveredPart(part);
  const clearHover = () => setHoveredPart(null);

  const dataLength = bufferMessage
    ? new TextEncoder().encode(bufferMessage).length
    : 0;

  const slotCount = 8;
  const filledSlots = bufferFilled
    ? Math.min(slotCount, Math.max(1, Math.ceil(dataLength / 8)))
    : 0;

  return (
    <section className={`communication ${pipeCreated ? "channel-ready" : ""}`}>
      <div className="pipe-status-bar">
        <div className="pipe-status-indicator">
          <motion.span
            className={`pipe-status-dot ${
              isCreating || isTransferring
                ? "status-running"
                : pipeCreated
                  ? "status-ready"
                  : "status-idle"
            }`}
            animate={
              isCreating || isTransferring
                ? { opacity: [1, 0.35, 1] }
                : { opacity: 1 }
            }
            transition={{ duration: 0.8, repeat: isCreating || isTransferring ? Infinity : 0 }}
          />
          <span>{getStatus()}</span>
        </div>

        <span className="pipe-status-mode">
          <Activity size={13} />
          LIVE SIMULATION
        </span>
      </div>

      <div className="communication-label">
        <span>WRITE END · fd[1]</span>
        <span>PARENT PROCESS</span>
      </div>

      <div className={`pipe-line ${isCreating ? "pipe-creating" : ""}`}>
        {/* Parent-side endpoint */}
        <button
          type="button"
          className={`pipe-endpoint write-endpoint ${
            pipeCreated ? "endpoint-active" : ""
          } ${isWriting ? "endpoint-working" : ""}`}
          onMouseEnter={() => handleHover("write")}
          onMouseLeave={clearHover}
          onFocus={() => handleHover("write")}
          onBlur={clearHover}
          onClick={() => setPart("write")}
          aria-label="Explain pipe write end"
        >
          <ArrowUpFromLine size={17} />
          <span>WRITE</span>
        </button>

        {/* Main communication path */}
        <div
          className={`pipe-track-area ${
            pipeCreated ? "track-connected" : ""
          }`}
          onMouseEnter={() => handleHover("connection")}
          onMouseLeave={clearHover}
          onClick={() => setPart("connection")}
          role="button"
          tabIndex={0}
          aria-label="Explain communication channel"
        >
          <div className={`pipe-track ${pipeCreated ? "pipe-track-active" : ""}`}>
            <motion.div
              className="pipe-flow-line"
              animate={{
                opacity: pipeCreated ? 1 : 0.3,
                scaleX: isTransferring ? [0.7, 1] : 1,
              }}
              transition={{
                duration: 0.65,
                repeat: isTransferring ? Infinity : 0,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="pipe-dotted-track" />

          <motion.div
            className="pipe-direction-markers"
            animate={
              isTransferring
                ? { opacity: [0.45, 1, 0.45] }
                : { opacity: pipeCreated ? 1 : 0.35 }
            }
            transition={{ duration: 0.9, repeat: isTransferring ? Infinity : 0 }}
          >
            <ArrowRight size={16} />
            <ArrowRight size={16} />
          </motion.div>

          <DataPacket
            message={message}
            isActive={isWriting || isReading}
            direction={isReading ? "reverse" : "forward"}
          />
        </div>

        {/* Buffer */}
        <button
          type="button"
          className={`pipe-visual ${bufferFilled ? "buffer-filled" : ""} ${
            isWriting || isReading ? "buffer-working" : ""
          }`}
          onMouseEnter={() => handleHover("buffer")}
          onMouseLeave={clearHover}
          onFocus={() => handleHover("buffer")}
          onBlur={clearHover}
          onClick={() => setPart("buffer")}
          aria-label="Explain pipe buffer"
        >
          <div className="pipe-inner">
            <Database size={18} />
            <span>PIPE BUFFER</span>
          </div>

          <div className="buffer-slots">
            {Array.from({ length: slotCount }).map((_, index) => (
              <motion.span
                key={index}
                className={`buffer-slot ${
                  index < filledSlots ? "buffer-slot-filled" : ""
                }`}
                animate={
                  index < filledSlots && isWriting
                    ? { opacity: [0.45, 1, 0.45] }
                    : { opacity: 1 }
                }
                transition={{ duration: 0.8, repeat: isWriting ? Infinity : 0 }}
              />
            ))}
          </div>

          <div className="buffer-fill-track">
            <motion.div
              className="buffer-fill-level"
              animate={{
                width: bufferFilled ? `${(filledSlots / slotCount) * 100}%` : "0%",
              }}
              transition={{ duration: 0.65 }}
            />
          </div>

          <span className="buffer-state">
            {bufferFilled ? "OCCUPIED" : "EMPTY"}
          </span>
        </button>

        {/* Read-side endpoint */}
        <button
          type="button"
          className={`pipe-endpoint read-endpoint ${
            childCreated ? "endpoint-active" : ""
          } ${isReading ? "endpoint-working" : ""}`}
          onMouseEnter={() => handleHover("read")}
          onMouseLeave={clearHover}
          onFocus={() => handleHover("read")}
          onBlur={clearHover}
          onClick={() => setPart("read")}
          aria-label="Explain pipe read end"
        >
          <ArrowDownToLine size={17} />
          <span>READ</span>
        </button>
      </div>

      <div className="communication-label bottom">
        <span>UNIDIRECTIONAL DATA FLOW</span>
        <span>CHILD PROCESS · fd[0]</span>
      </div>

      {/* Persistent buffer contents */}
      <div className={`buffer-content ${bufferFilled ? "buffer-content-active" : ""}`}>
        <div className="buffer-content-heading">
          <span className="buffer-byte-label">
            {bufferFilled ? `${dataLength} BYTES` : "0 BYTES"}
          </span>
        </div>

        <div className="buffer-data-display">
          {bufferFilled ? (
            <>
              <span className="buffer-data-prefix">DATA</span>
              <span className="buffer-data-message">{bufferMessage}</span>
            </>
          ) : (
            <span className="buffer-placeholder">
              No data currently stored in the pipe.
            </span>
          )}
        </div>

        <span className="buffer-indicator">
          <span className={`status-dot ${bufferFilled ? "status-dot-active" : ""}`} />
          {bufferFilled
            ? "Data is waiting to be read by the child process."
            : "Buffer is currently empty."}
        </span>
      </div>

      {/* Contextual explanation card */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            className="pipe-info-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="pipe-info-card-heading">
              <div className="pipe-info-icon">
                <Info size={16} />
              </div>

              <div>
                <h4>{explanation.title}</h4>
              </div>

              <button
                type="button"
                className="pipe-info-close"
                onClick={() => {
                  setSelectedPart(null);
                  setHoveredPart(null);
                }}
                aria-label="Close explanation"
              >
                <X size={16} />
              </button>
            </div>

            <p>{explanation.description}</p>

            <div className="pipe-info-meta">
              <span>
                <strong>OPERATION</strong>
                <code>{explanation.syscall}</code>
              </span>

              <span>
                <strong>ROLE</strong>
                <span>{explanation.state}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!pipeCreated && !isCreating && (
        <div className="buffer-empty">
          <Radio size={13} />
          Communication channel not initialized. Select Create Pipe to begin.
        </div>
      )}
    </section>
  );
}

export default PipeChannel;
