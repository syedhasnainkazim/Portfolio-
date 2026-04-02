import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollExtras() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setVisible(scrollTop > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "44px", height: "44px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(10,10,18,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          zIndex: 9998,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(59,130,246,0.22)";
          e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)";
          e.currentTarget.style.color = "#60a5fa";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(10,10,18,0.72)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        }}
        aria-label="Back to top"
      >
        <FiArrowUp size={18} />
      </button>
    </>
  );
}
