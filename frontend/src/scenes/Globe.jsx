import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Photoreal Earth.
 *
 * NASA Blue Marble day map blended against a city-lights night map across a
 * physically-correct day/night terminator (custom shader), with ocean specular
 * highlights, a drifting cloud layer, and a Fresnel atmosphere halo. Issue
 * locations are projected to the surface as glowing markers that rotate with
 * the planet. Textures are bundled in /public/textures (self-contained).
 */

// Sun aimed toward the viewer/upper-right so the lit Blue-Marble face dominates
// and the night-lights terminator falls along the left limb.
const SUN_DIR = new THREE.Vector3(0.55, 0.28, 1.0).normalize();

// --- Earth surface: day/night blend + ocean specular -----------------------
const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vWorldNormal);
    float d = dot(n, normalize(sunDir));
    float dayAmount = smoothstep(-0.28, 0.32, d);

    // Brighten + slightly saturate the Blue Marble day side for a crisp hero look.
    vec3 day = texture2D(dayMap, vUv).rgb;
    day = pow(day, vec3(0.90)) * 1.22;
    vec3 night = texture2D(nightMap, vUv).rgb;
    // warm, boosted city lights on the dark side
    night *= vec3(1.55, 1.4, 1.05) * 1.3;

    vec3 color = mix(night, day, dayAmount);

    // Ocean specular: water mask is bright over water.
    float water = texture2D(specMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 halfV = normalize(normalize(sunDir) + viewDir);
    float spec = pow(max(dot(n, halfV), 0.0), 28.0) * water * dayAmount;
    color += vec3(0.7, 0.82, 1.0) * spec * 0.9;

    // gentle atmospheric tint near the terminator
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.0);
    color += vec3(0.20, 0.45, 0.85) * rim * 0.18 * dayAmount;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// --- Atmosphere: Fresnel rim glow (rendered on a larger back-side shell) -----
const atmoVertex = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const atmoFragment = /* glsl */ `
  uniform vec3 sunDir;
  uniform vec3 glowColor;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - abs(dot(n, viewDir)), 2.8);
    float lit = smoothstep(-0.4, 0.6, dot(n, normalize(sunDir)));
    float intensity = fres * (0.45 + 0.75 * lit);
    gl_FragColor = vec4(glowColor, intensity);
  }
`;

const colorFor = (cat) =>
  ({
    pothole: '#ff5a5a',
    streetlight: '#ffc43d',
    water: '#3bc9ff',
    waste: '#a3e635',
    infrastructure: '#c084fc',
  }[cat] || '#22d3ee');

export default function Globe({ issues = [], radius = 2.4 }) {
  const earthRef = useRef();
  const cloudRef = useRef();
  const pinsRef = useRef();

  const [dayMap, nightMap, specMap, bumpMap, cloudMap] = useTexture([
    '/textures/earth-day.jpg',
    '/textures/earth-night.jpg',
    '/textures/earth-water.png',
    '/textures/earth-bump.png',
    '/textures/earth-clouds.png',
  ]);

  // Color management + crispness
  useMemo(() => {
    [dayMap, nightMap].forEach((t) => t && (t.colorSpace = THREE.SRGBColorSpace));
    [dayMap, nightMap, specMap, bumpMap, cloudMap].forEach((t) => {
      if (t) {
        t.anisotropy = 8;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      }
    });
  }, [dayMap, nightMap, specMap, bumpMap, cloudMap]);

  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          dayMap: { value: dayMap },
          nightMap: { value: nightMap },
          specMap: { value: specMap },
          sunDir: { value: SUN_DIR },
        },
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
      }),
    [dayMap, nightMap, specMap]
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          sunDir: { value: SUN_DIR },
          glowColor: { value: new THREE.Color('#4aa8ff') },
        },
        vertexShader: atmoVertex,
        fragmentShader: atmoFragment,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  // Project issues onto the sphere
  const pins = useMemo(
    () =>
      issues.slice(0, 80).map((i) => {
        const phi = (90 - i.lat) * (Math.PI / 180);
        const theta = (i.lng + 180) * (Math.PI / 180);
        const r = radius + 0.01;
        return {
          id: i.id,
          severity: i.severity || 3,
          color: colorFor(i.category),
          pos: [
            -r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ],
        };
      }),
    [issues, radius]
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.035;
    if (pinsRef.current) pinsRef.current.rotation.y += dt * 0.035;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.05;
    // subtle marker pulse
    if (pinsRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.12;
      pinsRef.current.children.forEach((g) => {
        if (g.children[1]) g.children[1].scale.setScalar(s);
      });
    }
  });

  return (
    <group>
      {/* Earth surface */}
      <mesh ref={earthRef} material={earthMat}>
        <sphereGeometry args={[radius, 96, 96]} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[radius * 1.012, 72, 72]} />
        <meshStandardMaterial
          alphaMap={cloudMap}
          transparent
          opacity={0.45}
          depthWrite={false}
          color="#ffffff"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Atmosphere halo */}
      <mesh material={atmoMat} scale={1.16}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {/* Issue markers (rotate with the planet) */}
      <group ref={pinsRef}>
        {pins.map((p) => (
          <group key={p.id} position={p.pos}>
            <mesh>
              <sphereGeometry args={[0.028 + p.severity * 0.007, 14, 14]} />
              <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.07 + p.severity * 0.015, 16, 16]} />
              <meshBasicMaterial color={p.color} transparent opacity={0.22} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
