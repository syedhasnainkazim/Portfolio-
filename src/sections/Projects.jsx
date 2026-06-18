import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Tilt from "react-parallax-tilt";

const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const projects = [
  {
    title: "CrypticChat",
    featured: true,
    desc: "Built the entire backend from scratch with Node.js + Express + Socket.IO — each room runs as an isolated Socket.IO namespace so messages never bleed across conversations. Client-side AES-256 encrypts every message before it leaves the browser, meaning the server only ever stores ciphertext and can't read user messages even with DB access. JWT auth handles sessions; presence tracking uses heartbeat events with a 10s timeout before marking users offline. MongoDB stores message history with TTL indexes so old messages expire automatically.",
    image: "/images/CrypticChat.jpg",
    imgFit: "cover",
    imgPosition: "center top",
    art: null,
    stack: ["React", "Node.js", "MongoDB", "Socket.IO", "JWT", "Express"],
    github: "https://github.com/syedhasnainkazim/Cryptic-Chat",
    live: "https://crypticchat-p7v8.onrender.com/login",
  },
  {
    title: "Applied Style NJ",
    desc: "Live production site for an automotive detail studio in Edison, NJ — has been running and taking real bookings since 2023. The online scheduler replaced a phone-only system: clients pick a service, choose a time slot, and get a confirmation email automatically. The Flask backend manages slot availability so double-bookings are impossible. Saved the owner ~3 hrs/week of manual coordination. Deployed on Netlify with CI/CD from GitHub; backend on a separate server.",
    image: "/images/aps-photo.jpg",
    imgFit: "contain",
    imgPosition: "center",
    imgBg: "#050508",
    art: null,
    stack: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
    github: "https://github.com/syedhasnainkazim/applied-style-nj",
    live: "https://appliedstylenj.com",
  },
  {
    title: "FinTrack",
    desc: "Personal finance dashboard with a Node.js + PostgreSQL REST API — all endpoints respond under 200ms on indexed queries. Users track income and spending across custom budget categories; Chart.js renders spending trends and cash flow breakdowns. JWT auth uses short-lived access tokens (15 min) with refresh token rotation so sessions stay alive across browser restarts without re-prompting for credentials. All dollar amounts stored as integers in cents to avoid floating point rounding bugs entirely.",
    image: "/images/FinTrack.jpg",
    imgFit: "cover",
    imgPosition: "center top",
    art: null,
    stack: ["React", "Node.js", "PostgreSQL", "Chart.js", "JWT", "REST APIs"],
    github: "https://github.com/syedhasnainkazim/Fin-Track/tree/main",
    live: "https://fintrack-cha6.onrender.com/",
  },
  {
    title: "AutoMatch",
    desc: "Vehicle recommendation engine where users answer a short preference survey (budget, body style, mileage tolerance) and get a ranked list of matching listings. A Python collaborative filtering model scores vehicles based on similar users' choices; PostgreSQL full-text search handles keyword queries across thousands of listings in parallel. Next.js SSR pre-renders the listing page on first load so users see results immediately instead of waiting for a client-side API fetch — cut initial paint time by ~40% vs. a pure CSR approach.",
    image: "/images/AutoMatch.jpg",
    imgFit: "cover",
    imgPosition: "center",
    art: null,
    stack: ["React", "Next.js", "PostgreSQL", "Python", "Machine Learning"],
    github: "https://github.com/syedhasnainkazim/Auto-Match",
  },
];

