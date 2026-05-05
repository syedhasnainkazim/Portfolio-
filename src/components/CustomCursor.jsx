import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef();
  const ringRef = useRef();

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    // Scale ring up on hover over interactive elements
    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "0";
      if (ringRef.current) {
        ringRef.current.style.width   = "52px";
        ringRef.current.style.height  = "52px";
        ringRef.current.style.borderColor = "rgba(96,165,250,0.9)";
        ringRef.current.style.background  = "rgba(96,165,250,0.08)";
      }
    };
    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity = "1";
      if (ringRef.current) {
        ringRef.current.style.width   = "28px";
        ringRef.current.style.height  = "28px";
        ringRef.current.style.borderColor = "rgba(165,180,252,0.55)";
        ringRef.current.style.background  = "transparent";
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

    const timeout = setTimeout(addListeners, 600);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly to cursor */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "6px", height: "6px",
          borderRadius: "50%",
          background: "#a5b4fc",
          boxShadow: "0 0 8px 3px rgba(165,180,252,0.7)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          marginLeft: "-3px",
          marginTop: "-3px",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Ring — lags behind with lerp */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "28px", height: "28px",
          borderRadius: "50%",
          border: "1.5px solid rgba(165,180,252,0.55)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          marginLeft: "-14px",
          marginTop: "-14px",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease",
        }}
      />

      <style>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
