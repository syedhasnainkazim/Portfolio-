import { useEffect, useState } from "react";

const STAR_COUNT = 16;

function generateStar(id) {
  const w = typeof window !== "undefined" ? window.innerWidth  : 1400;
  const h = typeof window !== "undefined" ? window.innerHeight : 900;

  // Spawn from any edge or anywhere on screen for full scatter
  const spawnZone = Math.floor(Math.random() * 4); // 0=top, 1=left, 2=right-side top, 3=anywhere
  let startX, startY;

  if (spawnZone === 0) {
    // Spawn along top edge
    startX = Math.random() * w;
    startY = -20;
  } else if (spawnZone === 1) {
    // Spawn along left edge
    startX = -30;
    startY = Math.random() * h * 0.7;
  } else if (spawnZone === 2) {
    // Spawn upper-right quadrant
    startX = w * 0.4 + Math.random() * w * 0.6;
    startY = Math.random() * h * 0.3;
  } else {
    // Fully random position anywhere
    startX = Math.random() * w;
    startY = Math.random() * h * 0.8;
  }

  // Wide angle variety: some nearly horizontal, some steep, some in between
  const angleGroup = Math.floor(Math.random() * 4);
  let angle;
  if      (angleGroup === 0) angle = 5  + Math.random() * 15;  // nearly horizontal
  else if (angleGroup === 1) angle = 20 + Math.random() * 20;  // classic diagonal
  else if (angleGroup === 2) angle = 45 + Math.random() * 25;  // steep
  else                       angle = -5 + Math.random() * 10;  // slight upward then down

  const TRAVEL_OPTIONS = [300, 400, 500, 600, 700, 800];
  const length   = 140 + Math.random() * 260;
  const travel   = TRAVEL_OPTIONS[Math.floor(Math.random() * TRAVEL_OPTIONS.length)];
  const duration = 0.7 + Math.random() * 1.4;
  const delay    = Math.random() * 22;

  return { id, startX, startY, angle, length, travel, duration, delay };
}

export default function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(Array.from({ length: STAR_COUNT }, (_, i) => generateStar(i)));

    // Periodically refresh a random star so new ones keep appearing in new spots
    const interval = setInterval(() => {
      setStars(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        next[idx] = generateStar(Date.now());
        return next;
      });
    }, 3500);

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
              background: "linear-gradient(90deg, transparent 0%, rgba(200,220,255,0.28) 50%, rgba(255,255,255,0.88) 100%)",
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
        ${[300, 400, 500, 600, 700, 800].map(t => `
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
