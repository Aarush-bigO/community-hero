import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import StarField from './StarField.jsx';
import Globe from './Globe.jsx';

export default function HeroScene({ issues = [] }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.6], fov: 46 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
    >
      {/* Sun aligned with the globe's day/night shader (SUN_DIR ≈ 0.55,0.28,1.0) */}
      <directionalLight position={[3.3, 1.7, 6]} intensity={2.4} color="#fff6e8" />
      <ambientLight intensity={0.18} />

      <StarField count={4200} />

      <Suspense fallback={null}>
        <Float speed={0.5} rotationIntensity={0.12} floatIntensity={0.35}>
          <Globe issues={issues} />
        </Float>
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
