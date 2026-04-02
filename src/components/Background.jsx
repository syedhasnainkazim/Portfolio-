import { useEffect, useState } from "react";

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const STAR_COLORS = [
  "#ffffff", "#ffffff", "#ffffff",
  "#e8f4ff", "#ddeeff",  // cool blue-white
  "#fff8e8", "#fff5cc",  // warm yellow-white
];

function generateStars(w, h) {
  return Array.from({ length: 280 }, () => {
    const roll = Math.random();
    let size, twinkleAnim, glow;

    if (roll > 0.97) {
      // bright foreground star
      size = randomBetween(2.2, 3.4);
      twinkleAnim = "twinkle-bright";
      glow = true;
    } else if (roll > 0.84) {
      // medium star
      size = randomBetween(1.1, 2.1);
      twinkleAnim = "twinkle-mid";
      glow = false;
    } else {
      // tiny distant star
      size = randomBetween(0.4, 1.1);
      twinkleAnim = "twinkle-faint";
      glow = false;
    }

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      glow,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      twinkleAnim,
      duration: randomBetween(2.5, 8),
      delay: randomBetween(0, 8),
    };
  });
}

export default function Background() {
  const [stars, setStars] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setStars(generateStars(window.innerWidth, window.innerHeight));
  }, []);

  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 15% 60%, rgba(25,10,70,0.7), transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(10,25,80,0.5), transparent 50%),
          #03000e
        `,
        transform: `translate(${mouse.x * 0.003}px, ${mouse.y * 0.003}px)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: star.color,
            boxShadow: star.glow
              ? `0 0 ${star.size * 4}px ${star.size * 1.5}px rgba(180, 210, 255, 0.55)`
              : "none",
            animationName: star.twinkleAnim,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Deep space nebula tones */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        width: "900px",
        height: "700px",
        background: "radial-gradient(ellipse, rgba(70,30,160,0.07), transparent 70%)",
        filter: "blur(80px)",
        animation: "floatSlow 30s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "0%",
        left: "0%",
        width: "800px",
        height: "600px",
        background: "radial-gradient(ellipse, rgba(15,60,160,0.06), transparent 70%)",
        filter: "blur(100px)",
        animation: "floatSlowReverse 38s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Mouse spotlight */}
      <div style={{
        position: "absolute",
        left: mouse.x - 200,
        top: mouse.y - 200,
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(255,255,255,0.035), transparent 65%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        transition: "left 0.08s linear, top 0.08s linear",
      }} />

      <style>{`
        @keyframes twinkle-faint {
          0%, 100% { opacity: 0.28; transform: scale(1); }
          50%       { opacity: 0.07; transform: scale(0.75); }
        }
        @keyframes twinkle-mid {
          0%, 100% { opacity: 0.65; transform: scale(1); }
          50%       { opacity: 0.18; transform: scale(0.85); }
        }
        @keyframes twinkle-bright {
          0%, 100% { opacity: 1;    transform: scale(1); }
          40%       { opacity: 0.35; transform: scale(0.8); }
        }
        @keyframes floatSlow {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(-55px, 35px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes floatSlowReverse {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(45px, -55px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
