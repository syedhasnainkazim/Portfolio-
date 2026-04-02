import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Procedural Asteroid ───────────────────────────────────────────────────────
function Asteroid({ mouse }) {
  const meshRef    = useRef();
  const craterRef  = useRef();
  const glowRef    = useRef();

  // Build bumpy asteroid geometry by displacing icosahedron vertices
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 5);
    const pos = geo.attributes.position;
    const rng = (seed) => {
      // Simple deterministic noise per vertex
      let x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Large-scale lumps
      const bump =
        Math.sin(x * 3.1 + y * 2.7) * 0.18 +
        Math.sin(y * 4.3 + z * 3.1) * 0.14 +
        Math.sin(z * 2.9 + x * 4.1) * 0.12 +
        // Fine surface roughness
        (rng(i * 3)     - 0.5) * 0.12 +
        (rng(i * 3 + 1) - 0.5) * 0.08 +
        // A few deep craters (local dents)
        Math.max(0, 0.22 - Math.sqrt((x - 0.6) ** 2 + (y - 0.8) ** 2 + (z - 0.3) ** 2)) * -1.4 +
        Math.max(0, 0.18 - Math.sqrt((x + 0.5) ** 2 + (y - 0.3) ** 2 + (z - 0.9) ** 2)) * -1.2 +
        Math.max(0, 0.16 - Math.sqrt((x - 0.2) ** 2 + (y + 0.7) ** 2 + (z + 0.6) ** 2)) * -1.1;

      const len = Math.sqrt(x * x + y * y + z * z);
      const scale = (1 + bump) / len;
      pos.setXYZ(i, x * scale, y * scale, z * scale);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Orbit path geometry — elliptical ring around the asteroid
  const orbitGeo1 = useMemo(() => new THREE.TorusGeometry(2.2, 0.008, 4, 100), []);
  const orbitGeo2 = useMemo(() => new THREE.TorusGeometry(2.7, 0.005, 4, 100), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      // Irregular tumbling — different speeds on each axis like a real asteroid
      meshRef.current.rotation.x = t * 0.09  + mouse.current.y * 0.25;
      meshRef.current.rotation.y = t * 0.15  + mouse.current.x * 0.25;
      meshRef.current.rotation.z = t * 0.055;
      // Gentle floating drift
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.08;
      meshRef.current.position.x = Math.cos(t * 0.3) * 0.05;
    }
    if (craterRef.current) {
      craterRef.current.rotation.x = -t * 0.07;
      craterRef.current.rotation.y =  t * 0.10;
    }
    if (glowRef.current) {
      glowRef.current.rotation.x = t * 0.05;
      glowRef.current.rotation.y = -t * 0.08;
    }
  });

  return (
    <group>
      {/* Main asteroid body */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#7a6a58"
          roughness={0.95}
          metalness={0.08}
          emissive="#3a2e22"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Outer dim wireframe shell — shows scale */}
      <mesh ref={craterRef}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial
          color="#a5b4fc"
          wireframe
          transparent
          opacity={0.10}
        />
      </mesh>

      {/* Subtle glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbit rings */}
      <mesh geometry={orbitGeo1} rotation={[Math.PI / 2.2, 0.3, 0.1]}>
        <meshBasicMaterial color="#818cf8" transparent opacity={0.22} />
      </mesh>
      <mesh geometry={orbitGeo2} rotation={[Math.PI / 3, Math.PI / 5, 0.2]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

// ── Floating debris field ─────────────────────────────────────────────────────
function Debris() {
  const pointsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const count = 260;
    const pos   = new Float32Array(count * 3);
    const sz    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r     = 2.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.4 + Math.random() * 1.8;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.035;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.018;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]}     />
      </bufferGeometry>
      <pointsMaterial
        color="#c4b5a0"
        size={0.042}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* Key light — warm orange like the sun to the right */}
      <pointLight position={[6,  3,  3]} intensity={3.5} color="#ff8c42" />
      {/* Fill light — cool blue from opposite side */}
      <pointLight position={[-5, -2, 2]} intensity={1.4} color="#60a5fa" />
      {/* Rim light */}
      <pointLight position={[0,  0, -5]} intensity={0.8} color="#8b5cf6" />
      <Stars radius={40} depth={30} count={800} factor={2} fade speed={0.5} />
      <Debris />
      <Asteroid mouse={mouse} />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
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
