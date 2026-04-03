import { motion } from "framer-motion";
import Background from "../components/Background";
import ShootingStars from "../components/ShootingStars";

export default function NotFound() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
      <Background />
      <ShootingStars />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 24px" }}>

        {/* Comment label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#60a5fa",
            letterSpacing: "0.06em",
            marginBottom: "20px",
          }}
        >
          {"// error 404"}
        </motion.p>

        {/* Big 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(96px, 22vw, 180px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            background: "linear-gradient(140deg, #ffffff 20%, #93c5fd 55%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.42)",
            marginBottom: "40px",
            maxWidth: "320px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          This page drifted into deep space.<br />Let's get you back.
        </motion.p>

        {/* Home button */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          whileHover={{ y: -2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            borderRadius: "12px",
            border: "1px solid rgba(99,102,241,0.5)",
            background: "rgba(99,102,241,0.16)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 20px rgba(99,102,241,0.2)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(99,102,241,0.28)";
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(99,102,241,0.16)";
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
          }}
        >
          ← Back to home
        </motion.a>
      </div>
    </div>
  );
}
