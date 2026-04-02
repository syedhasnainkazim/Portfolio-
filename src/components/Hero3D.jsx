import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Floating wireframe icosahedron core ──────────────────────────────────────
function CoreSphere({ mouse }) {
  const meshRef  = useRef();
  const outerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12 + mouse.current.y * 0.3;
      meshRef.current.rotation.y = t * 0.18 + mouse.current.x * 0.3;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.08;
      outerRef.current.rotation.y =  t * 0.11;
    }
  });

  return (
    <group>
      {/* Inner glowing distorted sphere */}
      <Sphere ref={meshRef} args={[1.15, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.6}
          distort={0.38}
          speed={2.2}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Outer wireframe icosahedron shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.72, 1]} />
        <meshBasicMaterial
          color="#a5b4fc"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Second spinning ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.008, 4, 80]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[2.45, 0.006, 4, 80]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ── Floating particle field ──────────────────────────────────────────────────
function Particles() {
  const pointsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const count = 220;
    const pos   = new Float32Array(count * 3);
    const sz    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere shell between r=3 and r=7
      const r     = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]}     />
      </bufferGeometry>
      <pointsMaterial
        color="#93c5fd"
        size={0.045}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ── Scene wrapper ─────────────────────────────────────────────────────────────
function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4,  4,  4]} intensity={2.5} color="#3b82f6" />
      <pointLight position={[-4, -3, 2]} intensity={1.8} color="#8b5cf6" />
      <pointLight position={[0,  0, -4]} intensity={1.0} color="#ec4899" />
      <Stars radius={40} depth={30} count={800} factor={2} fade speed={0.6} />
      <Particles />
      <CoreSphere mouse={mouse} />
    </>
  );
}

// ── Exported component ────────────────────────────────────────────────────────
export default function Hero3D({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene mouse={mouse} />
    </Canvas>
  );
}
