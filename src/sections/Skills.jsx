import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaJava, FaAws, FaBrain, FaDatabase } from "react-icons/fa6";
import {
  SiPython, SiC, SiCplusplus, SiLinux, SiGit, SiDocker,
  SiHtml5, SiJavascript, SiReact, SiNodedotjs, SiFlask,
  SiTypescript, SiPostgresql,
} from "react-icons/si";

// ─── CATEGORIES ────────────────────────────────────────────────────────────
const CATEGORY = {
  systems: { label: "Systems & Low-Level", color: "#a78bfa" },
  web:     { label: "Web Development",     color: "#34d399" },
  data:    { label: "Data & Science",      color: "#f472b6" },
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const SKILLS = [
  { id: "python",     name: "Python",      year: 2019, icon: SiPython,     category: "systems",
    projects: ["FinTrack", "AutoMatch", "Victoria Solutions"], isRoot: true },
  { id: "c",          name: "C",           year: 2019, icon: SiC,          category: "systems",
    projects: [] },
  { id: "html_css",   name: "HTML / CSS",  year: 2019, icon: SiHtml5,      category: "web",
    projects: ["Applied Style NJ", "CrypticChat", "FinTrack"] },

  { id: "cpp",        name: "C++",         year: 2020, icon: SiCplusplus,  category: "systems",
    projects: [] },
  { id: "java",       name: "Java",        year: 2020, icon: FaJava,       category: "systems",
    projects: [] },
  { id: "git",        name: "Git",         year: 2020, icon: SiGit,        category: "systems",
    projects: ["CrypticChat", "Applied Style NJ", "FinTrack", "AutoMatch"] },
  { id: "sql",        name: "SQL",         year: 2020, icon: FaDatabase,   category: "data",
    projects: ["FinTrack", "AutoMatch"] },

  { id: "linux",      name: "Linux",       year: 2021, icon: SiLinux,      category: "systems",
    projects: ["Applied Style NJ"] },
  { id: "javascript", name: "JavaScript",  year: 2021, icon: SiJavascript, category: "web",
    projects: ["Applied Style NJ", "CrypticChat"] },

  { id: "react",      name: "React",       year: 2022, icon: SiReact,      category: "web",
    projects: ["CrypticChat", "FinTrack", "AutoMatch", "Applied Style NJ"] },
  { id: "nodejs",     name: "Node.js",     year: 2022, icon: SiNodedotjs,  category: "web",
    projects: ["CrypticChat", "FinTrack"] },
  { id: "postgresql", name: "PostgreSQL",  year: 2022, icon: SiPostgresql, category: "data",
    projects: ["FinTrack", "AutoMatch", "Gomes Group"] },

  { id: "docker",     name: "Docker",      year: 2023, icon: SiDocker,     category: "systems",
    projects: [] },
  { id: "flask",      name: "Flask",       year: 2023, icon: SiFlask,      category: "web",
    projects: ["Applied Style NJ", "AutoMatch", "Gomes Group"] },

  { id: "aws",        name: "AWS",         year: 2024, icon: FaAws,        category: "systems",
    projects: ["Applied Style NJ"] },
  { id: "typescript", name: "TypeScript",  year: 2024, icon: SiTypescript, category: "web",
    projects: [] },

  { id: "ml_ai",      name: "ML / AI",     year: 2026, icon: FaBrain,      category: "data",
    projects: ["AutoMatch"], isLatest: true },
];

// grouped: [{type:'year', year}, {type:'skill', skill}, ...] ordered chronologically
const TIMELINE = SKILLS.reduce((acc, skill, i) => {
  if (i === 0 || skill.year !== SKILLS[i - 1].year) acc.push({ type: "year", year: skill.year });
  acc.push({ type: "skill", skill });
  return acc;
}, []);

const TICK_H = 40; // px, height of the tick row above each card — line runs through its center

// ─── SKILL CARD ─────────────────────────────────────────────────────────────
function SkillCard({ skill }) {
  const cat = CATEGORY[skill.category];
  const Icon = skill.icon;

  return (
    <div
      className="skill-col"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 176 }}
    >
      {/* tick on the rail */}
      <div style={{ height: TICK_H, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
        {skill.isLatest && (
          <motion.span
            style={{
              position: "absolute", width: 22, height: 22, borderRadius: "50%",
              border: `1.5px solid ${cat.color}`,
            }}
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <div style={{
          width: 11, height: 11, borderRadius: "50%",
          background: cat.color, boxShadow: `0 0 10px ${cat.color}`,
        }} />
      </div>

      <motion.div
        className="skill-card"
        whileHover={{ y: -8, scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        style={{
          width: "100%",
          minHeight: 190,
          borderRadius: "16px",
          padding: "20px 16px 16px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          scrollSnapAlign: "center",
          cursor: "default",
          "--glow": cat.color,
        }}
      >
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          background: `${cat.color}17`, border: `1px solid ${cat.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "12px", flexShrink: 0,
        }}>
          <Icon size={22} color={cat.color} />
        </div>

        <div style={{ fontWeight: 700, fontSize: "14.5px", color: "#fff", marginBottom: "3px" }}>
          {skill.name}
        </div>
        <div style={{ fontSize: "10.5px", fontFamily: "monospace", color: "rgba(255,255,255,0.32)", marginBottom: "12px" }}>
          {skill.isRoot ? "where it started" : `since ${skill.year}`}
        </div>

        <div style={{
          width: "100%", height: "1px",
          background: "rgba(255,255,255,0.07)", marginBottom: "12px",
        }} />

        {skill.projects.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: "center" }}>
            {skill.projects.map(p => (
              <span key={p} style={{
                fontSize: "9.5px", padding: "3px 8px", borderRadius: "999px",
                background: `${cat.color}14`, color: cat.color,
                border: `1px solid ${cat.color}3a`, whiteSpace: "nowrap",
              }}>
                {p}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
            foundational skill
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── YEAR MARKER ────────────────────────────────────────────────────────────
function YearMarker({ year }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 56 }}>
      <div style={{ height: TICK_H, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#050508", border: "2px solid rgba(255,255,255,0.28)",
        }} />
      </div>
      <div style={{
        marginTop: "10px", fontSize: "11.5px", fontFamily: "monospace",
        color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.03em",
      }}>
        {year}
      </div>
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const trackRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: trackRef });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateBounds();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds);
    return () => {
      el.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    };
  }, [updateBounds]);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.7, 420), behavior: "smooth" });
  };

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
          A timeline of skills, in the order I picked them up. Scroll or use the arrows to walk through it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          style={{ position: "relative", marginTop: "36px" }}
        >
          {/* fade edges */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: "48px", zIndex: 3,
            background: "linear-gradient(90deg, #000 0%, transparent 100%)",
            pointerEvents: "none", opacity: atStart ? 0 : 1, transition: "opacity 0.25s",
          }} />
          <div style={{
            position: "absolute", top: 0, bottom: 0, right: 0, width: "48px", zIndex: 3,
            background: "linear-gradient(270deg, #000 0%, transparent 100%)",
            pointerEvents: "none", opacity: atEnd ? 0 : 1, transition: "opacity 0.25s",
          }} />

          {/* nav arrows */}
          <button
            aria-label="Scroll skills left"
            onClick={() => scrollByAmount(-1)}
            disabled={atStart}
            className="skills-nav-btn"
            style={{ left: "-16px" }}
          >
            <FaChevronLeft size={13} />
          </button>
          <button
            aria-label="Scroll skills right"
            onClick={() => scrollByAmount(1)}
            disabled={atEnd}
            className="skills-nav-btn"
            style={{ right: "-16px" }}
          >
            <FaChevronRight size={13} />
          </button>

          <div
            ref={trackRef}
            className="skills-scroll"
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x proximity",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "8px",
            }}
          >
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "14px", padding: "0 24px", width: "max-content" }}>
              {/* connecting rail */}
              <div style={{
                position: "absolute", left: 0, right: 0, top: `${TICK_H / 2 - 1}px`,
                height: "2px", zIndex: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 6%, rgba(255,255,255,0.16) 94%, transparent)",
              }} />

              {TIMELINE.map((item, i) =>
                item.type === "year"
                  ? <YearMarker key={`y-${item.year}-${i}`} year={item.year} />
                  : <SkillCard key={item.skill.id} skill={item.skill} />
              )}
            </div>
          </div>

          {/* progress bar */}
          <div style={{ marginTop: "14px", height: "3px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%", borderRadius: "999px", transformOrigin: "0%",
                background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
                scaleX: scrollXProgress,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          viewport={{ once: true }}
          style={{ marginTop: "26px", display: "flex", alignItems: "center",
            gap: "24px", flexWrap: "wrap" }}
        >
          {Object.values(CATEGORY).map(cat => (
            <div key={cat.label} style={{ display: "flex", alignItems: "center",
              gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.33)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%",
                background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
              {cat.label}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "8px",
            fontSize: "12px", color: "#f472b6" }}>
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
        .skills-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.18) transparent;
        }
        .skills-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .skills-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.18);
          border-radius: 999px;
        }
        .skill-card:hover {
          border-color: var(--glow) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px var(--glow), 0 0 24px -4px var(--glow);
        }
        .skills-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(10,10,16,0.85);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: opacity 0.2s, transform 0.2s, border-color 0.2s;
        }
        .skills-nav-btn:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-50%) scale(1.08);
        }
        .skills-nav-btn:disabled {
          opacity: 0;
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .skills-nav-btn { display: none; }
        }
      `}</style>
    </section>
  );
}
