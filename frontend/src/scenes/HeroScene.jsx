import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import StarField from './StarField.jsx';
import Globe from './Globe.jsx';

export default function HeroScene({ issues = [] }) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 6.4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#070b18', 8, 24]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[8, 6, 8]} intensity={1.4} color="#06a0ee" />
      <pointLight position={[-8, -4, -6]} intensity={0.9} color="#a855f7" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      <StarField count={3500} />

      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.5}>
        <Globe issues={issues} />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.4}
      />
    </Canvas>
  );
}
