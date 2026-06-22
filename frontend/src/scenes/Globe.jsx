import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated 3D Globe with glowing issue pins.
 * Pure Three.js — no external textures needed (uses procedural materials).
 */
export default function Globe({ issues = [], radius = 2.2 }) {
  const groupRef = useRef();
  const atmosphereRef = useRef();

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.08;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y -= dt * 0.04;
  });

  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(radius, 6), [radius]);

  // Convert lat/lng to 3D coords on sphere
  const pins = useMemo(
    () =>
      issues.slice(0, 60).map((i) => {
        const phi = (90 - i.lat) * (Math.PI / 180);
        const theta = (i.lng + 180) * (Math.PI / 180);
        const r = radius + 0.05;
        return {
          id: i.id,
          severity: i.severity || 3,
          category: i.category,
          pos: [
            -r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ],
        };
      }),
    [issues, radius]
  );

  const colorFor = (cat) =>
    ({
      pothole: '#f87171',
      streetlight: '#fbbf24',
      water: '#38bdf8',
      waste: '#a3e635',
      infrastructure: '#a855f7',
    }[cat] || '#06a0ee');

  return (
    <group ref={groupRef}>
      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[radius - 0.02, 64, 64]} />
        <meshStandardMaterial
          color="#0a1535"
          emissive="#0e2761"
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={wireGeo}>
        <meshBasicMaterial color="#06a0ee" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Equator + meridian rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.02, 0.005, 8, 96]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius + 0.02, 0.005, 8, 96]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={1.18}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color="#06a0ee" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Issue pins */}
      {pins.map((p) => (
        <group key={p.id} position={p.pos}>
          <mesh>
            <sphereGeometry args={[0.04 + p.severity * 0.012, 16, 16]} />
            <meshStandardMaterial
              color={colorFor(p.category)}
              emissive={colorFor(p.category)}
              emissiveIntensity={1.4}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08 + p.severity * 0.02, 16, 16]} />
            <meshBasicMaterial color={colorFor(p.category)} transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
