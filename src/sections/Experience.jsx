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
    role: "Operations & System Analyst",
    company: "Gomes Group",
    date: "May 2026 – Present",
    location: "Newark, NJ",
    color: "#34d399",
    tags: ["Google Apps Script", "Asana", "Google Workspace", "DocuSign", "Automation", "Dashboards"],
    icons: [MdOutlineAutorenew, MdOutlineAnalytics, FiCode],
    points: [
      "Developed Google Apps Script automations, Asana workflows, and reporting dashboards that streamlined leasing and property management operations, reducing manual processing time by 40%.",
      "Built integrations between Asana, Google Workspace, DocuSign, and internal property management systems, improving data visibility and reducing manual administrative work by 14%.",
      "Worked with executive leadership and property management, marketing, and community engagement teams to resolve technical issues and deliver company-wide automation initiatives.",
    ],
  },
  {
    role: "Data Analyst Intern",
    company: "Victoria Solutions",
    date: "Apr 2025 – Jun 2025",
    location: "Remote",
    color: "#60a5fa",
    tags: ["Python", "SQL", "Pandas", "PostgreSQL", "REST APIs", "ETL"],
    icons: [SiPython, FaDatabase, MdOutlineAnalytics],
    points: [
      "Engineered Python and SQL ETL pipelines processing 50M+ rows daily, optimizing query execution and batch processing workflows to reduce ingestion latency by 38%.",
      "Shipped a RESTful API layer serving real-time analytics to internal dashboards, eliminating manual reporting cycles and improving decision turnaround by 30%.",
      "Built automated data validation infrastructure with Pandas and PostgreSQL, catching schema drift and data inconsistencies before they reached production.",
    ],
  },
  {
    role: "Software Engineer & Data Analyst",
    company: "Applied Style NJ LLC",
    date: "Jan 2023 – Feb 2025",
    location: "Edison, NJ",
    color: "#a5b4fc",
    tags: ["Flask", "React", "MySQL", "AWS EC2", "Monitoring"],
    icons: [SiFlask, FaAmazon, FaDatabase],
    points: [
      "Shipped a production-grade authentication system and async order-tracking backend in Flask, handling live client data with security and reliability requirements.",
      "Owned full-stack development of internal dashboards (React, Flask, MySQL) that replaced manual reporting and surfaced real-time shop and project metrics.",
      "Scaled and hardened AWS EC2 cloud infrastructure with automated monitoring, error-logging pipelines, and observability tooling used daily by leadership.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section">
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
          {"// where I've worked"}
        </motion.p>

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
              className="exp-dot-gap"
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
                className="glass exp-glass-card"
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
