import { motion } from "framer-motion";

// ─── COORDINATE SPACE ────────────────────────────────────────────────────────
const W = 920;
const H = 480;

// ─── LANE DEFINITIONS ────────────────────────────────────────────────────────
const LANES = [
  { label: "Systems & Low-Level", color: "#a78bfa", labelY: 10,  lineY: null },
  { label: "Web Development",     color: "#34d399", labelY: 196, lineY: 188  },
  { label: "Data & Science",      color: "#f472b6", labelY: 363, lineY: 355  },
];

// ─── NODES ───────────────────────────────────────────────────────────────────
// Paired nodes that share an x column are spread 80px apart vertically
// so their name+year labels never overlap each other or the paths.
const NODES = [
  // ROOT — left edge, vertically centered in Web lane
  { id: "python",     name: "Python",      year: "2019", x: 45,  y: 270, color: "#60a5fa", isRoot: true },

  // Systems lane  (y ≈ 68–148)
  { id: "c",          name: "C",           year: "2019", x: 180, y: 108, color: "#a78bfa" },
  { id: "cpp",        name: "C++",         year: "2020", x: 315, y: 68,  color: "#c084fc" },
  { id: "java",       name: "Java",        year: "2020", x: 315, y: 148, color: "#e879f9" },
  { id: "linux",      name: "Linux",       year: "2021", x: 460, y: 68,  color: "#f472b6" },
  { id: "git",        name: "Git",         year: "2020", x: 460, y: 148, color: "#f97316" },
  { id: "docker",     name: "Docker",      year: "2023", x: 610, y: 108, color: "#38bdf8" },
  { id: "aws",        name: "AWS",         year: "2024", x: 762, y: 108, color: "#fcd34d" },

  // Web lane  (y ≈ 235–315)  — react/nodejs spread to 80px gap
  { id: "html_css",   name: "HTML / CSS",  year: "2019", x: 195, y: 270, color: "#34d399" },
  { id: "javascript", name: "JavaScript",  year: "2021", x: 338, y: 258, color: "#fbbf24" },
  { id: "react",      name: "React",       year: "2022", x: 480, y: 235, color: "#38bdf8" },
  { id: "nodejs",     name: "Node.js",     year: "2022", x: 480, y: 315, color: "#4ade80" },
  { id: "flask",      name: "Flask",       year: "2023", x: 624, y: 295, color: "#2dd4bf" },
  { id: "typescript", name: "TypeScript",  year: "2024", x: 762, y: 258, color: "#3b82f6" },

  // Data lane  (y ≈ 412–430)
  { id: "sql",        name: "SQL",         year: "2020", x: 195, y: 410, color: "#f472b6" },
  { id: "postgresql", name: "PostgreSQL",  year: "2022", x: 347, y: 422, color: "#fb923c" },
  { id: "ml_ai",      name: "ML / AI",     year: "2026", x: 762, y: 410, color: "#a5b4fc", isLatest: true },
];

// ─── EDGES ───────────────────────────────────────────────────────────────────
const EDGES = [
  // Python branches into three lanes
  { from: "python",     to: "c"          },
  { from: "python",     to: "html_css"   },
  { from: "python",     to: "sql"        },
  // Systems lane
  { from: "c",          to: "cpp"        },
  { from: "c",          to: "java"       },
  { from: "cpp",        to: "linux"      },
  { from: "java",       to: "git"        },
  { from: "linux",      to: "docker"     },
  { from: "git",        to: "docker"     },
  { from: "docker",     to: "aws"        },
  // Web lane
  { from: "html_css",   to: "javascript" },
  { from: "javascript", to: "react"      },
  { from: "javascript", to: "nodejs"     },
  { from: "nodejs",     to: "flask"      },
  { from: "react",      to: "typescript" },
  { from: "flask",      to: "typescript" },
  // Data lane
  { from: "sql",        to: "postgresql" },
  { from: "postgresql", to: "ml_ai"      },
  // Cross-lane: Flask feeds ML APIs
  { from: "flask",      to: "ml_ai"      },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

function buildDelays() {
  const delays = { python: 0 };
  const adj = Object.fromEntries(NODES.map(n => [n.id, []]));
  EDGES.forEach(e => adj[e.from].push(e.to));
  const queue = ["python"];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of adj[cur]) {
      if (!(nb in delays)) {
        delays[nb] = delays[cur] + 0.18;
        queue.push(nb);
      }
    }
  }
  return delays;
}
const DELAYS = buildDelays();

