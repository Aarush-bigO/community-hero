import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import StarField from './StarField.jsx';
import Globe from './Globe.jsx';
import { useStore } from '../store/useStore.js';

function CameraController() {
  const focusCoords = useStore((s) => s.focusCoords);
  const controlsRef = useRef();

  useFrame((state, delta) => {
    if (focusCoords && typeof focusCoords.lat === 'number' && typeof focusCoords.lng === 'number') {
      const phi = (90 - focusCoords.lat) * (Math.PI / 180);
      const theta = (focusCoords.lng + 180) * (Math.PI / 180);
      const dist = 5.6;
      const targetPos = new THREE.Vector3(
        -dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.cos(phi),
        dist * Math.sin(phi) * Math.sin(theta)
      );
      state.camera.position.lerp(targetPos, delta * 3.2);
      state.camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      autoRotate={false}
      rotateSpeed={0.35}
      minPolarAngle={Math.PI / 3.0}
      maxPolarAngle={Math.PI / 1.6}
      minDistance={3.8}
      maxDistance={8.5}
    />
  );
}

export default function HeroScene({ issues = [] }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.6], fov: 46 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
    >
      {/* Sun aligned with the globe's day/night shader (SUN_DIR ≈ 0.55, 0.28, 1.0) */}
      <directionalLight position={[3.3, 1.7, 6]} intensity={2.4} color="#fff6e8" />
      <ambientLight intensity={0.2} />

      <StarField count={4200} />

      <Suspense fallback={null}>
        <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.25}>
          <Globe issues={issues} />
        </Float>
      </Suspense>

      <CameraController />
    </Canvas>
  );
}
