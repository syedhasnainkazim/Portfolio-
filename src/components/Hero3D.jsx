import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Realistic potato-shaped asteroid ─────────────────────────────────────────
function Asteroid({ mouse }) {
  const groupRef = useRef();

  const geometry = useMemo(() => {
    // Start with a higher-res sphere so deformation looks smooth
    const geo = new THREE.SphereGeometry(1.0, 64, 64);
    const pos = geo.attributes.position;

    // Deterministic pseudo-random per vertex
    const rng = (n) => {
      let v = Math.sin(n * 91.3279) * 43758.5453;
      return v - Math.floor(v);
    };

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // ── 1. Elongate into potato shape (x longer, y shorter) ──
      x *= 1.55;
      y *= 0.82;
      z *= 1.10;

      // ── 2. Large-scale surface deformation (lumps & flattenings) ──
      const lump =
        Math.sin(x * 2.3 + y * 1.8) * 0.22 +
        Math.sin(y * 3.1 + z * 2.4) * 0.18 +
        Math.sin(z * 2.7 + x * 3.3) * 0.15 +
        Math.sin(x * 4.9 + z * 1.9) * 0.10 +
        Math.cos(y * 5.1 + x * 2.2) * 0.08;

      // ── 3. Fine surface roughness ──
      const rough =
        (rng(i * 5)     - 0.5) * 0.14 +
        (rng(i * 5 + 1) - 0.5) * 0.09 +
        (rng(i * 5 + 2) - 0.5) * 0.05;

      // ── 4. Deep craters — several punch-ins at specific spots ──
      const craters = [
        { cx:  0.8, cy:  0.5, cz:  0.3, r: 0.30, depth: 1.8 },
        { cx: -0.7, cy: -0.3, cz:  0.6, r: 0.24, depth: 1.5 },
        { cx:  0.2, cy:  0.9, cz: -0.4, r: 0.20, depth: 1.4 },
        { cx: -0.4, cy: -0.8, cz: -0.5, r: 0.18, depth: 1.3 },
        { cx:  0.6, cy: -0.6, cz:  0.7, r: 0.16, depth: 1.2 },
        { cx: -0.9, cy:  0.4, cz: -0.2, r: 0.22, depth: 1.4 },
        { cx:  0.1, cy: -0.2, cz: -0.9, r: 0.14, depth: 1.1 },
      ];
      let craterDent = 0;
      for (const c of craters) {
        const dist = Math.sqrt((x - c.cx) ** 2 + (y - c.cy) ** 2 + (z - c.cz) ** 2);
        if (dist < c.r) {
          const t = dist / c.r;
          // Bowl shape: deepest at center, zero at rim
          craterDent -= c.depth * Math.pow(1 - t, 2) * 0.28;
        }
      }

      const totalDisplace = lump + rough + craterDent;

      // Normalize current position and apply displacement outward
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len, ny = y / len, nz = z / len;
      const r = len + totalDisplace;

      pos.setXYZ(i, nx * r, ny * r, nz * r);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Slow irregular tumble on all 3 axes — like a real tumbling asteroid
      groupRef.current.rotation.x = t * 0.07  + mouse.current.y * 0.22;
      groupRef.current.rotation.y = t * 0.13  + mouse.current.x * 0.22;
      groupRef.current.rotation.z = t * 0.042;
      // Gentle float
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.09;
      groupRef.current.position.x = Math.cos(t * 0.28) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body — light gray rocky stone like real asteroid photos */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#b0a89a"
          roughness={1.0}
          metalness={0.0}
          emissive="#1a1612"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Subtle orbit rings */}
      <mesh rotation={[Math.PI / 2.1, 0.25, 0.15]}>
        <torusGeometry args={[2.4, 0.007, 4, 120]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 3.2, Math.PI / 4.5, 0.3]}>
        <torusGeometry args={[2.85, 0.005, 4, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.10} />
      </mesh>
    </group>
  );
}

// ── Dust/debris particle field ────────────────────────────────────────────────
function Debris() {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const count = 280;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 3.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d4ccc4"
        size={0.038}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ mouse }) {
  return (
    <>
      {/* Low ambient so shadows are visible — key to showing surface detail */}
      <ambientLight intensity={0.25} />

      {/* Strong key light from upper-right (sun side) — bright white/warm */}
      <pointLight position={[7,  4,  3]} intensity={5.0} color="#fff5e8" />

      {/* Dim fill from opposite side so dark side isn't pure black */}
      <pointLight position={[-4, -2, 1]} intensity={0.7} color="#c8d8ff" />

      {/* Subtle rim from behind for depth */}
      <pointLight position={[0,  0, -5]} intensity={0.4} color="#8b9fff" />

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