function PlaceholderArt({ art }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: art.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${art.dots[0]}55, transparent)`,
        animation: "scanLine 3s ease-in-out infinite",
      }} />
      {art.lines.map((line, i) => (
        <div key={i} style={{
          position: "absolute",
          top: line.top, left: line.left,
          width: line.w, height: "2px",
          background: `linear-gradient(90deg, ${art.dots[i % art.dots.length]}44, transparent)`,
          borderRadius: "2px",
          opacity: line.opacity * 6,
        }} />
      ))}
      {art.dots.map((c, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${28 + i * 22}%`,
          right: `${14 + i * 8}%`,
          width: "6px", height: "6px",
          borderRadius: "50%",
          background: c,
          boxShadow: `0 0 10px 4px ${c}66`,
          animation: `dotPulse ${2 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "42px",
        opacity: 0.18,
        filter: "blur(1px)",
      }}>
        {art.icon}
      </div>
    </div>
  );
}

export default function Projects() {
  const [hoveredImg, setHoveredImg] = useState(null);

  return (
    <section id="projects" className="section">
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
          {"// what I've built"}
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Projects
        </motion.h1>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Things I've built end-to-end.
        </motion.p>

        {/* GRID */}
        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {projects.map((project, index) => (
            <Tilt
              key={index}
              tiltEnable={!isTouch}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={!isTouch}
              glareMaxOpacity={0.08}
              glareColor="#a5b4fc"
              glarePosition="all"
              glareBorderRadius="20px"
              perspective={1000}
              scale={isTouch ? 1 : 1.02}
              transitionSpeed={600}
              style={{ borderRadius: "20px" }}
            >
            <motion.div
              className="glass project-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
            >
              {/* IMAGE / ART */}
              <div
                style={{
                  width: "100%", height: "220px", flexShrink: 0, overflow: "hidden",
                  background: project.imgBg || "transparent",
                  position: "relative",
                }}
                onMouseEnter={() => !isTouch && setHoveredImg(index)}
                onMouseLeave={() => setHoveredImg(null)}
              >
                {project.image ? (
                  <picture style={{ display: "block", width: "100%", height: "100%" }}>
                    {project.image.endsWith(".jpg") && (
                      <source
                        srcSet={project.image.replace(".jpg", ".webp")}
                        type="image/webp"
                      />
                    )}
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%", height: "100%", display: "block",
                        objectFit: project.imgFit || "cover",
                        objectPosition: project.imgPosition || "center",
                        transform: hoveredImg === index ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </picture>
                ) : (
                  <PlaceholderArt art={project.art} />
                )}

                {/* Featured badge */}
                {project.featured && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 14px rgba(59,130,246,0.45)",
                    zIndex: 10,
                  }}>
                    Featured
                  </div>
                )}

                {/* Hover overlay with action buttons */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(2,4,18,0.92) 0%, rgba(2,4,18,0.45) 55%, transparent 100%)",
                  opacity: hoveredImg === index ? 1 : 0,
                  transition: "opacity 0.25s ease",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "14px 16px",
                  gap: "8px",
                  pointerEvents: hoveredImg === index ? "auto" : "none",
                }}>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        textDecoration: "none",
                        boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
                      }}
                    >
                      <FiExternalLink size={11} /> View Live
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <FiGithub size={11} /> GitHub
                  </a>
                </div>
              </div>

              {/* CONTENT */}
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>

                {/* Title + links */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                    {project.live ? (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "inherit", textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#60a5fa"}
                        onMouseLeave={e => e.currentTarget.style.color = "inherit"}
                      >
                        {project.title} <FiExternalLink size={13} />
                      </a>
                    ) : project.title}
                  </h3>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      fontSize: "12px", color: "rgba(255,255,255,0.4)",
                      textDecoration: "none", flexShrink: 0, marginLeft: "8px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                  >
                    <FiGithub size={15} />
                  </a>
                </div>

                <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", lineHeight: "1.65", margin: 0 }}>
                  {project.desc}
                </p>

                {/* Stack */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "auto", paddingTop: "4px" }}>
                  {project.stack.map((tech, i) => (
                    <span key={i} style={{
                      fontSize: "11.5px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: "rgba(165,180,252,0.10)",
                      color: "#a5b4fc",
                      border: "1px solid rgba(165,180,252,0.18)",
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Touch link bar — hover overlay is inaccessible on touch devices */}
                {isTouch && (
                  <div style={{
                    display: "flex", gap: "8px",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    paddingTop: "12px", marginTop: "8px",
                  }}>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1, padding: "9px 12px", borderRadius: "9px",
                          background: "rgba(59,130,246,0.14)",
                          border: "1px solid rgba(59,130,246,0.28)",
                          color: "#60a5fa", fontSize: "12.5px", fontWeight: 600,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: "5px", textDecoration: "none",
                        }}
                      >
                        <FiExternalLink size={13} /> View Live
                      </a>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: project.live ? 0 : 1,
                        padding: "9px 14px", borderRadius: "9px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.6)", fontSize: "12.5px", fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "5px", textDecoration: "none", flexShrink: 0,
                      }}
                    >
                      <FiGithub size={13} /> GitHub
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
            </Tilt>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.5); }
        }
        .project-card { cursor: default; }
        @media (max-width: 700px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
