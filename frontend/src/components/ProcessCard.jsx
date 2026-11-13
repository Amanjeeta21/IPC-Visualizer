
import { Cpu, GitBranch, CircleDot } from "lucide-react";

function ProcessCard({
  type = "parent",
  pid,
  status = "Idle",
  active = false,
  created = false,
}) {
  const isParent = type === "parent";

  return (
    <article
      className={[
        "process-card",
        isParent ? "parent" : "child",
        !created && !isParent ? "child-pending" : "",
        created ? "process-created" : "",
        active ? "process-active" : "",
        !isParent && created ? "child-created" : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="process-card-top">
        <span className="process-role">
          {isParent ? "PROCESS A" : "PROCESS B"}
        </span>

        <span className="process-status">
          <span className="status-dot" />
          {created ? "ACTIVE" : isParent ? "AVAILABLE" : "PENDING"}
        </span>
      </div>

      <div className="process-card-identity">
        <div className="process-card-icon">
          {isParent ? <Cpu size={21} /> : <GitBranch size={21} />}
        </div>

        <div>
          <h3>{isParent ? "Parent Process" : "Child Process"}</h3>
          <span className="process-role">
            {isParent ? "ORIGINAL PROCESS" : "FORKED PROCESS"}
          </span>
        </div>
      </div>

      <div className="pid">
        <span>PROCESS ID</span>
        <strong>{created ? pid : isParent ? pid : "— — —"}</strong>
      </div>

      <div className="process-card-footer">
        <CircleDot size={12} />
        <span>{status}</span>
      </div>
    </article>
  );
}

export default ProcessCard;
