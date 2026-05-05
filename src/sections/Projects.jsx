import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Tilt from "react-parallax-tilt";

const projects = [
  {
    title: "CrypticChat",
    desc: "Real-time encrypted messaging app built on Socket.IO — handles bi-directional communication across multiple rooms with sub-100ms message delivery. AES end-to-end encryption and JWT auth keep sessions secure; live presence indicators show who's online.",
    image: "/images/CrypticChat.jpg",
    imgFit: "cover",
    imgPosition: "center top",
    art: null,
    stack: ["React", "Node.js", "MongoDB", "Socket.IO", "JWT", "Express"],
    github: "https://github.com/syedhasnainkazim/Cryptic-Chat",
  },
  {
    title: "Applied Style NJ",
    desc: "Live production site for an automotive detail studio in Edison, NJ. Integrated online booking replaced phone-only scheduling, cutting appointment coordination time by ~3 hrs/week. Deployed on Netlify with CI/CD from GitHub.",
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
    desc: "Personal finance dashboard backed by a PostgreSQL REST API with sub-200ms response times. Tracks spending across custom categories with interactive charts; JWT auth with refresh token rotation keeps sessions secure without frequent re-logins.",
    image: "/images/FinTrack.jpg",
    imgFit: "cover",
    imgPosition: "center top",
    art: null,
    stack: ["React", "Node.js", "PostgreSQL", "JWT", "REST APIs"],
    github: "https://github.com/syedhasnainkazim/Fin-Track/tree/main",
  },
  {
    title: "AutoMatch",
    desc: "Vehicle recommendation engine combining a Python ML model with PostgreSQL full-text search across thousands of listings. Collaborative filtering ranks results by user preference signals; Next.js SSR cuts initial page load by ~40% vs. a pure client-side fetch.",
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
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }} />

      {/* Animated scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${art.dots[0]}55, transparent)`,
        animation: "scanLine 3s ease-in-out infinite",
      }} />

      {/* Decorative code lines */}
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

      {/* Glowing dots */}
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

      {/* Center icon */}
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
  return (
    <section id="projects" className="section">
      <div className="container">

        {/* HEADER */}
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
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={true}
              glareMaxOpacity={0.08}
              glareColor="#a5b4fc"
              glarePosition="all"
              glareBorderRadius="20px"
              perspective={1000}
              scale={1.02}
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
              <div style={{
                width: "100%", height: "220px", flexShrink: 0, overflow: "hidden",
                background: project.imgBg || "transparent",
              }}>
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
                      }}
                    />
                  </picture>
                ) : (
                  <PlaceholderArt art={project.art} />
                )}
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
