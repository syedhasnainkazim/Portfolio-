import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef();
  const ringRef = useRef();

  useEffect(() => {
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let raf    = null;

    const LERP = 0.16;

    const tick = () => {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "0";
      if (ringRef.current) {
        ringRef.current.style.width       = "48px";
        ringRef.current.style.height      = "48px";
        ringRef.current.style.borderColor = "rgba(96,165,250,0.85)";
        ringRef.current.style.background  = "rgba(96,165,250,0.07)";
        ringRef.current.style.boxShadow   = "0 0 14px 2px rgba(96,165,250,0.25)";
      }
    };

    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "1";
      if (ringRef.current) {
        ringRef.current.style.width       = "28px";
        ringRef.current.style.height      = "28px";
        ringRef.current.style.borderColor = "rgba(165,180,252,0.55)";
        ringRef.current.style.background  = "transparent";
        ringRef.current.style.boxShadow   = "none";
      }
    };

    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, .project-card")
        .forEach(el => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    const timeout = setTimeout(addListeners, 600);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps exactly to cursor */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "7px", height: "7px",
          borderRadius: "50%",
          background: "#c4b5fd",
          boxShadow: "0 0 10px 4px rgba(196,181,253,0.75), 0 0 20px 6px rgba(165,180,252,0.3)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          marginLeft: "-3.5px",
          marginTop: "-3.5px",
          transition: "opacity 0.18s ease",
        }}
      />

      {/* Ring — trails smoothly behind cursor */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "28px", height: "28px",
          borderRadius: "50%",
          border: "1.5px solid rgba(165,180,252,0.5)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          marginLeft: "-14px",
          marginTop: "-14px",
          transition: "width 0.22s ease, height 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease",
        }}
      />

      <style>{`
        * { cursor: none !important; }
        @media (pointer: coarse) {
          .custom-cursor-dot, .custom-cursor-ring { display: none !important; }
        }
      `}</style>
    </>
  );
}
