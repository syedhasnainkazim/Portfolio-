import { motion } from "framer-motion";

// ─── COORDINATE SPACE ────────────────────────────────────────────────────────
const W = 920;
const H = 640;

// ─── LANE DEFINITIONS ────────────────────────────────────────────────────────
const LANES = [
  { label: "Systems & Low-Level", color: "#a78bfa", labelY: 18,  lineY: 30  },
  { label: "Web Development",     color: "#34d399", labelY: 272, lineY: 284 },
  { label: "Data & Science",      color: "#f472b6", labelY: 480, lineY: 492 },
];

// ─── NODES ───────────────────────────────────────────────────────────────────
const NODES = [
  // ROOT
  { id: "python",     name: "Python",      year: "2019", x: 55,  y: 320, color: "#60a5fa", isRoot: true },

  // ── BRANCH A: Systems / Low-level (top lane, y: 45–175) ──
  { id: "c",          name: "C",           year: "2019", x: 190, y: 100, color: "#a78bfa" },
  { id: "cpp",        name: "C++",         year: "2020", x: 335, y: 50,  color: "#c084fc" },
  { id: "java",       name: "Java",        year: "2020", x: 335, y: 155, color: "#e879f9" },
  { id: "linux",      name: "Linux",       year: "2021", x: 480, y: 48,  color: "#f472b6" },
  { id: "git",        name: "Git",         year: "2020", x: 480, y: 158, color: "#f97316" },
  { id: "docker",     name: "Docker",      year: "2023", x: 630, y: 100, color: "#38bdf8" },
  { id: "aws",        name: "AWS",         year: "2024", x: 795, y: 158, color: "#fcd34d" },

  // ── BRANCH B: Web (middle lane, y: 300–430) ──
  { id: "html_css",   name: "HTML / CSS",  year: "2019", x: 190, y: 320, color: "#34d399" },
  { id: "javascript", name: "JavaScript",  year: "2021", x: 345, y: 348, color: "#fbbf24" },
  { id: "react",      name: "React",       year: "2022", x: 490, y: 305, color: "#38bdf8" },
  { id: "nodejs",     name: "Node.js",     year: "2022", x: 490, y: 420, color: "#4ade80" },
  { id: "flask",      name: "Flask",       year: "2023", x: 640, y: 400, color: "#2dd4bf" },
  { id: "typescript", name: "TypeScript",  year: "2024", x: 795, y: 318, color: "#3b82f6" },

  // ── BRANCH C: Data (bottom lane, y: 505–545) ──
  { id: "sql",        name: "SQL",         year: "2020", x: 190, y: 520, color: "#f472b6" },
  { id: "postgresql", name: "PostgreSQL",  year: "2022", x: 345, y: 540, color: "#fb923c" },
  { id: "ml_ai",      name: "ML / AI",     year: "2026", x: 795, y: 535, color: "#a5b4fc", isLatest: true },
];

// ─── EDGES ───────────────────────────────────────────────────────────────────
const EDGES = [
  // Python → three lanes
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
  // Cross-lane: flask feeds ML APIs
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

// Smart edge routing: same-lane uses horizontal S-curve,
// cross-lane uses a more vertical path to avoid cutting through other lanes
function edgePath(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (Math.abs(dy) > 110) {
    // Cross-lane: pull control points closer to source/dest horizontally
    // so the curve dips down/up more steeply and avoids mid-lane nodes
    const cp1x = a.x + dx * 0.25;
    const cp1y = a.y + dy * 0.55;
    const cp2x = b.x - dx * 0.25;
    const cp2y = b.y - dy * 0.25;
    return `M ${a.x},${a.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${b.x},${b.y}`;
  }

  // Same lane: classic horizontal S-curve
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
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: `${(H / W) * 100}%`,
              marginTop: "36px",
              maxWidth: `${W}px`,
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>

              {/* ── SVG LAYER ── */}
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", zIndex: 1 }}
              >
                {/* Edges first */}
                {EDGES.map((edge, i) => {
                  const a = nodeMap[edge.from];
                  const b = nodeMap[edge.to];
                  const delay = Math.max(DELAYS[edge.from], DELAYS[edge.to]);
                  return (
                    <motion.path
                      key={i}
                      d={edgePath(a, b)}
                      stroke={`${a.color}bb`}
                      strokeWidth={1.8}
                      strokeDasharray="6 8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay }}
                      viewport={{ once: true }}
                    />
                  );
                })}

                {/* Lane dividers + labels */}
                {LANES.map((lane, i) => (
                  <g key={i}>
                    {/* Full-width separator line */}
                    <line
                      x1="10" y1={lane.lineY}
                      x2={W - 10} y2={lane.lineY}
                      stroke={`${lane.color}28`}
                      strokeWidth="1"
                    />
                    {/* Colored indicator dot */}
                    <circle cx="18" cy={lane.labelY + 4} r="4" fill={lane.color} opacity="0.75" />
                    {/* Label text */}
                    <text
                      x="28"
                      y={lane.labelY + 8}
                      textAnchor="start"
                      fill="rgba(255,255,255,0.60)"
                      fontSize="11"
                      fontFamily="monospace"
                      letterSpacing="2"
                      fontWeight="500"
                    >
                      {lane.label.toUpperCase()}
                    </text>
                  </g>
                ))}
              </svg>

              {/* ── SKILL NODES ── */}
              {NODES.map((node) => {
                const delay = DELAYS[node.id];
                const xPct = (node.x / W) * 100;
                const yPct = (node.y / H) * 100;

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay, type: "spring", stiffness: 220, damping: 16 }}
                    viewport={{ once: true }}
                    style={{
                      position: "absolute",
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                      zIndex: 2,
                    }}
                  >
                    {node.isRoot && (
                      <span style={{
                        fontSize: "9px",
                        background: "rgba(96,165,250,0.18)",
                        border: "1px solid rgba(96,165,250,0.45)",
                        color: "#93c5fd",
                        borderRadius: "999px",
                        padding: "1px 8px",
                        fontFamily: "monospace",
                        letterSpacing: "0.08em",
                        marginBottom: "1px",
                      }}>START</span>
                    )}

                    <span style={{
                      fontSize: "11.5px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.88)",
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                    }}>
                      {node.name}
                    </span>

                    <div style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: node.color,
                      boxShadow: `0 0 8px 3px ${node.color}55, 0 0 18px 6px ${node.color}22`,
                      border: "2px solid rgba(255,255,255,0.28)",
                      flexShrink: 0,
                      position: "relative",
                    }}>
                      {node.isLatest && (
                        <div style={{
                          position: "absolute",
                          inset: "-5px",
                          borderRadius: "50%",
                          border: `2px solid ${node.color}`,
                          animation: "latestPulse 2s ease-in-out infinite",
                        }} />
                      )}
                    </div>

                    <span style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "monospace",
                      lineHeight: 1,
                    }}>
                      {node.year}{node.isLatest && <span style={{ color: "#4ade80", marginLeft: "3px" }}>●</span>}
                    </span>
                  </motion.div>
                );
              })}
            </div>
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
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 6px 2px #60a5fa44" }} />
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
