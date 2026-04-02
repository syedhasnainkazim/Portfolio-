import { motion } from "framer-motion";

// ─── COORDINATE SPACE ────────────────────────────────────────────────────────
const W = 900;
const H = 560;

// ─── NODES ───────────────────────────────────────────────────────────────────
// Layout: left→right = time progression. Three branches separated by ~160px vertically.
// Systems top (y≈55–175), Web middle (y≈285–410), Data bottom (y≈465–500)
const NODES = [
  // ROOT — Python starts everything, branches into all three paths
  { id: "python",     name: "Python",      year: "2019", x: 60,  y: 300, color: "#60a5fa", isRoot: true },

  // ── BRANCH A: Systems / Low-level (top lane) ──
  { id: "c",          name: "C",           year: "2019", x: 200, y: 100, color: "#a78bfa" },
  { id: "cpp",        name: "C++",         year: "2020", x: 350, y: 55,  color: "#c084fc" },
  { id: "java",       name: "Java",        year: "2020", x: 350, y: 165, color: "#e879f9" },
  { id: "linux",      name: "Linux",       year: "2021", x: 495, y: 50,  color: "#f472b6" },
  { id: "git",        name: "Git",         year: "2020", x: 495, y: 165, color: "#f97316" },
  { id: "docker",     name: "Docker",      year: "2023", x: 645, y: 108, color: "#38bdf8" },
  { id: "aws",        name: "AWS",         year: "2024", x: 800, y: 165, color: "#fcd34d" },

  // ── BRANCH B: Web / Frontend → Backend (middle lane) ──
  { id: "html_css",   name: "HTML / CSS",  year: "2019", x: 200, y: 300, color: "#34d399" },
  { id: "javascript", name: "JavaScript",  year: "2021", x: 360, y: 330, color: "#fbbf24" },
  { id: "react",      name: "React",       year: "2022", x: 500, y: 285, color: "#38bdf8" },
  { id: "nodejs",     name: "Node.js",     year: "2022", x: 500, y: 405, color: "#4ade80" },
  { id: "flask",      name: "Flask",       year: "2023", x: 650, y: 385, color: "#2dd4bf" },
  { id: "typescript", name: "TypeScript",  year: "2024", x: 800, y: 300, color: "#3b82f6" },

  // ── BRANCH C: Data / Science (bottom lane) ──
  { id: "sql",        name: "SQL",         year: "2020", x: 200, y: 470, color: "#f472b6" },
  { id: "postgresql", name: "PostgreSQL",  year: "2022", x: 360, y: 490, color: "#fb923c" },
  { id: "ml_ai",      name: "ML / AI",     year: "2026", x: 800, y: 490, color: "#a5b4fc", isLatest: true },
];

// ─── EDGES ───────────────────────────────────────────────────────────────────
const EDGES = [
  // Python splits into three lanes
  { from: "python",     to: "c"          },
  { from: "python",     to: "html_css"   },
  { from: "python",     to: "sql"        },
  // Systems lane — clean left→right, no cross-lane edges
  { from: "c",          to: "cpp"        },
  { from: "c",          to: "java"       },
  { from: "cpp",        to: "linux"      },
  { from: "java",       to: "git"        },
  { from: "linux",      to: "docker"     },
  { from: "git",        to: "docker"     },
  { from: "docker",     to: "aws"        },
  // Web lane — flows html→js→(react+node)→(typescript)
  { from: "html_css",   to: "javascript" },
  { from: "javascript", to: "react"      },
  { from: "javascript", to: "nodejs"     },
  { from: "nodejs",     to: "flask"      },
  { from: "react",      to: "typescript" },  // typed frontend
  { from: "flask",      to: "typescript" },  // typed backend
  // Data lane — sql→postgres→ml_ai
  { from: "sql",        to: "postgresql" },
  { from: "postgresql", to: "ml_ai"      },
  // ML/AI also connects from the web side (Node/Flask powering ML APIs)
  { from: "flask",      to: "ml_ai"      },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

// BFS depth → animation delay
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

// Smooth cubic-bezier path between two nodes
function edgePath(a, b) {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x},${a.y} C ${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

// ─── BRANCH LABELS ───────────────────────────────────────────────────────────
const BRANCH_LABELS = [
  { text: "Systems & Low-level", x: 80,  y: 22,  anchor: "start" },
  { text: "Web Development",     x: 80,  y: 258, anchor: "start" },
  { text: "Data & Science",      x: 80,  y: 442, anchor: "start" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">

        {/* HEADER */}
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

            {/* ── SVG EDGES ── */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", zIndex: 1 }}
            >
              {/* Edges — rendered first so labels sit on top */}
              {EDGES.map((edge, i) => {
                const a = nodeMap[edge.from];
                const b = nodeMap[edge.to];
                const delay = Math.max(DELAYS[edge.from], DELAYS[edge.to]);
                return (
                  <motion.path
                    key={i}
                    d={edgePath(a, b)}
                    stroke={`${a.color}99`}
                    strokeWidth={2}
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

              {/* Branch labels — rendered AFTER edges so they appear on top */}
              {BRANCH_LABELS.map((lbl, i) => (
                <text
                  key={i}
                  x={lbl.x} y={lbl.y}
                  textAnchor={lbl.anchor}
                  fill="rgba(255,255,255,0.22)"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="1.5"
                >
                  {lbl.text.toUpperCase()}
                </text>
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
                  {/* START badge */}
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
                    }}>
                      START
                    </span>
                  )}

                  {/* Skill name */}
                  <span style={{
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.88)",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                  }}>
                    {node.name}
                  </span>

                  {/* Dot */}
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

                  {/* Year */}
                  <span style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.32)",
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

        {/* LEGEND */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
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
