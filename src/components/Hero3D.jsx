import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ── Real asteroid model ───────────────────────────────────────────────────────
function Asteroid({ mouse }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/models/asteroid.glb");

  // Clone so we can modify materials without affecting the cached original
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color:             "#b0a89a",
          roughness:         1.0,
          metalness:         0.0,
          emissive:          new THREE.Color("#1a1612"),
          emissiveIntensity: 0.1,
        });
        child.castShadow    = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.07  + mouse.current.y * 0.22;
      groupRef.current.rotation.y = t * 0.13  + mouse.current.x * 0.22;
      groupRef.current.rotation.z = t * 0.042;
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.09;
      groupRef.current.position.x = Math.cos(t * 0.28) * 0.06;
    }
  });

  return (
    <group ref={groupRef} scale={[0.012, 0.012, 0.012]}>
      <primitive object={model} />

      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 2.1, 0.25, 0.15]} scale={[85, 85, 85]}>
        <torusGeometry args={[2.4, 0.007, 4, 120]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 3.2, Math.PI / 4.5, 0.3]} scale={[85, 85, 85]}>
        <torusGeometry args={[2.85, 0.005, 4, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.10} />
      </mesh>
    </group>
  );
}

// ── Dust/debris particle field ────────────────────────────────────────────────
function Debris() {
  const pointsRef = useRef();

  const positions = useMemo(() => {
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
    return pos;
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
      <pointsMaterial color="#d4ccc4" size={0.038} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[7,  4,  3]} intensity={5.0} color="#fff5e8" />
      <pointLight position={[-4, -2, 1]} intensity={0.7} color="#c8d8ff" />
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

useGLTF.preload("/models/asteroid.glb");
