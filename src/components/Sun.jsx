import { useEffect, useRef } from "react";

// Fast integer hash — no trig, no sin overhead
function hash(ix, iy, seed) {
  let n = Math.imul(ix, 1664525) + Math.imul(iy, 1013904223) + Math.imul(seed, 22695477);
  n = Math.imul(n ^ (n >>> 13), 1664525) + 1013904223;
  n = n ^ (n >>> 15);
  return (n & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x, y, seed) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    hash(ix,   iy,   seed) * (1 - ux) * (1 - uy) +
    hash(ix+1, iy,   seed) *      ux  * (1 - uy) +
    hash(ix,   iy+1, seed) * (1 - ux) *      uy  +
    hash(ix+1, iy+1, seed) *      ux  *      uy
  );
}

// Fractal Brownian Motion — multi-scale noise for granulation
function fbm(x, y, seed) {
  return (
    smoothNoise(x * 14,  y * 14,  seed)       * 0.500 +
    smoothNoise(x * 29,  y * 29,  seed + 41)  * 0.250 +
    smoothNoise(x * 60,  y * 60,  seed + 83)  * 0.125 +
    smoothNoise(x * 121, y * 121, seed + 127) * 0.0625
  ); // ~0.9375 max, acts as 0..1
}

// Luminance → orange-red SDO color palette
function lumToRgb(lum) {
  if (lum < 0.10) {
    const t = lum / 0.10;
    return [Math.round(t * 62), 0, 0];
  } else if (lum < 0.36) {
    const t = (lum - 0.10) / 0.26;
    return [Math.round(62 + t * 148), Math.round(t * 15), 0];
  } else if (lum < 0.62) {
    const t = (lum - 0.36) / 0.26;
    return [Math.round(210 + t * 45), Math.round(15 + t * 82), 0];
  } else if (lum < 0.82) {
    const t = (lum - 0.62) / 0.20;
    return [255, Math.round(97 + t * 108), Math.round(t * 30)];
  } else {
    const t = Math.min(1, (lum - 0.82) / 0.18);
    return [255, Math.round(205 + t * 50), Math.round(30 + t * 170)];
  }
}

// Active region positions (bright plasma concentrations)
const ACTIVE_REGIONS = [
  { nx: 0.33, ny: 0.29, r: 0.095, intensity: 1.00 },
  { nx: 0.64, ny: 0.36, r: 0.080, intensity: 0.88 },
  { nx: 0.49, ny: 0.57, r: 0.090, intensity: 0.93 },
  { nx: 0.23, ny: 0.53, r: 0.072, intensity: 0.78 },
  { nx: 0.71, ny: 0.64, r: 0.078, intensity: 0.83 },
  { nx: 0.41, ny: 0.75, r: 0.065, intensity: 0.73 },
];

export default function Sun() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = canvas.width;   // 300
    const R = S / 2;

    const imageData = ctx.createImageData(S, S);
    const data = imageData.data;

    for (let py = 0; py < S; py++) {
      for (let px = 0; px < S; px++) {
        const dx = (px - R) / R;
        const dy = (py - R) / R;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1.0) continue;

        const dist = Math.sqrt(d2);
        const nx = px / S;
        const ny = py / S;

        // Two FBM layers at different offsets → complex surface texture
        const g1 = fbm(nx, ny, 0);
        const g2 = fbm(nx + 0.47, ny + 0.29, 55);
        const granulation = g1 * 0.62 + g2 * 0.38;

        // Physical limb darkening: I = 1 - u + u·cos(θ)
        const cosTheta = Math.sqrt(Math.max(0, 1 - d2));
        const limb = Math.pow(1 - 0.70 + 0.70 * cosTheta, 0.82);

        // Bright active region contribution
        let boost = 0;
        for (const ar of ACTIVE_REGIONS) {
          const adx = nx - ar.nx;
          const ady = ny - ar.ny;
          const ad = Math.sqrt(adx * adx + ady * ady) / ar.r;
          if (ad < 1) {
            boost += ar.intensity * Math.pow(1 - ad, 2.5) * 0.58;
          }
        }

        const lum = Math.min(1, (0.20 + granulation * 0.60 + boost) * limb * 1.55);
        const [r, g, b] = lumToRgb(lum);

        // Soft circular edge
        const alpha = dist > 0.96
          ? Math.round(255 * Math.pow((1 - dist) / 0.04, 2))
          : 255;

        const i = (py * S + px) * 4;
        data[i]     = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = alpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <div
      className="sun-wrap"
      style={{
        position: "absolute",
        top: "50%",
        right: "-200px",
        transform: "translateY(-52%)",
        width: "520px",
        height: "520px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Outer atmospheric glow */}
      <div style={{
        position: "absolute",
        inset: "-120px",
        borderRadius: "50%",
        background: `radial-gradient(circle,
          transparent 34%,
          rgba(185,50,0,0.13) 50%,
          rgba(120,22,0,0.07) 67%,
          transparent 82%
        )`,
        filter: "blur(38px)",
        animation: "solarAura 13s ease-in-out infinite",
      }} />

      {/* Canvas clipped to circle, slow solar-rotation spin */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        overflow: "hidden",
      }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            width: "100%",
            height: "100%",
            animation: "solarSpin 220s linear infinite",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Corona glow ring */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        boxShadow: `
          0 0 28px  12px rgba(215, 75, 0, 0.72),
          0 0 75px  32px rgba(170, 40, 0, 0.42),
          0 0 155px 65px rgba(110, 18, 0, 0.20)
        `,
        pointerEvents: "none",
      }} />

      {/* Solar prominences at the limb */}
      <div style={{
        position: "absolute",
        top: "7%", right: "2%",
        width: "58px", height: "74px",
        background: "radial-gradient(ellipse at 40% 88%, rgba(205,52,0,0.78), rgba(165,32,0,0.3) 52%, transparent 80%)",
        borderRadius: "60% 40% 30% 70% / 50% 30% 70% 50%",
        filter: "blur(6px)",
        transformOrigin: "bottom center",
        animation: "flare1 9s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "14%", right: "3%",
        width: "48px", height: "63px",
        background: "radial-gradient(ellipse at 50% 90%, rgba(192,48,0,0.68), rgba(150,28,0,0.27) 56%, transparent 80%)",
        borderRadius: "40% 60% 70% 30%",
        filter: "blur(5px)",
        transformOrigin: "bottom center",
        animation: "flare2 13s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        top: "40%", right: "1%",
        width: "44px", height: "55px",
        background: "radial-gradient(ellipse at 35% 70%, rgba(200,53,0,0.62), rgba(158,33,0,0.23) 56%, transparent 80%)",
        borderRadius: "50% 40% 60% 50%",
        filter: "blur(5px)",
        transformOrigin: "left center",
        animation: "flare3 16s ease-in-out infinite",
      }} />

      <style>{`
        @keyframes solarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes solarAura {
          0%, 100% { opacity: 0.78; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes flare1 {
          0%, 100% { transform: scale(1)   rotate(-5deg);  opacity: 0.70; }
          45%       { transform: scale(1.4) rotate(13deg);  opacity: 1.00; }
        }
        @keyframes flare2 {
          0%, 100% { transform: scale(1)   rotate(5deg);   opacity: 0.55; }
          55%       { transform: scale(1.5) rotate(-12deg); opacity: 0.92; }
        }
        @keyframes flare3 {
          0%, 100% { transform: scale(1)   rotate(0deg);   opacity: 0.50; }
          40%       { transform: scale(1.3) rotate(9deg);   opacity: 0.87; }
        }
      `}</style>
    </div>
  );
}
