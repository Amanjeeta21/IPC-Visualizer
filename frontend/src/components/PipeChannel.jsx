
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Database, Radio } from "lucide-react";
import DataPacket from "./DataPacket";

function PipeChannel({
  isWriting,
  isReading,
  message,
  bufferMessage,
  pipeCreated,
}) {
  const bufferFilled = Boolean(bufferMessage);

  return (
    <div className={`communication ${pipeCreated ? "channel-ready" : ""}`}>
      <div className="communication-label">
        <span>fd[1] / WRITE</span>
        <span>PARENT → PIPE</span>
      </div>

      <div className="pipe-line">
        <div className={`pipe-track ${pipeCreated ? "pipe-track-active" : ""}`}>
          <motion.div
            className="pipe-flow-line"
            animate={{
              opacity: pipeCreated ? 1 : 0.3,
              scaleX: isWriting || isReading ? [0.35, 1] : 1,
            }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div className="pipe-connector left" />
        <div className="pipe-connector right" />

        <DataPacket
          message={message}
          isActive={isWriting || isReading}
          direction={isReading ? "reverse" : "forward"}
        />

        <motion.div
          className={`pipe-visual ${bufferFilled ? "buffer-filled" : ""}`}
          animate={{
            scale: bufferFilled ? [1, 1.045, 1] : 1,
          }}
          transition={{ duration: 0.45 }}
        >
          <div className="pipe-inner">
            <Database size={18} />
            <span>{bufferFilled ? "DATA STORED" : "PIPE BUFFER"}</span>
          </div>

          <div className="buffer-fill-track">
            <motion.div
              className="buffer-fill-level"
              animate={{ width: bufferFilled ? "100%" : "0%" }}
              transition={{ duration: 0.65 }}
            />
          </div>
        </motion.div>

        <ArrowRight className="pipe-direction-arrow" size={20} />
      </div>

      <div className="communication-label bottom">
        <span>BUFFER / MEMORY</span>
        <span>READ / fd[0] → CHILD</span>
      </div>

      <AnimatePresence>
        {bufferFilled && (
          <motion.div
            className="buffer-content"
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="buffer-content-heading">
              <span className="section-kicker">PIPE BUFFER CONTENTS</span>
              <span className="buffer-byte-label">
                {new TextEncoder().encode(bufferMessage).length} BYTES
              </span>
            </div>

            <p>{bufferMessage}</p>

            <span className="buffer-indicator">
              <span className="status-dot" />
              Waiting for read() by child process
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!pipeCreated && (
        <div className="buffer-empty">
          <Radio size={13} />
          Communication channel not initialized
        </div>
      )}
    </div>
  );
}

export default PipeChannel;
