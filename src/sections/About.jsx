import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">

        {/* HEADER */}
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
              Outside of work I'm either deep in a side project, reading about
              distributed systems, or finding new ways to make something faster
              and more reliable.
            </p>

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
              transition={{ duration: 0.5, delay: 0.3 }}
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
          </motion.div>

        </div>
      </div>

    </section>
  );
}
