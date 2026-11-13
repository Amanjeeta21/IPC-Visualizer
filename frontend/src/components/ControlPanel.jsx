
import {
  GitBranch,
  Users,
  Send,
  Terminal,
  RotateCcw,
} from "lucide-react";

function ControlPanel({
  message,
  onMessageChange,
  byteCount,
  pipeCreated,
  childCreated,
  step,
  isWriting,
  isReading,
  isRequesting,
  onCreatePipe,
  onForkChild,
  onWrite,
  onRead,
}) {
  const disabledInput =
    isWriting || isReading || step >= 4 && step !== 0;

  const hint = !pipeCreated
    ? "Initialize a communication channel before creating processes."
    : !childCreated
      ? "Pipe initialized. Invoke fork() to create the child process."
      : step === 2
        ? "Both processes are ready. Send a payload through the pipe."
        : step === 3
          ? "The parent process is writing data to the communication channel."
          : step === 4
            ? "Payload stored in the buffer. The child can now invoke read()."
            : step === 5
              ? "The child process is retrieving the buffered message."
              : step === 6
                ? "Execution finished. Recreate the pipe to start another cycle."
                : "Simulation is ready.";

  return (
    <section className="control-card">
      <div className="card-title">
        <div>
          <span className="section-kicker">PROCESS CONTROL / INPUT</span>
          <h2>Send a Message</h2>
        </div>

        <span className="byte-count">{byteCount} BYTES</span>
      </div>

      <div className="input-wrapper">
        <div className="payload-label">
          <span>STDIN / MESSAGE PAYLOAD</span>
          <span>MAX 120 CHARS</span>
        </div>

        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          disabled={disabledInput}
          placeholder="Enter the message to send through the pipe..."
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
          onClick={onCreatePipe}
          disabled={pipeCreated && step !== 6}
        >
          {step === 6 ? <RotateCcw size={15} /> : <GitBranch size={15} />}
          {step === 6 ? "Recreate Pipe" : pipeCreated ? "Pipe Created" : "Create Pipe"}
        </button>

        <button
          className="secondary-button"
          onClick={onForkChild}
          disabled={!pipeCreated || childCreated || step !== 1}
        >
          <Users size={15} />
          Fork
        </button>

        <button
          className="secondary-button"
          onClick={onWrite}
          disabled={
            !pipeCreated ||
            !childCreated ||
            isWriting ||
            isReading ||
            step !== 2 ||
            !message.trim()
          }
        >
          <Send size={15} />
          {isRequesting ? "Connecting..." : isWriting ? "Writing..." : "Write"}
        </button>

        <button
          className="secondary-button"
          onClick={onRead}
          disabled={!childCreated || step !== 4 || isReading}
        >
          <Terminal size={15} />
          {isReading ? "Reading..." : "Read"}
        </button>
      </div>

      <div className={`control-hint ${step === 6 ? "hint-complete" : ""}`}>
        <span className="hint-indicator" />
        {hint}
      </div>
    </section>
  );
}

export default ControlPanel;
