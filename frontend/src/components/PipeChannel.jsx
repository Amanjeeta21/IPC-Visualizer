
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";
import DataPacket from "./DataPacket";

function PipeChannel({ isWriting, message, bufferMessage, pipeCreated }) {
  return (
    <div className="communication">
      <div className="communication-label">
        <span>fd[1]</span>
        <span>WRITE</span>
      </div>

      <div className="pipe-line">
        <div className="line"></div>

        <DataPacket
          message={message}
          isActive={isWriting}
        />

        <motion.div
          className={`pipe-visual ${bufferMessage ? "buffer-filled" : ""}`}
          animate={{
            scale: bufferMessage ? [1, 1.04, 1] : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="pipe-inner">
            <Database size={18} />

            <span>
              {bufferMessage ? "DATA IN BUFFER" : "PIPE BUFFER"}
            </span>
          </div>
        </motion.div>

        <ArrowRight className="flow-arrow" size={20} />
      </div>

      <div className="communication-label bottom">
        <span>fd[0]</span>
        <span>READ</span>
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
              <span className="status-dot"></span>
              Waiting to be read by child process
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!pipeCreated && (
        <div className="buffer-empty">
          The communication channel has not been created yet.
        </div>
      )}
    </div>
  );
}

export default PipeChannel;
