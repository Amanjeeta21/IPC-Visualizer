
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

function DataPacket({ message, isActive, direction = "forward" }) {
  const isReverse = direction === "reverse";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={`data-packet ${isReverse ? "packet-reverse" : ""}`}
          initial={{
            left: isReverse ? "50%" : "5%",
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            left: isReverse ? "95%" : "50%",
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.65 }}
          transition={{
            duration: 1.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Send size={12} />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DataPacket;
