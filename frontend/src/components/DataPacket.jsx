
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

function DataPacket({ message, isActive }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="data-packet"
          initial={{ left: "0%", opacity: 0, scale: 0.8 }}
          animate={{
            left: "100%",
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
          }}
        >
          <Send size={13} />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DataPacket;
