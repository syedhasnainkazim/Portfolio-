import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import Sun from "../components/Sun";
import Hero3D from "../components/Hero3D";

const STATS = [
  { value: "3+",  label: "Yrs Experience" },
  { value: "10+", label: "Projects Built"  },
  { value: "2",   label: "Companies"       },
];

const SOCIALS = [
  { href: "mailto:syedhasnainkazim@gmail.com",   Icon: MdEmail,    label: "Email"    },
  { href: "https://github.com/syedhasnainkazim", Icon: FaGithub,   label: "GitHub"   },
  { href: "https://www.linkedin.com/in/syed-hasnain-kazim1", Icon: FaLinkedin, label: "LinkedIn" },
];

export default function Hero() {
  // useRef so mouse updates don't trigger re-renders — R3F reads it each frame
  const mouse      = useRef({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      // Normalise to -1 → 1 for R3F
      mouse.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      setGlowPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Sun />

      {/* Cursor glow */}
      <div style={{
        position: "absolute",
        left: glowPos.x - 220,
        top:  glowPos.y - 220,
        width: 440, height: 440,
        background: "rgba(59,130,246,0.07)",
        filter: "blur(110px)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        transition: "left 0.08s linear, top 0.08s linear",
      }} />

      {/* ── GRID ── */}
      <div
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >

        {/* ══ LEFT — CONTENT ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "999px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.28)",
              width: "fit-content",
            }}
          >
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.9)",
              animation: "heroPulseDot 2s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: "13px", color: "#86efac", letterSpacing: "0.01em" }}>
              Open to opportunities
            </span>
          </motion.div>

          {/* Name */}
          <div style={{ lineHeight: 1 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", marginBottom: "10px" }}
            >
              Hi, I'm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                fontSize: "clamp(38px, 10vw, 72px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                background: "linear-gradient(140deg, #ffffff 25%, #93c5fd 65%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Syed Kazim
            </motion.h1>
          </div>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontSize: "20px", color: "#60a5fa", fontWeight: 500, minHeight: "28px" }}
          >
            <Typewriter
              words={[
                "Software Engineer",
                "Full Stack Developer",
                "Data Analyst",
                "Backend Architect",
              ]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={58}
              deleteSpeed={28}
              delaySpeed={2200}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: "15.5px",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.85,
              maxWidth: "430px",
            }}
          >
            I build scalable, real-world web applications — from React interfaces
            and REST APIs to cloud infrastructure and data pipelines.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
            className="hero-stats"
            style={{ display: "flex", gap: "36px" }}
          >
            {STATS.map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginTop: "5px", letterSpacing: "0.03em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 }}
            className="hero-ctas"
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a href="#projects" style={{ textDecoration: "none" }}>
              <button className="primary-btn" style={{ fontSize: "14px", fontWeight: 600 }}>
                View Projects
              </button>
            </a>
            <a href="/resume.pdf" download="Syed_Kazim_Resume.pdf" style={{ textDecoration: "none" }}>
              <button className="secondary-btn" style={{ fontSize: "14px" }}>
                Download Resume
              </button>
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.88 }}
            style={{ display: "flex", gap: "12px" }}
          >
            {SOCIALS.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noreferrer"
                title={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(96,165,250,0.14)";
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.45)";
                  e.currentTarget.style.color = "#60a5fa";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT — 3D SCENE ══ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "480px",
            width: "100%",
          }}
        >
          <Hero3D mouse={mouse} />
        </motion.div>

      </div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "100%", height: "130px",
        background: "linear-gradient(to bottom, transparent, #000)",
        pointerEvents: "none", zIndex: 3,
      }} />

      <style>{`
        @keyframes heroPulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.5; transform:scale(0.82); }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 60px !important;
            gap: 0 !important;
          }
          .hero-grid > div:last-child { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-grid {
            padding: 90px 16px 50px !important;
          }
          .hero-stats { gap: 22px !important; }
          .hero-ctas  { gap: 10px !important; }
        }
      `}</style>
    </section>
  );
}
