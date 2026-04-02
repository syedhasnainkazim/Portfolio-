import { motion } from "framer-motion";

export default function HeroOrbit({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, pathOffset: 1 }}
      animate={{ opacity: 1, pathOffset: 0 }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          offsetPath: "path('M 200 800 Q 900 400 1200 -200')",
          offsetRotate: "0deg",
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}