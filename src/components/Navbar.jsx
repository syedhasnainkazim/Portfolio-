import { useEffect, useState } from "react";

const NAV_ITEMS = ["Home", "About", "Projects", "Experience", "Skills", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Find which section is currently in view
      let current = "home";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.toLowerCase());
        if (el && el.getBoundingClientRect().top <= 120) {
          current = item.toLowerCase();
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="nav-pill"
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 28px",
        borderRadius: "40px",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        background: scrolled
          ? "rgba(10,10,18,0.72)"
          : "rgba(10,10,18,0.45)",
        border: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        zIndex: 1000,
        boxShadow: scrolled
          ? "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 16px rgba(0,0,0,0.25)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.toLowerCase();
        return (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              position: "relative",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "13.5px",
              fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.01em",
              color: isActive ? "#fff" : "rgba(255,255,255,0.52)",
              background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
              border: isActive ? "1px solid rgba(255,255,255,0.13)" : "1px solid transparent",
              textDecoration: "none",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.52)";
            }}
          >
            {item}
            {isActive && (
              <span style={{
                position: "absolute",
                bottom: "4px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#60a5fa",
                boxShadow: "0 0 6px rgba(96,165,250,0.9)",
              }} />
            )}
          </a>
        );
      })}
    </div>
  );
}
