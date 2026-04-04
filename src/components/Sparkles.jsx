import { useState } from "react";

function rand(a, b) { return a + Math.random() * (b - a); }

function generateSparkles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    top:  `${rand(0, 100)}%`,
    size: rand(1, 2.8),
    duration: rand(2, 7),
    delay: rand(0, 10),
    glow: Math.random() > 0.82,
    color: Math.random() > 0.55
      ? `rgba(255,255,255,`
      : Math.random() > 0.5
        ? `rgba(147,197,253,`  // blue-white
        : `rgba(196,181,253,`, // lavender
  }));
}

export default function Sparkles({ count = 80 }) {
  const [sparkles] = useState(() => generateSparkles(count));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: `${s.color}1)`,
            boxShadow: s.glow
              ? `0 0 ${s.size * 3}px ${s.size}px ${s.color}0.7)`
              : "none",
            animationName: s.glow ? "sparkleBright" : "sparkleFaint",
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      <style>{`
        @keyframes sparkleFaint {
          0%, 100% { opacity: 0.08; transform: scale(0.7); }
          50%       { opacity: 0.75; transform: scale(1);   }
        }
        @keyframes sparkleBright {
          0%, 100% { opacity: 0.15; transform: scale(0.6); }
          30%       { opacity: 1;    transform: scale(1.3); }
          60%       { opacity: 0.6;  transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}
