import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  SiPython, SiReact, SiNodedotjs, SiPostgresql, SiDocker,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import {
  FiDatabase, FiCode, FiLayers, FiActivity,
} from "react-icons/fi";
import { MdOutlineSpeed } from "react-icons/md";

const STATS = [
  { value: "2019", label: "First line of code" },
  { value: "3+",   label: "Companies worked at" },
  { value: "10+",  label: "Projects shipped" },
  { value: "Dec '26", label: "B.S. CS graduation" },
];

const INTERESTS = [
  { label: "Distributed Systems",    Icon: FiLayers    },
  { label: "Data Pipelines",         Icon: FiDatabase  },
  { label: "REST & API Design",      Icon: FiCode      },
  { label: "Performance Engineering",Icon: MdOutlineSpeed },
  { label: "Systems Architecture",   Icon: FiActivity  },
];

const TECH_ICONS = [
  { Icon: SiPython,            color: "#60a5fa", label: "Python"     },
  { Icon: SiReact,             color: "#67e8f9", label: "React"      },
  { Icon: SiNodedotjs,         color: "#4ade80", label: "Node.js"    },
  { Icon: SiPostgresql,        color: "#fb923c", label: "PostgreSQL" },
  { Icon: SiDocker,            color: "#38bdf8", label: "Docker"     },
  { Icon: FaAws,               color: "#fcd34d", label: "AWS"        },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">

        {/* HEADER */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#60a5fa",
            letterSpacing: "0.06em",
            marginBottom: "12px",
          }}
        >
          {"// who I am"}
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          About
        </motion.h1>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          A little about who I am and what drives me.
        </motion.p>

        {/* TWO-COLUMN LAYOUT */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
            marginTop: "20px",
          }}
        >

          {/* LEFT — BIO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="about-bio"
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: "1.8" }}>
              I'm <span style={{ color: "#a5b4fc", fontWeight: 600 }}>Syed Kazim</span>, a
              full stack developer and systems engineer based in New Jersey. I build
              real-world applications end-to-end — from React interfaces and REST APIs
              to cloud infrastructure and data pipelines.
            </p>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: "1.8" }}>
              My work spans web development, backend engineering, and data analytics.
              I care about writing clean, production-grade code that solves actual
              problems — not just demos that look good in a browser.
            </p>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: "1.8" }}>
              When I'm not building production systems I'm reading about distributed
              databases, experimenting with ML models, or profiling queries to squeeze
              out the last few milliseconds.
            </p>

            {/* ── STAT ROW ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              viewport={{ once: true }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="glass"
                  style={{
                    padding: "14px 16px",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <span style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    lineHeight: 1,
                    background: "linear-gradient(120deg, #fff 20%, #93c5fd 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {s.value}
                  </span>
                  <span style={{
                    fontSize: "11.5px",
                    color: "rgba(255,255,255,0.36)",
                    letterSpacing: "0.01em",
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* ── INTERESTS ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36 }}
              viewport={{ once: true }}
            >
              <p style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                marginBottom: "10px",
                fontFamily: "monospace",
              }}>
                What I care about
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {INTERESTS.map(({ label, Icon }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.38 + i * 0.06 }}
                    viewport={{ once: true }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: "rgba(165,180,252,0.07)",
                      border: "1px solid rgba(165,180,252,0.14)",
                      fontSize: "12.5px",
                      color: "rgba(255,255,255,0.60)",
                    }}
                  >
                    <Icon size={12} color="#a5b4fc" />
                    {label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* EDUCATION CARD */}
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              glareEnable={true}
              glareMaxOpacity={0.07}
              glareColor="#a5b4fc"
              glarePosition="all"
              glareBorderRadius="20px"
              perspective={1000}
              scale={1.02}
              transitionSpeed={600}
              style={{ borderRadius: "20px", marginTop: "8px" }}
            >
            <motion.div
              className="glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              style={{ padding: "22px 24px" }}
            >
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                Education
              </p>

              {/* MCC */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "18px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#60a5fa", marginTop: "6px", flexShrink: 0,
                  boxShadow: "0 0 8px rgba(96,165,250,0.7)",
                }} />
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>
                    Middlesex County College
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#60a5fa", marginBottom: "3px" }}>
                    A.S. Computer Science
                  </p>
                  <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.38)" }}>
                    Edison, NJ
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "18px", marginLeft: "22px" }} />

              {/* NJIT */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#a5b4fc", marginTop: "6px", flexShrink: 0,
                  boxShadow: "0 0 8px rgba(165,180,252,0.7)",
                }} />
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>
                    New Jersey Institute of Technology
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#a5b4fc", marginBottom: "3px" }}>
                    B.S. Computer Science
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.38)" }}>
                      Newark, NJ
                    </p>
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "999px",
                      background: "rgba(165,180,252,0.12)",
                      border: "1px solid rgba(165,180,252,0.28)",
                      color: "#a5b4fc", letterSpacing: "0.02em",
                    }}>
                      Est. Dec 2026
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
            </Tilt>
          </motion.div>

          {/* RIGHT — PHOTOS */}
          <motion.div
            className="about-photos"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Profile Photo */}
            <div
              className="about-profile-photo"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                height: "480px",
              }}
            >
              <picture>
                <source srcSet="/images/Profile.webp" type="image/webp" />
                <img
                  src="/images/Profile.jpg"
                  alt="Syed Kazim"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </picture>
            </div>

            {/* NJIT Photo */}
            <div
              className="about-school-photo"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                height: "160px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 40px",
              }}
            >
              <img
                src="/images/njit.jpg"
                alt="New Jersey Institute of Technology"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center center",
                }}
              />
            </div>

            {/* Tech icons row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass"
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
              }}
            >
              <p style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                marginBottom: "12px",
                fontFamily: "monospace",
              }}>
                Daily drivers
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {TECH_ICONS.map(({ Icon, color, label }, i) => (
                  <div
                    key={i}
                    title={label}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}
                  >
                    <div style={{
                      width: "36px", height: "36px",
                      borderRadius: "10px",
                      background: `${color}12`,
                      border: `1px solid ${color}28`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
