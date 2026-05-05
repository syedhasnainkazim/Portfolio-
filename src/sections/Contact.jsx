import { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiSend, FiArrowUpRight } from "react-icons/fi";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mykojkpd";

const CONTACT_LINKS = [
  {
    icon: MdEmail,
    label: "Email",
    value: "smk88@njit.edu",
    href: "mailto:smk88@njit.edu",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.25)",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "github.com/syedhasnainkazim",
    href: "https://github.com/syedhasnainkazim",
    color: "#a5b4fc",
    glow: "rgba(165,180,252,0.25)",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/syedkazim",
    href: "https://www.linkedin.com/in/syed-hasnain-kazim1",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    icon: MdLocationOn,
    label: "Location",
    value: "New Jersey, USA",
    href: null,
    color: "#818cf8",
    glow: "rgba(129,140,248,0.20)",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">

        {/* ── HEADER ── */}
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
          {"// let's work together"}
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Get In Touch
        </motion.h1>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Have a project idea, want to collaborate, or just want to say hi?
          My inbox is always open.
        </motion.p>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "40px",
            marginTop: "32px",
            alignItems: "start",
            width: "100%",
          }}
        >

          {/* ── LEFT — INFO ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 14px",
                borderRadius: "999px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                width: "fit-content",
                marginBottom: "6px",
              }}
            >
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34,197,94,0.8)",
                animation: "pulse-dot 2s ease-in-out infinite",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "13px", color: "#86efac" }}>
                Open to opportunities
              </span>
            </motion.div>

            {/* Contact cards */}
            {CONTACT_LINKS.map((link, i) => {
              const Icon = link.icon;
              const inner = (
                <motion.div
                  key={i}
                  className="glass"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -3,
                    ...(link.href ? {
                      boxShadow: `0 8px 30px ${link.glow}`,
                      borderColor: link.color + "44",
                    } : {}),
                    transition: { duration: 0.2 },
                  }}
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: link.href ? "pointer" : "default",
                    textDecoration: "none",
                  }}
                >
                  <div style={{
                    width: "38px", height: "38px",
                    borderRadius: "10px",
                    background: link.color + "18",
                    border: `1px solid ${link.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={17} color={link.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>
                      {link.label}
                    </p>
                    <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                      {link.value}
                    </p>
                  </div>
                  {link.href && (
                    <FiArrowUpRight size={15} color="rgba(255,255,255,0.25)" />
                  )}
                </motion.div>
              );

              return link.href ? (
                <a key={i} href={link.href} target={link.href.startsWith("mailto") ? "_self" : "_blank"} rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  {inner}
                </a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>

          {/* ── RIGHT — FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="glass contact-form-card"
            style={{ minWidth: 0, width: "100%" }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px", color: "rgba(255,255,255,0.9)" }}>
              Send a message
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Name + Email row */}
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Syed Kazim"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.55)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.55)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Hey Syed, I'd love to chat about..."
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.55)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={status === "idle" ? { scale: 1.02 } : {}}
                whileTap={status === "idle" ? { scale: 0.97 } : {}}
                className="contact-send-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "13px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    status === "sent"  ? "linear-gradient(135deg, #16a34a, #15803d)" :
                    status === "error" ? "linear-gradient(135deg, #dc2626, #b91c1c)" :
                                        "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: status === "sending" ? "wait" : "pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                  transition: "background 0.3s ease, opacity 0.2s ease",
                  boxShadow:
                    status === "sent"  ? "0 8px 30px rgba(22,163,74,0.35)" :
                    status === "error" ? "0 8px 30px rgba(220,38,38,0.35)" :
                                        "0 8px 30px rgba(59,130,246,0.35)",
                  marginTop: "4px",
                }}
              >
                {status === "sent"    && <><span>✓</span> Message sent!</>}
                {status === "error"   && <><span>✕</span> Failed — try again</>}
                {status === "sending" && <>Sending…</>}
                {status === "idle"    && <><FiSend size={15} style={{ animation: "jiggle 2.5s ease-in-out infinite" }} /> Send Message</>}
              </motion.button>

            </form>
          </motion.div>

        </div>
      </div>

      {/* ── FOOTER LINE ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        style={{
          textAlign: "center",
          marginTop: "80px",
          padding: "0 20px",
          color: "rgba(255,255,255,0.18)",
          fontSize: "13px",
          fontFamily: "monospace",
        }}
      >
        Designed &amp; built by Syed Kazim · {new Date().getFullYear()}
      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes jiggle {
          0%, 100% { transform: rotate(0deg); }
          20%       { transform: rotate(-18deg) translateX(-1px); }
          40%       { transform: rotate(10deg); }
          60%       { transform: rotate(-6deg); }
          80%       { transform: rotate(3deg); }
        }
        .contact-grid input,
        .contact-grid textarea {
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .contact-grid input:focus,
        .contact-grid textarea:focus {
          box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
          .contact-form-card {
            padding: 22px 16px !important;
          }
          .contact-send-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "11px 14px",
  color: "rgba(255,255,255,0.85)",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
