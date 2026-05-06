import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  useEffect(() => {
    // Small delay so DOM is fully painted
    const ctx = gsap.context(() => {

      // ── Section titles: slide up + fade
      gsap.utils.toArray(".section-title").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60, skewY: 2 },
          {
            opacity: 1, y: 0, skewY: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Section subtitles: fade in slightly after title
      gsap.utils.toArray(".section-subtitle").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Glass cards: stagger up from below
      gsap.utils.toArray(".glass").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65,
            ease: "power2.out",
            delay: (i % 4) * 0.07,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── About bio paragraphs: fade up
      gsap.utils.toArray(".about-bio p").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Skills map: zoom in from center
      const skillsMap = document.querySelector(".skills-map");
      if (skillsMap) {
        gsap.fromTo(skillsMap,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsMap,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

    });

    return () => ctx.revert();
  }, []);
}
