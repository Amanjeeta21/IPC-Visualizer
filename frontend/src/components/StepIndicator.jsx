
import { Check, Circle, Lock } from "lucide-react";

function StepIndicator({
  number,
  title,
  operation,
  description,
  status = "pending",
}) {
  const completed = status === "completed";
  const current = status === "current";

  return (
    <article className={`lifecycle-stage ${status}`}>
      <div className="lifecycle-stage-top">
        <div className="lifecycle-icon">
          {completed ? (
            <Check size={17} />
          ) : current ? (
            <Circle size={15} />
          ) : (
            <Lock size={14} />
          )}
        </div>

        <span>{String(number).padStart(2, "0")}</span>
      </div>

      <strong>{title}</strong>
      <code>{operation}</code>
      <p>{description}</p>

      <span className="lifecycle-status">
        {completed ? "COMPLETED" : current ? "IN PROGRESS" : "PENDING"}
      </span>
    </article>
  );
}

export default StepIndicator;
