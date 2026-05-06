import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
import { SiPython, SiFlask } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { FaDatabase, FaGlobe } from "react-icons/fa";
import { MdOutlineAnalytics, MdOutlineAutorenew } from "react-icons/md";
import { FiCode } from "react-icons/fi";

const experiences = [
  {
    role: "Software Engineer",
    company: "ByGomes",
    date: "May 2026 – Present",
    location: "Newark, NJ",
    color: "#34d399",
    tags: ["JavaScript", "Web Development", "Automation", "APIs", "Performance"],
    icons: [FiCode, FaGlobe, MdOutlineAutorenew],
    points: [
      "Engineer and ship features across the NOVU platform — owning the full cycle from API integration to front-end delivery, with a focus on performance and zero-downtime releases.",
      "Architected automation pipelines for content distribution and operational reporting, eliminating hours of manual work weekly and improving cross-team data consistency.",
      "Serve as the sole technical resource on-site during live activations, diagnosing and resolving production issues in real time with no safety net.",
    ],
  },
  {
    role: "Data Analyst",
    company: "Victoria Solutions",
    date: "Apr 2025 – Jun 2025",
    location: "Remote",
    color: "#60a5fa",
    tags: ["Python", "SQL", "REST APIs", "Data Pipelines"],
    icons: [SiPython, FaDatabase, MdOutlineAnalytics],
    points: [
      "Designed and built end-to-end Python and SQL data pipelines that automated ingestion, transformation, and validation across millions of records — replacing brittle manual exports.",
      "Developed RESTful APIs that surfaced real-time analytics directly in internal dashboards, cutting reporting lag from hours to seconds and accelerating executive decisions.",
      "Partnered with business stakeholders to translate vague requirements into scoped, production-ready data products shipped within tight contract timelines.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Applied Style NJ LLC",
    date: "Jan 2023 – Feb 2025",
    location: "Edison, NJ",
    color: "#a5b4fc",
    tags: ["Flask", "AWS EC2", "PostgreSQL", "Authentication"],
    icons: [SiFlask, FaAmazon, FaDatabase],
    points: [
      "Architected and delivered the company's entire client-facing web platform from zero — REST API design, JWT authentication, session management, and PostgreSQL schema — with no prior codebase to build on.",
      "Owned production infrastructure on AWS EC2 for 2 years: configured monitoring, automated log rotation, and uptime alerting that kept the platform at near-100% availability with no dedicated DevOps support.",
      "Built an online booking system that fully replaced manual phone scheduling, saving ~3 hours of coordination per week and enabling clients to self-book around the clock.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">

        {/* HEADER */}
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h1>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Where I've worked and what I built there.
        </motion.p>

        {/* TIMELINE */}
        <div className="experience-timeline" style={{ position: "relative", maxWidth: "860px", marginTop: "40px" }}>

          {/* Vertical line — sits at x=22, exactly behind each dot center */}
          <div style={{
            position: "absolute",
            left: "22px", top: 0, bottom: 0,
            width: "2px",
            background: "linear-gradient(to bottom, rgba(96,165,250,0.5), rgba(165,180,252,0.3), rgba(165,180,252,0.1))",
          }} />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: index * 0.15 }}
              viewport={{ once: true }}
              style={{ display: "flex", gap: "24px", marginBottom: "40px", position: "relative" }}
            >
              {/* Dot — centered on the vertical line (line left=22, dot width=16, so marginLeft=14 centers it) */}
              <div style={{
                width: "16px", height: "16px",
                borderRadius: "50%",
                background: exp.color,
                marginTop: "26px",
                marginLeft: "14px",
                flexShrink: 0,
                zIndex: 2,
                boxShadow: `0 0 14px 4px ${exp.color}55`,
                border: "2px solid rgba(255,255,255,0.25)",
              }} />

              {/* Card */}
              <Tilt
                tiltEnable={!isTouch}
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareEnable={!isTouch}
                glareMaxOpacity={0.06}
                glareColor={exp.color}
                glarePosition="all"
                glareBorderRadius="20px"
                perspective={1200}
                scale={isTouch ? 1 : 1.01}
                transitionSpeed={600}
                style={{ width: "100%", borderRadius: "20px" }}
              >
              <div
                className="glass"
                style={{
                  padding: "24px 28px",
                  width: "100%",
                  borderLeft: `2px solid ${exp.color}33`,
                  transition: "border-color 0.3s ease",
                }}
              >
                {/* Top row */}
                <div className="exp-top-row" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                      {exp.role}
                    </h3>
                    <span style={{ fontSize: "14px", color: exp.color, fontWeight: 500 }}>
                      {exp.company}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>
                      {exp.date}
                    </p>
                    <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.28)", lineHeight: 1.6 }}>
                      {exp.location}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "16px" }}>
                  {exp.tags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: "11.5px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: `${exp.color}14`,
                      color: exp.color,
                      border: `1px solid ${exp.color}30`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "16px" }} />

                {/* Bullets */}
                <ul style={{ paddingLeft: "0", margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {exp.points.map((point, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: exp.color, marginTop: "6px", flexShrink: 0, fontSize: "8px" }}>▶</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7" }}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
