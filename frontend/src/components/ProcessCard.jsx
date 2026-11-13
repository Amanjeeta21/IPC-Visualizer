
import { motion } from "framer-motion";
import { Cpu, Users, Radio } from "lucide-react";

function ProcessCard({
  type = "parent",
  pid = "—",
  status = "Idle",
  active = false,
  created = false,
}) {
  const isParent = type === "parent";
  const Icon = isParent ? Cpu : Users;

  return (
    <motion.article
      className={`process-card ${isParent ? "parent" : "child"} ${
        !isParent && !created ? "child-pending" : ""
      } ${active ? "process-active" : ""} ${created ? "process-created" : ""}`}
      animate={{
        y: active ? -5 : 0,
        scale: active ? 1.015 : 1,
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="process-card-top">
        <div className="process-icon">
          <Icon size={22} />
        </div>

        <span className="process-type">
          {isParent ? "PROCESS A" : "PROCESS B"}
        </span>
      </div>

      <div className="process-card-identity">
        <span className="process-role">
          {isParent ? "SENDER" : "RECEIVER"}
        </span>
        <h3>{isParent ? "Parent Process" : "Child Process"}</h3>
      </div>

      <div className="pid">
        <span>PROCESS ID</span>
        <strong>{created || isParent ? pid : "—"}</strong>
      </div>

      <div className="process-status">
        <span className="status-dot" />
        {status}
      </div>

      <div className="process-card-footer">
        <Radio size={12} />
        {created || isParent ? "PROCESS INITIALIZED" : "AWAITING FORK()"}
      </div>
    </motion.article>
  );
}

export default ProcessCard;
