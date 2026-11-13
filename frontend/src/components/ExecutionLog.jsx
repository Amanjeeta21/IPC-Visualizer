
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Clock3,
  ListChecks,
} from "lucide-react";

function ExecutionLog({ logs = [] }) {
  const containerRef = useRef(null);

  const successCount = logs.filter(
    (log) => log.type === "success"
  ).length;

  const errorCount = logs.filter(
    (log) => log.type === "error"
  ).length;

  const latestLog = logs.length
    ? logs[logs.length - 1]
    : null;

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs.length]);

  return (
    <section className="log-card">
      <div className="card-title">
        <div>
          <h2>Execution Console</h2>
        </div>

        <span className="live-log">
          <span />
          LIVE MONITOR
        </span>
      </div>

      <div
        className="log-summary"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "16px",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <div
          className="log-summary-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <ListChecks size={14} />
          <span>{logs.length} EVENTS</span>
        </div>

        <div
          className="log-summary-item success"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
            color: "#278052",
          }}
        >
          <CheckCircle2 size={14} />
          <span>{successCount} SUCCESS</span>
        </div>

        <div
          className="log-summary-item error"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
            color: "#c24141",
          }}
        >
          <AlertCircle size={14} />
          <span>{errorCount} ERRORS</span>
        </div>
      </div>

      <div
        className="log-container"
        ref={containerRef}
      >
        <AnimatePresence initial={false}>
          {logs.length ? (
            logs.map((log, index) => {
              const type = log.type || "info";

              return (
                <motion.div
                  className={`log-entry ${type}`}
                  key={`${log.time}-${log.operation}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <span className="log-time">
                    {log.time || "--:--:--"}
                  </span>

                  <span className={`log-icon ${type}`}>
                    {type === "success" ? (
                      <CheckCircle2 size={14} />
                    ) : type === "error" ? (
                      <AlertCircle size={14} />
                    ) : (
                      <CircleDot size={14} />
                    )}
                  </span>

                  <div className="log-details">
                    <div className="log-meta">
                      <span className="log-operation">
                        {log.operation || "SYSTEM"}
                      </span>

                      <span
                        className={`log-status ${type}`}
                      >
                        {type.toUpperCase()}
                      </span>
                    </div>

                    <span className="log-message">
                      {log.message}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="log-empty">
              <ListChecks size={25} />

              <strong>Awaiting execution</strong>

              <span>
                Initialize pipe() to begin the process sequence.
              </span>
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
