import { useEffect, useState } from "react";

function rand(a, b) { return a + Math.random() * (b - a); }

// Cross-shaped sparkle: 4 lines radiating from center
function SparkleShape({ size, color }) {
  const half = size / 2;
  const thin = size * 0.12;
  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Vertical bar */}
      <rect x={half - thin / 2} y={0} width={thin} height={size}
        rx={thin / 2} fill={color} />
      {/* Horizontal bar */}
      <rect x={0} y={half - thin / 2} width={size} height={thin}
        rx={thin / 2} fill={color} />
    </svg>
  );
}

function generateSparkles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    top:  `${rand(0, 100)}%`,
    size: rand(6, 18),
    duration: rand(2, 5),
    delay: rand(0, 6),
    color: Math.random() > 0.6
      ? `rgba(165,180,252,${rand(0.5, 0.95)})`   // indigo
      : Math.random() > 0.5
        ? `rgba(147,197,253,${rand(0.5, 0.95)})`  // blue
        : `rgba(255,255,255,${rand(0.55, 1)})`,   // white
  }));
}

export default function Sparkles({ count = 55 }) {
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
            transform: "translate(-50%, -50%) rotate(45deg)",
            animationName: "sparklePop",
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >
          <SparkleShape size={s.size} color={s.color} />
        </div>
      ))}

      <style>{`
        @keyframes sparklePop {
          0%, 100% { opacity: 0;    transform: translate(-50%,-50%) rotate(45deg) scale(0.3); }
          20%       { opacity: 1;    transform: translate(-50%,-50%) rotate(45deg) scale(1);   }
          60%       { opacity: 0.85; transform: translate(-50%,-50%) rotate(45deg) scale(0.9); }
          85%       { opacity: 0;    transform: translate(-50%,-50%) rotate(45deg) scale(0.4); }
        }
      `}</style>
    </div>
  );
}
