import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const SIZE = 48;
const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollExtras() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);
  const [hovered, setHovered]   = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setVisible(scrollTop > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <>
      {/* ── SCROLL PROGRESS BAR ── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        height: "2px",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
        zIndex: 9999,
        transition: "width 0.1s linear",
        boxShadow: "0 0 8px rgba(139,92,246,0.6)",
      }} />

      {/* ── BACK TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Back to top"
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          borderRadius: "50%",
          border: "none",
          background: hovered ? "rgba(59,130,246,0.18)" : "rgba(10,10,18,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: hovered ? "#60a5fa" : "rgba(255,255,255,0.65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          zIndex: 9998,
          padding: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
          transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, color 0.2s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Progress ring */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          {/* Fill */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke={hovered ? "#60a5fa" : "#3b82f6"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.2s ease" }}
          />
        </svg>

        <FiArrowUp size={16} style={{ position: "relative", zIndex: 1 }} />
      </button>
    </>
  );
}
