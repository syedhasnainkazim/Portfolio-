import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Realistic rocky asteroid ──────────────────────────────────────────────────
function Asteroid({ mouse }) {
  const groupRef = useRef();

  const { geometry, colors } = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.0, 80, 80);
    const pos = geo.attributes.position;
    const count = pos.count;

    // Per-vertex color array for rocky color variation
    const colArr = new Float32Array(count * 3);

    // Deterministic hash noise
    const h = (n) => { let v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
    const fbm = (x, y, z) =>
      h(x * 3.1 + y * 7.3) * 0.50 +
      h(y * 5.7 + z * 3.9) * 0.25 +
      h(z * 9.1 + x * 5.3) * 0.125 +
      h(x * 17  + z * 13)  * 0.0625;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // ── 1. Potato elongation ──
      x *= 1.6;
      y *= 0.78;
      z *= 1.05;

      const nx0 = x, ny0 = y, nz0 = z;

      // ── 2. Low-frequency lumps (big surface features) ──
      const lump =
        Math.sin(x * 1.9 + y * 1.4) * 0.26 +
        Math.sin(y * 2.8 + z * 2.1) * 0.20 +
        Math.sin(z * 2.3 + x * 2.9) * 0.17 +
        Math.sin(x * 4.1 + z * 1.7) * 0.11 +
        Math.cos(y * 4.7 + x * 1.9) * 0.08;

      // ── 3. Mid-frequency roughness ──
      const mid =
        (h(i * 7)     - 0.5) * 0.13 +
        (h(i * 7 + 1) - 0.5) * 0.09 +
        (h(i * 7 + 2) - 0.5) * 0.06;

      // ── 4. Fine-grain surface grit ──
      const grit = (h(i * 13) - 0.5) * 0.04;

      // ── 5. Craters (bowl-shaped dents) ──
      const craters = [
        { cx:  1.1, cy:  0.6, cz:  0.4, r: 0.38, d: 0.32 },
        { cx: -0.9, cy: -0.3, cz:  0.7, r: 0.30, d: 0.26 },
        { cx:  0.3, cy:  1.0, cz: -0.5, r: 0.26, d: 0.22 },
        { cx: -0.5, cy: -0.9, cz: -0.6, r: 0.22, d: 0.20 },
        { cx:  0.7, cy: -0.7, cz:  0.8, r: 0.20, d: 0.18 },
        { cx: -1.1, cy:  0.5, cz: -0.3, r: 0.28, d: 0.24 },
        { cx:  0.2, cy: -0.3, cz: -1.0, r: 0.18, d: 0.16 },
        { cx: -0.3, cy:  0.8, cz:  0.9, r: 0.16, d: 0.14 },
      ];
      let dent = 0;
      for (const c of craters) {
        const dist = Math.sqrt((x-c.cx)**2 + (y-c.cy)**2 + (z-c.cz)**2);
        if (dist < c.r) {
          const t = dist / c.r;
          dent -= c.d * (1 - t * t); // parabolic bowl
        }
      }

      const len = Math.sqrt(x*x + y*y + z*z);
      const disp = lump + mid + grit + dent;
      const r = Math.max(0.3, len + disp);
      pos.setXYZ(i, (x/len)*r, (y/len)*r, (z/len)*r);

      // ── 6. Per-vertex color: mix warm brown, cool gray, dark shadow ──
      const noise = fbm(nx0 * 1.4, ny0 * 1.4, nz0 * 1.4);
      // Base: warm gray (like real chondrite asteroids)
      const baseR = 0.54 + noise * 0.22;
      const baseG = 0.48 + noise * 0.18;
      const baseB = 0.40 + noise * 0.14;
      // Dark patches (iron-rich areas)
      const darkFactor = h(i * 23 + 5) < 0.18 ? 0.55 : 1.0;
      // Bright highlights on ridges (silica)
      const brightFactor = noise > 0.72 ? 1.25 : 1.0;
      colArr[i*3]   = Math.min(1, baseR * darkFactor * brightFactor);
      colArr[i*3+1] = Math.min(1, baseG * darkFactor * brightFactor);
      colArr[i*3+2] = Math.min(1, baseB * darkFactor * brightFactor);
    }

    geo.computeVertexNormals();
    geo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    return { geometry: geo, colors: colArr };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.065 + mouse.current.y * 0.20;
      groupRef.current.rotation.y = t * 0.110 + mouse.current.x * 0.20;
      groupRef.current.rotation.z = t * 0.038;
      groupRef.current.position.y = Math.sin(t * 0.33) * 0.09;
      groupRef.current.position.x = Math.cos(t * 0.26) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.97}
          metalness={0.0}
          envMapIntensity={0}
        />
      </mesh>

      {/* Thin orbit rings */}
      <mesh rotation={[Math.PI / 2.1, 0.25, 0.15]}>
        <torusGeometry args={[2.5, 0.006, 4, 128]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 3.2, Math.PI / 4.5, 0.3]}>
        <torusGeometry args={[2.95, 0.004, 4, 128]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ── Debris / dust ─────────────────────────────────────────────────────────────
function Debris() {
  const ref = useRef();
  const positions = useMemo(() => {
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
  }, []);

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
function Scene({ mouse }) {
  return (
    <>
      {/* Low ambient — let the key light do the work for dramatic shading */}
      <ambientLight intensity={0.55} />

      {/* Strong key light from upper-left (opposite the sun on the right) */}
      <pointLight position={[-6, 5, 4]}  intensity={6.0} color="#e8dfd0" />

      {/* Warm bounce from sun side */}
      <pointLight position={[5, -2, 2]}  intensity={1.8} color="#ff9955" />

      {/* Cool rim from behind */}
      <pointLight position={[0, 2, -5]}  intensity={0.9} color="#99aaff" />

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
