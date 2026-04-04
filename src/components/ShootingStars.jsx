import { useEffect, useState } from "react";

const STAR_COUNT = 7;

function generateStar(id) {
  const w = typeof window !== "undefined" ? window.innerWidth  : 1400;
  const h = typeof window !== "undefined" ? window.innerHeight : 900;

  const spawnZone = Math.floor(Math.random() * 3);
  let startX, startY;

  if (spawnZone === 0) {
    startX = Math.random() * w;
    startY = -20;
  } else if (spawnZone === 1) {
    startX = -30;
    startY = Math.random() * h * 0.6;
  } else {
    startX = w * 0.3 + Math.random() * w * 0.7;
    startY = Math.random() * h * 0.4;
  }

  const angleGroup = Math.floor(Math.random() * 3);
  let angle;
  if      (angleGroup === 0) angle = 8  + Math.random() * 14;  // shallow
  else if (angleGroup === 1) angle = 22 + Math.random() * 18;  // classic diagonal
  else                       angle = 42 + Math.random() * 22;  // steep

  const TRAVEL_OPTIONS = [280, 380, 480, 580];
  const length   = 80 + Math.random() * 160;
  const travel   = TRAVEL_OPTIONS[Math.floor(Math.random() * TRAVEL_OPTIONS.length)];
  const duration = 0.9 + Math.random() * 1.6;
  const delay    = Math.random() * 40; // wide spread so they don't bunch up

  return { id, startX, startY, angle, length, travel, duration, delay };
}

export default function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(Array.from({ length: STAR_COUNT }, (_, i) => generateStar(i)));

    // Refresh one star at a time at a relaxed pace
    const interval = setInterval(() => {
      setStars(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        next[idx] = generateStar(Date.now());
        return next;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 0,
    }}>
      {stars.map((star) => (
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
            style={{
              width: star.length,
              height: "2px",
              animationName: `shootStar_${Math.round(star.travel)}`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              animationTimingFunction: "ease-out",
              animationIterationCount: "infinite",
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
        /* Generate keyframes for a spread of travel distances */
        ${[280, 380, 480, 580].map(t => `
          @keyframes shootStar_${t} {
            0%   { opacity: 0;   transform: translateX(0); }
            6%   { opacity: 1; }
            80%  { opacity: 0.85; }
            100% { opacity: 0;   transform: translateX(${t}px); }
          }
        `).join("")}
      `}</style>
    </div>
  );
}
