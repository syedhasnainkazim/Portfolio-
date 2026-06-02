import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_ITEMS = ["Home", "About", "Projects", "Experience", "Skills", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll state for nav background
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver for active section — fires when a section
    // enters the top-third of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -80% 0px" }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Main navigation"
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
        {/* Desktop links */}
        <div className="nav-links">
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

        {/* Hamburger toggle — only visible on mobile via CSS */}
        <button
          type="button"
          className="nav-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            padding: 0,
            border: "none",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown menu + backdrop */}
      {menuOpen && (
        <div
          className="nav-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(4,4,10,0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}
      <div
        className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 64,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100vw - 24px)",
          maxWidth: "320px",
          padding: "10px",
          borderRadius: "20px",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(10,10,18,0.92)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          zIndex: 999,
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.toLowerCase();
          return (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              {item}
            </a>
          );
        })}
      </div>
    </>
  );
}
