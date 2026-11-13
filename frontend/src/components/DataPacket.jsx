
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";

function DataPacket({
  message = "",
  isActive = false,
  direction = "forward",
}) {
  const isReading = direction === "reverse";

  const startPosition = isReading ? "48%" : "3%";
  const endPosition = isReading ? "97%" : "48%";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={`data-packet ${
            isReading ? "packet-reverse" : "packet-forward"
          }`}
          initial={{
            left: startPosition,
            opacity: 0,
            x: "-50%",
          }}
          animate={{
            left: endPosition,
            opacity: 1,
            x: "-50%",
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15 },
          }}
          transition={{
            left: {
              duration: isReading ? 1.1 : 1.35,
              ease: [0.4, 0, 0.2, 1],
            },
            opacity: {
              duration: 0.2,
            },
          }}
        >
          <span className="data-packet-icon">
            {isReading ? (
              <ArrowRight size={12} />
            ) : (
              <Send size={12} />
            )}
          </span>

          <span className="data-packet-label">
            {message ? message : "DATA"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DataPacket;
