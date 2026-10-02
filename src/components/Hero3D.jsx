import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// ── Debris / dust ─────────────────────────────────────────────────────────────
// Computed once at module load — positions are random but fixed for the session,
// so they live outside the component to keep render pure.
const DEBRIS_POSITIONS = (() => {
  const count = 300;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3.0 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
  }
  return pos;
})();

function Debris() {
  const ref = useRef();
  const positions = DEBRIS_POSITIONS;

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.028;
      ref.current.rotation.x = clock.getElapsedTime() * 0.013;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8bdb0" size={0.034} transparent opacity={0.50} sizeAttenuation />
    </points>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <Stars radius={40} depth={30} count={800} factor={2} fade speed={0.5} />
      <Debris />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
