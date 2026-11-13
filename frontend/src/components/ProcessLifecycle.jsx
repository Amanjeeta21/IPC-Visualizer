
import {
  CheckCircle2,
  CircleDot,
  Lock,
} from "lucide-react";

import "../styles/ipc.css";

const stages = [
  {
    title: "Create Pipe",
    syscall: "pipe()",
    description: "Create read and write descriptors.",
  },
  {
    title: "Fork Child",
    syscall: "fork()",
    description: "Create a child process.",
  },
  {
    title: "Write Data",
    syscall: "write()",
    description: "Parent sends the message.",
  },
  {
    title: "Transfer",
    syscall: "PIPE BUFFER",
    description: "Data waits inside the pipe.",
  },
  {
    title: "Read Data",
    syscall: "read()",
    description: "Child receives the message.",
  },
  {
    title: "Complete",
    syscall: "DONE",
    description: "Communication is complete.",
  },
];

function ProcessLifecycle({ step = 0 }) {
  return (
    <section className="lifecycle-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            PROCESS LIFECYCLE
          </span>

          <h3>Parent–Child Communication Sequence</h3>
        </div>

        <span className="lifecycle-count">
          {step}/6 stages
        </span>
      </div>

      <div className="lifecycle-grid">
        {stages.map((stage, index) => {
          const number = index + 1;
          const completed = step > number;
          const current = step === number;

          return (
            <article
              key={stage.title}
              className={`lifecycle-stage ${
                completed ? "completed" : ""
              } ${current ? "current" : ""}`}
            >
              <div className="lifecycle-stage-top">
                <div className="lifecycle-icon">
                  {completed ? (
                    <CheckCircle2 size={17} />
                  ) : current ? (
                    <CircleDot size={17} />
                  ) : (
                    <Lock size={15} />
                  )}
                </div>

                <span>
                  {String(number).padStart(2, "0")}
                </span>
              </div>

              <strong>{stage.title}</strong>

              <code>{stage.syscall}</code>

              <p>{stage.description}</p>

              <span className="lifecycle-status">
                {completed
                  ? "COMPLETED"
                  : current
                  ? "IN PROGRESS"
                  : "PENDING"}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ProcessLifecycle;
