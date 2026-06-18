import { useState } from "react";

const STAR_COUNT = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? 2 : 4;

function generateStar(id) {
  const w = typeof window !== "undefined" ? window.innerWidth  : 1400;
  const h = typeof window !== "undefined" ? window.innerHeight : 900;

  // Spawn from the top edge or upper-left so streaks fall down-right naturally
  const spawnZone = Math.floor(Math.random() * 3);
  let startX, startY;

  if (spawnZone === 0) {
    startX = Math.random() * w;
    startY = -20;
  } else if (spawnZone === 1) {
    startX = -30;
    startY = Math.random() * h * 0.55;
  } else {
    startX = w * 0.25 + Math.random() * w * 0.75;
    startY = Math.random() * h * 0.35;
  }

  const angleGroup = Math.floor(Math.random() * 3);
  let angle;
  if      (angleGroup === 0) angle = 8  + Math.random() * 14;  // shallow
  else if (angleGroup === 1) angle = 22 + Math.random() * 18;  // classic diagonal
  else                       angle = 42 + Math.random() * 22;  // steep

  const length   = 70 + Math.random() * 150;
  const travel   = 320 + Math.random() * 320;
  const duration = 0.9 + Math.random() * 1.4;
  // Time before this star next appears after finishing — wide, randomized spread
  const restDelay = 2.5 + Math.random() * 8;

  return { id, startX, startY, angle, length, travel, duration, restDelay };
}

// Stagger the initial appearance so they don't all streak at once.
// Built once at module load to keep render pure.
const INITIAL_STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const s = generateStar(`init-${i}-${Date.now()}`);
  return { ...s, restDelay: Math.random() * 6 };
});

export default function ShootingStars() {
  const [stars, setStars] = useState(INITIAL_STARS);

  // When a star finishes its single run, respawn it fresh after a random rest
  const respawn = (slot) => {
    setStars(prev => {
      const next = [...prev];
      next[slot] = generateStar(`${slot}-${Date.now()}-${Math.random()}`);
      return next;
    });
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 0,
    }}>
      {stars.map((star, slot) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top:  star.startY,
            left: star.startX,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <div
            onAnimationEnd={() => respawn(slot)}
            style={{
              width: star.length,
              height: "2px",
              "--travel": `${star.travel}px`,
              animationName: "shootStar",
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.restDelay}s`,
              animationTimingFunction: "ease-out",
              animationIterationCount: 1,
              animationFillMode: "both",
              opacity: 0,
              position: "relative",
            }}
          >
            {/* Trail */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(200,220,255,0.16) 50%, rgba(255,255,255,0.65) 100%)",
              borderRadius: "999px",
            }} />
            {/* Bright head */}
            <div style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 6px 3px rgba(200,220,255,0.9), 0 0 14px 6px rgba(180,210,255,0.45)",
            }} />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shootStar {
          0%   { opacity: 0;   transform: translateX(0); }
          8%   { opacity: 1; }
          75%  { opacity: 0.85; }
          100% { opacity: 0;   transform: translateX(var(--travel)); }
        }
      `}</style>
    </div>
  );
}
