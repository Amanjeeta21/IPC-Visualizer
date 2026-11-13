
import {
  CheckCircle2,
  CircleDot,
  Lock,
} from "lucide-react";

const stages = [
  {
    title: "Create Pipe",
    syscall: "pipe()",
    description: "Initialize read and write descriptors.",
  },
  {
    title: "Fork Child",
    syscall: "fork()",
    description: "Create the child process.",
  },
  {
    title: "Write Data",
    syscall: "write()",
    description: "Parent sends the message.",
  },
  {
    title: "Buffer Storage",
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
    description: "Communication is completed.",
  },
];

function StepIndicator({ step = 0 }) {
  const progress = Math.min((step / 6) * 100, 100);

  return (
    <section className="lifecycle-card">
      <div className="section-heading">
        <div>
          <h3>Parent–Child Communication Sequence</h3>
        </div>

        <span className="lifecycle-count">
          {step}/6 stages
        </span>
      </div>

      <div className="lifecycle-progress">
        <div
          className="lifecycle-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          padding: "3px 2px 12px",
        }}
      >
        <div
          className="lifecycle-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(135px, 1fr))",
            gridAutoFlow: "column",
            gap: "10px",
            width: "100%",
            minWidth: "900px",
            marginTop: "17px",
          }}
        >
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
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                  minWidth: 0,
                  minHeight: "168px",
                  padding: "13px 12px",
                  boxSizing: "border-box",
                  background: completed
                    ? "#f1f7f3"
                    : current
                      ? "#edf2f8"
                      : "#faf7ef",
                  border: `1px solid ${
                    completed
                      ? "#c8ddcf"
                      : current
                        ? "#8298b5"
                        : "#e1e7ef"
                  }`,
                  borderRadius: "7px",
                  boxShadow: current
                    ? "0 0 0 2px rgba(23, 43, 77, 0.055)"
                    : "none",
                }}
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
      </div>
    </section>
  );
}

export default StepIndicator;
