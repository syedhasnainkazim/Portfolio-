import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loader({ onDone }) {
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFilling(true), 120);
    const t2 = setTimeout(onDone, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        zIndex: 99999,
      }}
    >
      {/* Branded monogram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "monospace",
          fontSize: "clamp(30px, 8vw, 44px)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 45%, #a5b4fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
        }}
      >
        {"{SK}"}
      </motion.div>

      {/* Progress bar */}
      <div style={{
        width: "96px",
        height: "2px",
        background: "rgba(255,255,255,0.07)",
        borderRadius: "999px",
        overflow: "hidden",
      }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: filling ? "100%" : "0%" }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
            borderRadius: "999px",
          }}
        />
      </div>
    </motion.div>
  );
}
