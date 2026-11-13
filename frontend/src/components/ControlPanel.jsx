
import {
  GitBranch,
  Radio,
  RotateCcw,
  Send,
  Download,
  LoaderCircle,
} from "lucide-react";

function ControlPanel({
  message,
  onMessageChange,
  pipeCreated,
  childCreated,
  step,
  isCreating,
  isWriting,
  isReading,
  onCreatePipe,
  onForkChild,
  onWrite,
  onRead,
}) {
  const completed = step === 6;

  const hint = isCreating
    ? "Creating the pipe and initializing its read/write descriptors."
    : isWriting
      ? "The parent process is transferring data into the pipe."
      : isReading
        ? "The child process is retrieving data from the pipe."
        : completed
          ? "Communication completed. Reset or recreate the pipe to run another simulation."
          : !pipeCreated
            ? "Start by creating a communication pipe."
            : !childCreated
              ? "The pipe is ready. Create a child process using fork()."
              : step === 4
                ? "Data is stored in the buffer. The child can now read it."
                : "Enter a message and execute write() to send data.";

  return (
    <section className="control-card">
      <div className="card-title">
        <div>
          <h2>Execute Operations</h2>
        </div>

        <span className="control-mode">MANUAL MODE</span>
      </div>

      <div className="input-wrapper">
        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Enter a message for the child process..."
          disabled={isCreating || isWriting || isReading || completed}
          maxLength={500}
        />
      </div>

      <div className="control-buttons">
        <button
          type="button"
          className="primary-button"
          onClick={onCreatePipe}
          disabled={isCreating || (pipeCreated && !completed)}
        >
          {isCreating ? (
            <LoaderCircle className="button-spinner" size={14} />
          ) : (
            <Radio size={14} />
          )}
          {isCreating ? "Creating..." : completed ? "Recreate Pipe" : "Create Pipe"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onForkChild}
          disabled={!pipeCreated || childCreated || isCreating || step !== 1}
        >
          <GitBranch size={14} />
          Fork Child
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onWrite}
          disabled={
            !pipeCreated ||
            !childCreated ||
            step !== 2 ||
            !message.trim() ||
            isWriting ||
            isReading
          }
        >
          {isWriting ? (
            <LoaderCircle className="button-spinner" size={14} />
          ) : (
            <Send size={14} />
          )}
          Write
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onRead}
          disabled={!childCreated || step !== 4 || isReading}
        >
          {isReading ? (
            <LoaderCircle className="button-spinner" size={14} />
          ) : (
            <Download size={14} />
          )}
          Read
        </button>
      </div>

      <div className={`control-hint ${completed ? "hint-complete" : ""}`}>
        <span className="hint-indicator" />
        <span>{hint}</span>
      </div>

      {completed && (
        <button
          type="button"
          className="replan-button"
          onClick={onCreatePipe}
        >
          <RotateCcw size={13} />
          Start a new pipe communication
        </button>
      )}
    </section>
  );
}

export default ControlPanel;
