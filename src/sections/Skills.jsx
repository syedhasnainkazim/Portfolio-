import { BackSide, DoubleSide, CanvasTexture } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls, Stars, Line, Html, Text,
  MeshWobbleMaterial, MeshDistortMaterial,
} from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

// ─── TEXTURE GENERATION ──────────────────────────────────────────────────────

function hashSeed(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h >>> 0);
}
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}
function toHex(r, g, b) {
  const c = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
function brighten(hex, f) {
  const { r, g, b } = hexToRgb(hex);
  return toHex(r * f, g * f, b * f);
}
function mixColor(hex1, hex2, t) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return toHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

function makePlanetTexture(node) {
  const W = 512, H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const s   = hashSeed(node.id);
  const col = node.color;

  if (node.planetType === 'gasGiant') {
    const lt1  = mixColor(col, '#ffffff', 0.50);
    const lt2  = mixColor(col, '#ffffff', 0.28);
    const dk1  = brighten(col, 0.60);
    const dk2  = brighten(col, 0.38);
    const warm = mixColor(col, '#ff6622', 0.40);
    const palette = [lt1, lt2, col, col, dk1, lt1, dk2, col, lt2, dk1, lt1, dk2];

    // base fill
    ctx.fillStyle = col;
    ctx.fillRect(0, 0, W, H);

    // wavy horizontal bands
    const nBands = 16 + (s % 8);
    for (let i = 0; i < nBands; i++) {
      const yFrac  = i / nBands;
      const bandH  = H * (0.025 + ((s * (i + 7) * 11) % 100) / 100 * 0.065);
      const cidx   = (s + i * 5) % palette.length;
      const op     = 0.30 + ((s * i * 13 + 7) % 100) / 100 * 0.50;
      const f1     = 4 + (s % 5);
      const f2     = 7 + (s % 4);

      ctx.beginPath();
      ctx.globalAlpha = op;
      ctx.fillStyle = palette[cidx];

      ctx.moveTo(0, yFrac * H);
      for (let x = 0; x <= W; x += 3) {
        const xf = x / W;
        const w = Math.sin(xf * Math.PI * f1 + yFrac * 9 + i) * 8
                + Math.sin(xf * Math.PI * f2 + i * 1.8)       * 4;
        ctx.lineTo(x, yFrac * H + w);
      }
      for (let x = W; x >= 0; x -= 3) {
        const xf = x / W;
        const w = Math.sin(xf * Math.PI * f1 + yFrac * 9 + i + 0.5) * 8
                + Math.sin(xf * Math.PI * f2 + i * 1.8 + 0.9)        * 4;
        ctx.lineTo(x, yFrac * H + bandH + w);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Great Storm oval
    const sX  = W * (0.22 + (s % 7) * 0.08);
    const sY  = H * (0.32 + (s % 5) * 0.08);
    const sRX = W * (0.072 + (s % 3) * 0.016);
    const sRY = H * 0.058;
    const sg  = ctx.createRadialGradient(sX, sY, 0, sX, sY, sRX * 1.9);
    sg.addColorStop(0, dk2);
    sg.addColorStop(0.35, warm);
    sg.addColorStop(0.75, dk1 + '99');
    sg.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.68;
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(sX, sY, sRX, sRY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Secondary small storm
    const s2X = W * (0.55 + (s % 5) * 0.09);
    const s2Y = H * (0.58 + (s % 4) * 0.08);
    const s2g = ctx.createRadialGradient(s2X, s2Y, 0, s2X, s2Y, W * 0.04);
    s2g.addColorStop(0, warm + 'cc');
    s2g.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = s2g;
    ctx.beginPath();
    ctx.ellipse(s2X, s2Y, W * 0.04, H * 0.032, 0, 0, Math.PI * 2);
    ctx.fill();

  } else if (node.planetType === 'rocky') {
    const lt  = mixColor(col, '#ffffff', 0.38);
    const dk  = brighten(col, 0.35);
    const mid = brighten(col, 0.70);

    // polar gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    lt);
    grad.addColorStop(0.22, col);
    grad.addColorStop(0.55, mid);
    grad.addColorStop(0.8,  col);
    grad.addColorStop(1,    lt);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // large geography blobs
    for (let i = 0; i < 9; i++) {
      const bx = ((s * (i + 1) * 73) % 100) / 100 * W;
      const by = ((s * (i + 1) * 53) % 100) / 100 * H;
      const br = W * (0.07 + ((s * i * 11) % 28) / 100);
      const isLt = (s + i) % 3 === 0;
      const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, (isLt ? lt : dk) + 'bb');
      bg.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.32 + ((s * (i + 3) * 7) % 30) / 100;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(bx, by, br, br * (0.55 + (s + i * 3) % 5 * 0.1), ((s * i) % 314) / 100, 0, Math.PI * 2);
      ctx.fill();
    }

    // craters
    const nC = 20 + (s % 22);
    for (let i = 0; i < nC; i++) {
      const cx = ((s * (i + 1) * 37) % 100) / 100 * W;
      const cy = ((s * (i + 1) * 41) % 100) / 100 * H;
      const cr = 3 + ((s * (i + 1) * 17) % 100) / 100 * 20;
      const cg = ctx.createRadialGradient(cx - cr * 0.25, cy - cr * 0.25, 0, cx, cy, cr);
      cg.addColorStop(0,    dk + 'ee');
      cg.addColorStop(0.55, dk + '88');
      cg.addColorStop(0.85, lt + '55');
      cg.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.48 + ((s * (i + 5) * 11) % 35) / 100;
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (node.planetType === 'icy') {
    const lt = mixColor(col, '#ffffff', 0.58);
    const dk = brighten(col, 0.52);

    // smooth polar gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    lt);
    grad.addColorStop(0.2,  mixColor(col, '#ffffff', 0.22));
    grad.addColorStop(0.5,  col);
    grad.addColorStop(0.8,  mixColor(col, '#ffffff', 0.22));
    grad.addColorStop(1,    lt);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // subtle bands
    for (let i = 0; i < 7; i++) {
      const yf = 0.08 + i / 7 * 0.84;
      ctx.beginPath();
      ctx.globalAlpha = 0.07 + ((s * (i + 2) * 13) % 18) / 100;
      ctx.fillStyle = (i % 2 === 0) ? dk : lt;
      ctx.moveTo(0, yf * H);
      for (let x = 0; x <= W; x += 6) {
        const w = Math.sin(x / W * Math.PI * 3 + i * 1.3) * 3;
        ctx.lineTo(x, yf * H + w);
      }
      for (let x = W; x >= 0; x -= 6) {
        const w = Math.sin(x / W * Math.PI * 3 + i * 1.3) * 3;
        ctx.lineTo(x, (yf + 0.055) * H + w);
      }
      ctx.closePath();
      ctx.fill();
    }

    // cloud wisps
    for (let i = 0; i < 7; i++) {
      const wy  = ((s * (i + 1) * 31) % 80) / 100 * H + H * 0.1;
      const ww  = W * (0.18 + ((s * (i + 1) * 19) % 42) / 100);
      const wx0 = ((s * (i + 1) * 23) % 100) / 100 * Math.max(0, W - ww);
      const wg  = ctx.createLinearGradient(wx0, wy, wx0 + ww, wy);
      wg.addColorStop(0, 'transparent');
      wg.addColorStop(0.25, lt + 'bb');
      wg.addColorStop(0.75, lt + 'bb');
      wg.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.16 + ((s * (i + 3) * 11) % 22) / 100;
      ctx.fillStyle = wg;
      const wh = 2.5 + ((s * (i + 2) * 7) % 7);
      ctx.fillRect(wx0, wy - wh / 2, ww, wh);
    }

  } else if (node.planetType === 'nebula') {
    ctx.fillStyle = '#06040f';
    ctx.fillRect(0, 0, W, H);

    const lt   = mixColor(col, '#ffffff', 0.42);
    const comp = mixColor(col, '#ff88ff', 0.55);

    // swirling cloud blobs
    for (let i = 0; i < 18; i++) {
      const nx = ((s * (i + 1) * 37) % 100) / 100 * W;
      const ny = ((s * (i + 1) * 53) % 100) / 100 * H;
      const nr = W * (0.055 + ((s * (i + 2) * 11) % 38) / 100);
      const nc = (i % 3 === 0) ? lt : (i % 3 === 1) ? col : comp;
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr * 1.7);
      ng.addColorStop(0, nc + 'dd');
      ng.addColorStop(0.5, nc + '66');
      ng.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.14 + ((s * (i + 4) * 13) % 28) / 100;
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.ellipse(nx, ny, nr, nr * (0.45 + (s + i * 3) % 5 * 0.13), ((s * i * 31) % 628) / 100, 0, Math.PI * 2);
      ctx.fill();
    }

    // embedded stars
    for (let i = 0; i < 70; i++) {
      const stx = ((s * (i + 1) * 17) % 100) / 100 * W;
      const sty = ((s * (i + 1) * 23) % 100) / 100 * H;
      const str = 0.5 + ((s * (i + 2) * 7) % 10) / 10 * 1.4;
      ctx.globalAlpha = 0.45 + ((s * i * 11) % 55) / 100;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(stx, sty, str, 0, Math.PI * 2);
      ctx.fill();
    }

    // bright core
    const core = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.38);
    core.addColorStop(0, col + 'aa');
    core.addColorStop(0.5, col + '44');
    core.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.52;
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.globalAlpha = 1;
  const tex = new CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const NODES = [
  { id: "python",     name: "Python",      year: "2019", color: "#60a5fa", isRoot: true,
    size: 0.70, planetType: "gasGiant",  rings: "saturn", hasMoon: true,
    pos: [-10.0,  0.0,  0.0],
    projects: ["FinTrack", "AutoMatch", "Victoria Solutions"] },

  { id: "c",          name: "C",           year: "2019", color: "#a78bfa",
    size: 0.44, planetType: "rocky",    rings: null,
    pos: [ -5.5,  5.5, -3.5],  projects: [] },
  { id: "cpp",        name: "C++",         year: "2020", color: "#c084fc",
    size: 0.50, planetType: "rocky",    rings: null,
    pos: [ -1.5,  7.8,  2.5],  projects: [] },
  { id: "java",       name: "Java",        year: "2020", color: "#e879f9",
    size: 0.46, planetType: "rocky",    rings: null,
    pos: [ -1.5,  4.5, -4.5],  projects: [] },
  { id: "linux",      name: "Linux",       year: "2021", color: "#f472b6",
    size: 0.50, planetType: "rocky",    rings: null,
    pos: [  2.5,  8.0,  3.5],  projects: ["Applied Style NJ"] },
  { id: "git",        name: "Git",         year: "2020", color: "#f97316",
    size: 0.44, planetType: "rocky",    rings: null,
    pos: [  2.5,  3.5,  0.5],
    projects: ["CrypticChat", "Applied Style NJ", "FinTrack", "AutoMatch"] },
  { id: "docker",     name: "Docker",      year: "2023", color: "#38bdf8",
    size: 0.54, planetType: "icy",      rings: "single",
    pos: [  6.5,  6.5, -3.0],  projects: [] },
  { id: "aws",        name: "AWS",         year: "2024", color: "#fcd34d",
    size: 0.60, planetType: "gasGiant", rings: "single",  hasMoon: true,
    pos: [  9.5,  5.5,  2.0],  projects: ["Applied Style NJ"] },

  { id: "html_css",   name: "HTML / CSS",  year: "2019", color: "#34d399",
    size: 0.46, planetType: "icy",      rings: null,
    pos: [ -6.5,  0.8,  3.5],
    projects: ["Applied Style NJ", "CrypticChat", "FinTrack"] },
  { id: "javascript", name: "JavaScript",  year: "2021", color: "#fbbf24",
    size: 0.52, planetType: "gasGiant", rings: null,
    pos: [ -2.5,  1.0, -2.0],  projects: ["Applied Style NJ", "CrypticChat"] },
  { id: "react",      name: "React",       year: "2022", color: "#67e8f9",
    size: 0.58, planetType: "gasGiant", rings: null,      hasMoon: true,
    pos: [  1.5,  2.5,  4.5],
    projects: ["CrypticChat", "FinTrack", "AutoMatch", "Applied Style NJ"] },
  { id: "nodejs",     name: "Node.js",     year: "2022", color: "#4ade80",
    size: 0.48, planetType: "icy",      rings: null,
    pos: [  1.5, -1.2, -4.0],  projects: ["CrypticChat", "FinTrack"] },
  { id: "flask",      name: "Flask",       year: "2023", color: "#2dd4bf",
    size: 0.48, planetType: "rocky",    rings: null,
    pos: [  5.5,  0.0,  3.5],
    projects: ["Applied Style NJ", "AutoMatch", "Gomes Group"] },
  { id: "typescript", name: "TypeScript",  year: "2024", color: "#3b82f6",
    size: 0.46, planetType: "icy",      rings: null,
    pos: [  9.5,  0.8, -2.5],  projects: [] },

  { id: "sql",        name: "SQL",         year: "2020", color: "#f472b6",
    size: 0.48, planetType: "rocky",    rings: null,
    pos: [ -6.0, -5.5,  0.5],  projects: ["FinTrack", "AutoMatch"] },
  { id: "postgresql", name: "PostgreSQL",  year: "2022", color: "#fb923c",
    size: 0.54, planetType: "gasGiant", rings: null,
    pos: [  0.0, -7.0,  3.0],
    projects: ["FinTrack", "AutoMatch", "Gomes Group"] },
  { id: "ml_ai",      name: "ML / AI",     year: "2026", color: "#a5b4fc", isLatest: true,
    size: 0.44, planetType: "nebula",   rings: null,
    pos: [  9.5, -6.0, -2.0],  projects: ["AutoMatch"] },
];

const EDGES = [
  { from: "python",     to: "c"          },
  { from: "python",     to: "html_css"   },
  { from: "python",     to: "sql"        },
  { from: "c",          to: "cpp"        },
  { from: "c",          to: "java"       },
  { from: "cpp",        to: "linux"      },
  { from: "java",       to: "git"        },
  { from: "linux",      to: "docker"     },
  { from: "git",        to: "docker"     },
  { from: "docker",     to: "aws"        },
  { from: "html_css",   to: "javascript" },
  { from: "javascript", to: "react"      },
  { from: "javascript", to: "nodejs"     },
  { from: "nodejs",     to: "flask"      },
  { from: "react",      to: "typescript" },
  { from: "flask",      to: "typescript" },
  { from: "sql",        to: "postgresql" },
  { from: "postgresql", to: "ml_ai"      },
  { from: "flask",      to: "ml_ai"      },
];

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const SEG     = isTouch ? 20 : 40;
const STARS   = isTouch ? 700 : 2400;

// ─── PULSE RING ───────────────────────────────────────────────────────────────
function PulseRing({ color, size }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.55) % 1;
    ref.current.scale.setScalar(1 + t * 2.4);
    ref.current.material.opacity = (1 - t) * 0.5;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[size * 1.55, size * 0.055, 8, 52]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

// ─── SATURN RINGS (3 bands) ───────────────────────────────────────────────────
function SaturnRings({ color, size }) {
  const bands = [
    { inner: 1.42, outer: 1.70, opacity: 0.65 },
    { inner: 1.82, outer: 2.10, opacity: 0.42 },
    { inner: 2.22, outer: 2.46, opacity: 0.24 },
  ];
  return (
    <group rotation={[-Math.PI / 2 + 0.52, 0, 0.28]}>
      {bands.map((b, i) => (
        <mesh key={i}>
          <ringGeometry args={[size * b.inner, size * b.outer, 80]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.10}
            transparent
            opacity={b.opacity}
            roughness={0.92}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── SINGLE RING ─────────────────────────────────────────────────────────────
function SingleRing({ color, size }) {
  return (
    <mesh rotation={[-Math.PI / 2 + 0.52, 0, 0.22]}>
      <ringGeometry args={[size * 1.52, size * 2.35, 80]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12}
        transparent
        opacity={0.50}
        roughness={0.90}
        side={DoubleSide}
      />
    </mesh>
  );
}

// ─── ORBITING MOON ───────────────────────────────────────────────────────────
const MOON_CFG = {
  python: { orbitR: 2.5, speed: 0.55, moonSz: 0.125, tilt: 0.30, color: "#93c5fd" },
  aws:    { orbitR: 2.2, speed: 0.75, moonSz: 0.110, tilt: 0.22, color: "#fde68a" },
  react:  { orbitR: 2.2, speed: 0.65, moonSz: 0.105, tilt: 0.26, color: "#a5f3fc" },
};

function OrbitingMoon({ id }) {
  const cfg     = MOON_CFG[id];
  const moonRef = useRef();
  useFrame((state) => {
    if (!moonRef.current) return;
    const t = state.clock.elapsedTime * cfg.speed;
    moonRef.current.position.x = Math.cos(t) * cfg.orbitR;
    moonRef.current.position.y = Math.sin(t) * cfg.orbitR * cfg.tilt;
    moonRef.current.position.z = Math.sin(t) * cfg.orbitR;
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2 + cfg.tilt * 0.5, 0, 0]}>
        <ringGeometry args={[cfg.orbitR - 0.016, cfg.orbitR + 0.016, 64]} />
        <meshBasicMaterial color={cfg.color} transparent opacity={0.09} side={DoubleSide} />
      </mesh>
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[cfg.moonSz, 14, 14]} />
          <meshStandardMaterial color={cfg.color} emissive={cfg.color} emissiveIntensity={0.22} roughness={0.72} />
        </mesh>
        <mesh>
          <sphereGeometry args={[cfg.moonSz * 2.1, 8, 8]} />
          <meshBasicMaterial color={cfg.color} transparent opacity={0.05} />
        </mesh>
      </group>
    </>
  );
}

// ─── PLANET ──────────────────────────────────────────────────────────────────
function SkillOrb({ node, isHovered, isDimmed, onHover, onLeave }) {
  const orbRef  = useRef();
  const atmoRef = useRef();
  const size    = node.size;
  const rotSpeed = (0.6 / size) * 0.0018;

  // Procedural canvas texture — painted once per node
  const planetTexture = useMemo(() => makePlanetTexture(node), [node]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.rotation.y += rotSpeed;

      const drift  = Math.sin(t * 1.1 + node.pos[0] * 0.28) * 0.014;
      const target = isHovered ? 1.13 + Math.sin(t * 3.0) * 0.02 : 1.0 + drift;
      orbRef.current.scale.setScalar(
        orbRef.current.scale.x + (target - orbRef.current.scale.x) * 0.09
      );

      const mat = orbRef.current.material;
      if (mat) {
        const tE = isHovered ? 0.85 : isDimmed ? 0.02 : 0.20;
        mat.emissiveIntensity += (tE - mat.emissiveIntensity) * 0.08;
        mat.opacity += ((isDimmed ? 0.22 : 1.0) - mat.opacity) * 0.08;
      }
    }
    if (atmoRef.current) {
      const tO = isHovered ? 0.10 : isDimmed ? 0.003 : 0.045;
      atmoRef.current.material.opacity += (tO - atmoRef.current.material.opacity) * 0.08;
    }
  });

  const labelOpacity = isDimmed ? 0.07 : isHovered ? 1.0 : 0.68;

  // Material props shared across all planet types
  const matProps = {
    map:               planetTexture,
    color:             "#ffffff",   // show texture at full saturation
    emissive:          node.color,
    emissiveIntensity: 0.20,
    transparent:       true,
  };

  return (
    <group position={node.pos}>
      {/* Atmospheric rim glow — BackSide makes it visible only on the limb */}
      <mesh>
        <sphereGeometry args={[size * 1.08, 18, 18]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.07} side={BackSide} />
      </mesh>

      {/* Far corona */}
      <mesh ref={atmoRef}>
        <sphereGeometry args={[size * 2.5, 12, 12]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.045} />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={orbRef}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(node); }}
        onPointerLeave={(e) => { e.stopPropagation(); onLeave(); }}
      >
        <sphereGeometry args={[size, SEG, SEG]} />

        {/* Desktop: animated materials; mobile: plain standard for perf */}
        {node.planetType === "gasGiant" && !isTouch && (
          <MeshWobbleMaterial {...matProps} factor={0.055} speed={0.50} roughness={0.52} metalness={0} />
        )}
        {node.planetType === "gasGiant" && isTouch && (
          <meshStandardMaterial {...matProps} roughness={0.52} metalness={0} />
        )}
        {node.planetType === "rocky" && (
          <meshStandardMaterial {...matProps} roughness={0.88} metalness={0} />
        )}
        {node.planetType === "icy" && !isTouch && (
          <MeshDistortMaterial {...matProps} distort={0.035} speed={1.4} roughness={0.18} metalness={0} />
        )}
        {node.planetType === "icy" && isTouch && (
          <meshStandardMaterial {...matProps} roughness={0.18} metalness={0} />
        )}
        {node.planetType === "nebula" && !isTouch && (
          <MeshWobbleMaterial {...matProps} factor={0.20} speed={1.8} roughness={0.06} metalness={0} opacity={0.88} />
        )}
        {node.planetType === "nebula" && isTouch && (
          <meshStandardMaterial {...matProps} roughness={0.06} metalness={0} opacity={0.88} transparent />
        )}
      </mesh>

      {node.rings === "saturn" && <SaturnRings color={node.color} size={size} />}
      {node.rings === "single" && <SingleRing  color={node.color} size={size} />}
      {node.isLatest           && <PulseRing   color={node.color} size={size} />}
      {node.hasMoon            && <OrbitingMoon id={node.id} />}

      {/* Name label */}
      <Text
        position={[0, -(size + 0.52), 0]}
        fontSize={0.24}
        color="#ffffff"
        fillOpacity={labelOpacity}
        anchorX="center"
        anchorY="top"
        outlineWidth={0.016}
        outlineColor="#000000"
        outlineOpacity={labelOpacity * 0.45}
      >
        {node.name}
      </Text>

      {node.isRoot && (
        <Text
          position={[0, size + 0.72, 0]}
          fontSize={0.15}
          color="#93c5fd"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.01}
          outlineColor="#000000"
          letterSpacing={0.12}
        >
          START
        </Text>
      )}

      {isHovered && (
        <Html
          position={[0, size * 2.0 + 0.7, 0]}
          center
          distanceFactor={10}
          zIndexRange={[300, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            background: "rgba(6,6,14,0.93)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            padding: "12px 16px",
            minWidth: "148px",
            maxWidth: "210px",
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${node.color}22`,
            whiteSpace: "nowrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: node.color, boxShadow: `0 0 8px ${node.color}`, flexShrink: 0,
              }} />
              <span style={{ fontWeight: 700, color: "#fff", fontSize: "13.5px",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                {node.name}
              </span>
            </div>
            <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.38)",
              fontFamily: "monospace", marginBottom: node.projects?.length ? "9px" : 0 }}>
              Since {node.year}
            </div>
            {node.projects?.length > 0 && (
              <>
                <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.27)",
                  textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px",
                  fontFamily: "-apple-system, sans-serif" }}>
                  Used in
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {node.projects.map(p => (
                    <span key={p} style={{
                      fontSize: "10px", padding: "2px 7px", borderRadius: "999px",
                      background: `${node.color}1a`, color: node.color,
                      border: `1px solid ${node.color}44`, whiteSpace: "nowrap",
                      fontFamily: "-apple-system, sans-serif",
                    }}>{p}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── SCENE ───────────────────────────────────────────────────────────────────
function Scene() {
  const [hoveredId,  setHoveredId]  = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const connectedIds = useMemo(() => {
    if (!hoveredId) return new Set();
    const s = new Set();
    EDGES.forEach(e => {
      if (e.from === hoveredId) s.add(e.to);
      if (e.to   === hoveredId) s.add(e.from);
    });
    return s;
  }, [hoveredId]);

  return (
    <>
      {/* Strong directional "sun" creates lit side vs. shadow side on planet textures */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[18, 10, 12]} intensity={3.0} color="#fff8f0" />
      <pointLight position={[-14, -6,  8]} intensity={0.55} color="#a78bfa" />
      <pointLight position={[ 10, -8, -6]} intensity={0.40} color="#38bdf8" />

      <Stars radius={95} depth={65} count={STARS} factor={2.8} saturation={0} fade speed={0.32} />

      {EDGES.map((edge, i) => {
        const a      = nodeMap[edge.from];
        const b      = nodeMap[edge.to];
        const isConn = hoveredId && (edge.from === hoveredId || edge.to === hoveredId);
        return (
          <Line
            key={i}
            points={[a.pos, b.pos]}
            color={a.color}
            lineWidth={isConn ? 2.0 : 0.55}
            transparent
            opacity={!hoveredId ? 0.11 : isConn ? 0.88 : 0.022}
          />
        );
      })}

      {NODES.map(node => (
        <SkillOrb
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          isDimmed={!!hoveredId && hoveredId !== node.id && !connectedIds.has(node.id)}
          onHover={n => setHoveredId(n.id)}
          onLeave={() => setHoveredId(null)}
        />
      ))}

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.46}
        onStart={() => setAutoRotate(false)}
        enableZoom={true}
        zoomSpeed={0.5}
        minDistance={12}
        maxDistance={42}
        enablePan={false}
        makeDefault
      />
    </>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
const LEGEND = [
  { label: "Systems & Low-Level", color: "#a78bfa" },
  { label: "Web Development",     color: "#34d399" },
  { label: "Data & Science",      color: "#f472b6" },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ fontFamily: "monospace", fontSize: "13px", color: "#60a5fa",
            letterSpacing: "0.06em", marginBottom: "12px" }}
        >
          {"// how I got here"}
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h1>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          A solar system of skills — each planet a technology, each orbit a connection.{" "}
          {isTouch ? "Drag to explore." : "Drag to rotate · hover a planet to explore."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="skills-canvas-wrap"
          style={{
            marginTop: "28px",
            borderRadius: "20px",
            overflow: "hidden",
            height: "580px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(1,1,8,0.65)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.6), inset 0 0 50px rgba(255,255,255,0.015)",
          }}
        >
          <Canvas
            camera={{ position: [0, 1, 22], fov: 60 }}
            style={{ width: "100%", height: "100%" }}
            dpr={isTouch ? 1 : [1, 1.5]}
          >
            <Scene />
          </Canvas>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center", marginTop: "12px",
            fontSize: "11.5px", color: "rgba(255,255,255,0.20)",
            fontFamily: "monospace", letterSpacing: "0.06em",
          }}
        >
          {isTouch
            ? "⟨ drag to rotate ⟩"
            : "⟨ drag to rotate · scroll to zoom · hover planets to explore ⟩"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          viewport={{ once: true }}
          style={{ marginTop: "24px", display: "flex", alignItems: "center",
            gap: "24px", flexWrap: "wrap" }}
        >
          {LEGEND.map(lane => (
            <div key={lane.label} style={{ display: "flex", alignItems: "center",
              gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.33)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%",
                background: lane.color, boxShadow: `0 0 6px ${lane.color}` }} />
              {lane.label}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "8px",
            fontSize: "12px", color: "#a5b4fc" }}>
            <span style={{ animation: "skillLatestPulse 2s ease-in-out infinite" }}>●</span>
            Currently deepening
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes skillLatestPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </section>
  );
}