// Cross-lane paths curve away from the source quickly then arrive
// horizontally at the destination, avoiding mid-canvas clutter.
function edgePath(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (Math.abs(dy) > 90) {
    // Cross-lane: transition most of the vertical distance early,
    // then glide horizontally into the destination node.
    const cp1x = a.x + dx * 0.25;
    const cp1y = a.y + dy * 0.78;
    const cp2x = a.x + dx * 0.72;
    const cp2y = b.y;
    return `M ${a.x},${a.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${b.x},${b.y}`;
  }

  // Same-lane: classic horizontal S-curve
  const mx = (a.x + b.x) / 2;
  return `M ${a.x},${a.y} C ${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">

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
          How one language branched into an entire toolkit — traced from the start.
        </motion.p>

        {/* ── MAP CANVAS ── */}
        <div className="skills-scroll-wrapper">
          <motion.div
            className="skills-map"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            style={{ marginTop: "36px" }}
          >
            {/* Pure SVG — paths and dots share one coordinate system, no offset possible */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
            >
              {/* ── EDGES ── */}
              {EDGES.map((edge, i) => {
                const a = nodeMap[edge.from];
                const b = nodeMap[edge.to];
                return (
                  <path
                    key={i}
                    d={edgePath(a, b)}
                    stroke={`${a.color}bb`}
                    strokeWidth={1.8}
                    strokeDasharray="6 8"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* ── LANE SEPARATORS + LABELS ── */}
              {LANES.map((lane, i) => (
                <g key={i}>
                  {lane.lineY !== null && (
                    <line x1="10" y1={lane.lineY} x2={W - 10} y2={lane.lineY}
                      stroke={`${lane.color}30`} strokeWidth="1" />
                  )}
                  <circle cx={W - 18} cy={lane.labelY + 4} r="4" fill={lane.color} opacity="0.75" />
                  <text x={W - 28} y={lane.labelY + 8} textAnchor="end"
                    fill="rgba(255,255,255,0.55)" fontSize="11"
                    fontFamily="monospace" letterSpacing="2" fontWeight="500">
                    {lane.label.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* ── NODES — everything in SVG coordinates, guaranteed aligned ── */}
              {NODES.map((node) => {
                const delay = DELAYS[node.id];
                // Estimate label widths for background rects (centered text)
                const nameW = node.name.length * 7.2 + 12;
                const yearW = node.year.length * 6.5 + (node.isLatest ? 14 : 0) + 10;
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay, type: "spring", stiffness: 220, damping: 16 }}
                    viewport={{ once: true }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  >
                    {/* Pulse ring for "currently deepening" */}
                    {node.isLatest && (
                      <circle cx={node.x} cy={node.y} r="14" fill="none"
                        stroke={node.color} strokeWidth="2"
                        style={{ animation: "latestPulse 2s ease-in-out infinite" }} />
                    )}

                    {/* Soft glow halo */}
                    <circle cx={node.x} cy={node.y} r="12" fill={node.color} opacity="0.12" />

                    {/* Main dot */}
                    <circle
                      cx={node.x} cy={node.y} r="8"
                      fill={node.color}
                      stroke="rgba(255,255,255,0.28)" strokeWidth="2"
                      style={{ filter: `drop-shadow(0 0 4px ${node.color}99) drop-shadow(0 0 10px ${node.color}44)` }}
                    />

                    {/* Dark background behind name so paths don't bleed through */}
                    <rect
                      x={node.x - nameW / 2} y={node.y - 27}
                      width={nameW} height={15} rx="3"
                      fill="rgba(0,0,0,0.72)"
                    />

                    {/* Name — above dot */}
                    <text x={node.x} y={node.y - 15}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.92)"
                      fontSize="11.5" fontWeight="600"
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                      {node.name}
                    </text>

                    {/* START badge — above the name */}
                    {node.isRoot && (
                      <g>
                        <rect x={node.x - 23} y={node.y - 44} width="46" height="15"
                          rx="7.5" fill="rgba(96,165,250,0.18)"
                          stroke="rgba(96,165,250,0.45)" strokeWidth="1" />
                        <text x={node.x} y={node.y - 34}
                          textAnchor="middle" fill="#93c5fd"
                          fontSize="8.5" fontFamily="monospace" letterSpacing="1">
                          START
                        </text>
                      </g>
                    )}

                    {/* Dark background behind year */}
                    <rect
                      x={node.x - yearW / 2} y={node.y + 13}
                      width={yearW} height={13} rx="3"
                      fill="rgba(0,0,0,0.65)"
                    />

                    {/* Year — below dot */}
                    <text x={node.x} y={node.y + 23}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.45)"
                      fontSize="10" fontFamily="monospace">
                      {node.year}
                      {node.isLatest && (
                        <tspan fill="#4ade80" dx="3">●</tspan>
                      )}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </motion.div>
        </div>

        {/* LEGEND */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          style={{ marginTop: "32px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>
            <svg width="28" height="6" viewBox="0 0 28 6">
              <line x1="0" y1="3" x2="28" y2="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 6" />
            </svg>
            Progression path
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#60a5fa" style={{ filter: "drop-shadow(0 0 3px #60a5fa88)" }} />
            </svg>
            Skill acquired
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4ade80" }}>
            <span>●</span>
            Currently deepening
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes latestPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 0.1; transform: scale(1.9); }
        }
      `}</style>
    </section>
  );
}
