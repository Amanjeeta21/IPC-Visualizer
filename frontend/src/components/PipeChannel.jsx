
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";
import DataPacket from "./DataPacket";

function PipeChannel({
  isWriting,
  isReading,
  message,
  bufferMessage,
  pipeCreated,
}) {
  return (
    <div className="communication">
      <div className="communication-label">
        <span>fd[1]</span>
        <span>PARENT → PIPE</span>
      </div>

      <div className="pipe-line">
        <div className={`pipe-track ${pipeCreated ? "pipe-track-active" : ""}`}>
          <motion.div
            className="pipe-flow-line"
            animate={{
              opacity: pipeCreated ? 1 : 0.35,
            }}
          />
        </div>

        <DataPacket
          message={message}
          isActive={isWriting || isReading}
          direction={isReading ? "reverse" : "forward"}
        />

        <motion.div
          className={`pipe-visual ${bufferMessage ? "buffer-filled" : ""}`}
          animate={{
            scale: bufferMessage ? [1, 1.07, 1] : 1,
          }}
          transition={{ duration: 0.45 }}
        >
          <div className="pipe-inner">
            <Database size={19} />
            <span>{bufferMessage ? "DATA STORED" : "PIPE BUFFER"}</span>
          </div>
        </motion.div>

        <ArrowRight className="pipe-direction-arrow" size={22} />
      </div>

      <div className="communication-label bottom">
        <span>BUFFER</span>
        <span>fd[0] · CHILD</span>
      </div>

      <AnimatePresence>
        {bufferMessage && (
          <motion.div
            className="buffer-content"
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <span className="section-kicker">PIPE BUFFER CONTENTS</span>
            <p>{bufferMessage}</p>
            <span className="buffer-indicator">
              <span className="status-dot" />
              Waiting to be read by child process
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!pipeCreated && (
        <div className="buffer-empty">
          Communication channel not initialized.
        </div>
      )}
    </div>
  );
}

export default PipeChannel;
