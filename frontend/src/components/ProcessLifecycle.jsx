
import StepIndicator from "./StepIndicator";
import "../styles/ipc.css";

const stages = [
  {
    title: "Create Pipe",
    operation: "pipe()",
    description: "Initialize the read and write descriptors.",
  },
  {
    title: "Fork Child",
    operation: "fork()",
    description: "Create a child process with inherited descriptors.",
  },
  {
    title: "Write Data",
    operation: "write()",
    description: "The parent writes bytes into the pipe.",
  },
  {
    title: "Buffer Data",
    operation: "PIPE BUFFER",
    description: "The message waits inside the channel.",
  },
  {
    title: "Read Data",
    operation: "read()",
    description: "The child retrieves data from the pipe.",
  },
  {
    title: "Complete",
    operation: "DONE",
    description: "The communication cycle is complete.",
  },
];

function ProcessLifecycle({ step = 0 }) {
  const completedCount = Math.max(0, Math.min(step - 1, 5));

  return (
    <section className="lifecycle-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">EXECUTION SEQUENCE / 01—06</span>
          <h3>Process Lifecycle</h3>
        </div>

        <span className="lifecycle-count">
          {String(completedCount).padStart(2, "0")} / 06 COMPLETE
        </span>
      </div>

      <div className="lifecycle-progress">
        <div
          className="lifecycle-progress-fill"
          style={{ width: `${(completedCount / 6) * 100}%` }}
        />
      </div>

      <div className="lifecycle-grid">
        {stages.map((stage, index) => {
          const number = index + 1;
          const status =
            step > number
              ? "completed"
              : step === number
                ? "current"
                : "pending";

          return (
            <StepIndicator
              key={stage.operation}
              number={number}
              title={stage.title}
              operation={stage.operation}
              description={stage.description}
              status={status}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ProcessLifecycle;
