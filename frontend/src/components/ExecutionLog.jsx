
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Clock3,
  ListChecks,
  Terminal,
} from "lucide-react";

function ExecutionLog({ logs = [] }) {
  const successCount = logs.filter(
    (log) => log.type === "success"
  ).length;

  const errorCount = logs.filter(
    (log) => log.type === "error"
  ).length;

  const latestLog = logs.length ? logs[logs.length - 1] : null;

  return (
    <section className="log-card">
      <div className="card-title">
        <div>
          <span className="section-kicker">SYSTEM OUTPUT</span>
          <h2>Execution Log</h2>
        </div>

        <span className="live-log">
          <span />
          LIVE
        </span>
      </div>

      <div className="log-summary">
        <div className="log-summary-item">
          <ListChecks size={14} />
          <span>{logs.length} EVENTS</span>
        </div>

        <div className="log-summary-item">
          <CheckCircle2 size={14} />
          <span>{successCount} SUCCESS</span>
        </div>

        <div className="log-summary-item">
          <AlertCircle size={14} />
          <span>{errorCount} ERRORS</span>
        </div>
      </div>

      <div className="log-container">
        <AnimatePresence initial={false}>
          {logs.length ? (
            logs.map((log, index) => (
              <motion.div
                className={`log-entry ${log.type || "info"}`}
                key={`${log.time}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <span className="log-time">{log.time || "--:--:--"}</span>

                <span className={`log-icon ${log.type || "info"}`}>
                  {log.type === "success" ? (
                    <CheckCircle2 size={15} />
                  ) : log.type === "error" ? (
                    <AlertCircle size={15} />
                  ) : (
                    <CircleDot size={14} />
                  )}
                </span>

                <div className="log-details">
                  <div className="log-meta">
                    <span className="log-operation">
                      {log.operation || "SYSTEM"}
                    </span>

                    <span className={`log-status ${log.type || "info"}`}>
                      {(log.type || "info").toUpperCase()}
                    </span>
                  </div>

                  <span className="log-message">{log.message}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="log-empty">
              <Terminal size={25} />
              <strong>No execution events</strong>
              <span>Create a pipe to start the simulation.</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="log-footer">
        <span>
          <span className="status-dot" />
          SIMULATION MONITOR
        </span>

        <span>
          <Clock3 size={12} />
          {latestLog ? latestLog.time : "Waiting"}
        </span>
      </div>
    </section>
  );
}

export default ExecutionLog;
    