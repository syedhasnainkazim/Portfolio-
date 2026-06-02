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
    tags: ["Python", "Flask", "PostgreSQL", "React", "Automation", "RBAC"],
    icons: [MdOutlineAutorenew, MdOutlineAnalytics, FiCode],
    points: [
      "Wrote Python scripts against Yardi's REST API to extract and sync property records into a locally hosted PostgreSQL database — eliminated per-seat SaaS licensing costs and gave teams direct SQL access to their own data without routing every lookup through Yardi.",
      "Built the company's internal employee portal end-to-end with Flask + React: JWT-based auth, role-based access control, and isolated database views scoped per department (leasing, ops, property management, marketing) so each team only sees their section.",
      "Sole developer with no IT team — took requirements directly from department heads, shipped and maintained features on a live Flask/PostgreSQL/React stack across all active departments.",
    ],
  },
  {
    role: "Data Analyst",
    company: "Victoria Solutions",
    date: "Apr 2025 – Jun 2025",
    location: "Remote",
    color: "#60a5fa",
    tags: ["Python", "SQL", "Pandas", "PostgreSQL", "REST APIs", "Pipelines"],
    icons: [SiPython, FaDatabase, MdOutlineAnalytics],
    points: [
      "Built Python + Pandas ingestion pipelines that processed 50M+ records daily — parallelized worker jobs and added PostgreSQL indexed views, cutting end-to-end ingestion latency by ~40% vs. the previous sequential approach.",
      "Developed Flask REST APIs that exposed real-time analytics to internal dashboards, replacing manual reporting cycles that previously took hours with sub-second query responses.",
      "Restructured Victoria Solutions' raw datasets into normalized PostgreSQL schemas with SQLAlchemy ORM, replacing ad-hoc manual analysis with reusable Pandas pipelines — making the data maintainable and readable by non-technical team members.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Applied Style NJ LLC",
    date: "Jan 2023 – Feb 2025",
    location: "Edison, NJ",
    color: "#a5b4fc",
    tags: ["Flask", "React", "AWS EC2", "PostgreSQL", "JWT"],
    icons: [SiFlask, FaAmazon, FaDatabase],
    points: [
      "Architected the company's entire client-facing platform from zero using Flask + React — designed the REST API, JWT session management, and PostgreSQL schema with no prior codebase to start from.",
      "Owned production infrastructure on AWS EC2 for 2 years: set up CloudWatch monitoring, automated log rotation with cron + logrotate, and uptime alerting that kept the platform at near-100% availability with no dedicated DevOps support.",
      "Built an online booking system with React + Flask that replaced phone-only scheduling — clients self-book around the clock, saving ~3 hrs/week of manual coordination.",
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
