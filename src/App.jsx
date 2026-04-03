import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import Background from "./components/Background";
import ShootingStars from "./components/ShootingStars";
import ScrollExtras from "./components/ScrollExtras";
import Loader from "./components/Loader";
import useScrollAnimations from "./hooks/useScrollAnimations";
import CustomCursor from "./components/CustomCursor";

function App() {
  const [loading, setLoading] = useState(true);
  useScrollAnimations();

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="app-root">
        {/* 🌌 GLOBAL BACKGROUND */}
        <CustomCursor />
        <Background />
        <ShootingStars />

        {/* 🧭 NAVBAR */}
        <ScrollExtras />
        <Navbar />

        {/* 📦 MAIN CONTENT */}
        <main
          className="main-container"
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Contact />
        </main>
      </div>
    </>
  );
}

export default App;
