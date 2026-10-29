import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Photoreal Real Earth with Geopolitical Boundaries & Cloud Layer.
 *
 * Uses NASA Blue Marble day texture, city-lights night map, real ocean specular highlights,
 * drifting cloud layer, atmospheric Fresnel halo, and crisp country boundary overlays.
 */

const SUN_DIR = new THREE.Vector3(0.55, 0.28, 1.0).normalize();

// --- Earth Surface Shader: Real Day/Night Blend + Ocean Specular + Boundaries ---
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
  uniform sampler2D borderMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vWorldNormal);
    float d = dot(n, normalize(sunDir));
    float dayAmount = smoothstep(-0.25, 0.32, d);

    // 1. Photoreal Blue Marble Day Side
    vec3 day = texture2D(dayMap, vUv).rgb;
    day = pow(day, vec3(0.92)) * 1.25;

    // 2. Warm City Lights on Night Side
    vec3 night = texture2D(nightMap, vUv).rgb;
    night *= vec3(1.6, 1.45, 1.1) * 1.35;

    // Blend across terminator
    vec3 color = mix(night, day, dayAmount);

    // 3. Ocean Specular Reflection
    float water = texture2D(specMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 halfV = normalize(normalize(sunDir) + viewDir);
    float spec = pow(max(dot(n, halfV), 0.0), 32.0) * water * dayAmount;
    color += vec3(0.75, 0.88, 1.0) * spec * 0.95;

    // 4. Geopolitical Country Boundaries Overlay
    vec4 border = texture2D(borderMap, vUv);
    if (border.a > 0.05) {
      vec3 borderGlow = mix(vec3(1.0, 1.0, 1.0), vec3(0.4, 0.85, 1.0), 0.35);
      color = mix(color, borderGlow, border.a * 0.75);
    }

    // 5. Atmospheric Rim Tint near Horizon
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.2);
    color += vec3(0.18, 0.48, 0.9) * rim * 0.22 * dayAmount;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// --- Atmosphere Fresnel Rim Shader ---
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
    gl_FragColor = vec4(glowColor, intensity * 0.85);
  }
`;

// International Crisis / Flight Hubs
const GLOBAL_HUBS = [
  { id: 'delhi', name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278 },
  { id: 'geneva', name: 'Geneva', lat: 46.2044, lng: 6.1432 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'sf', name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lng: 151.2093 },
];

const HUB_CONNECTIONS = [
  ['delhi', 'dubai'],
  ['delhi', 'london'],
  ['delhi', 'tokyo'],
  ['delhi', 'singapore'],
  ['london', 'geneva'],
  ['london', 'sf'],
  ['dubai', 'geneva'],
  ['singapore', 'sydney'],
  ['sf', 'tokyo'],
];

export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const colorFor = (cat) =>
  ({
    pothole: '#ff5a5a',
    streetlight: '#ffc43d',
    water: '#3bc9ff',
    waste: '#a3e635',
    infrastructure: '#c084fc',
  }[cat] || '#22d3ee');

export default function Globe({ issues = [], radius = 2.45 }) {
  const globeGroupRef = useRef();
  const earthRef = useRef();
  const cloudRef = useRef();
  const pinsRef = useRef();
  const tracerGroupRef = useRef();

  // Load NASA photoreal textures + country borders overlay
  const [dayMap, nightMap, specMap, cloudMap, borderMap] = useTexture([
    '/textures/earth-day.jpg',
    '/textures/earth-night.jpg',
    '/textures/earth-water.png',
    '/textures/earth-clouds.png',
    '/textures/country-borders-overlay.png',
  ]);

  useMemo(() => {
    [dayMap, nightMap, specMap, cloudMap, borderMap].forEach((t) => {
      if (t) {
        t.anisotropy = 16;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      }
    });
    if (dayMap) dayMap.colorSpace = THREE.SRGBColorSpace;
    if (nightMap) nightMap.colorSpace = THREE.SRGBColorSpace;
    if (borderMap) borderMap.colorSpace = THREE.SRGBColorSpace;
  }, [dayMap, nightMap, specMap, cloudMap, borderMap]);

  // Shader Material for Earth with photoreal Day/Night + Borders
  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          dayMap: { value: dayMap },
          nightMap: { value: nightMap },
          specMap: { value: specMap },
          borderMap: { value: borderMap },
          sunDir: { value: SUN_DIR },
        },
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
      }),
    [dayMap, nightMap, specMap, borderMap]
  );

  // Atmosphere Halo Material
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

  // Great Circle Global Arcs
  const { arcGeometries, arcCurves } = useMemo(() => {
    const hubMap = new Map(GLOBAL_HUBS.map((h) => [h.id, h]));
    const curves = [];
    const geoms = [];

    HUB_CONNECTIONS.forEach(([id1, id2]) => {
      const h1 = hubMap.get(id1);
      const h2 = hubMap.get(id2);
      if (!h1 || !h2) return;

      const v1 = latLngToVector3(h1.lat, h1.lng, radius);
      const v2 = latLngToVector3(h2.lat, h2.lng, radius);
      const dist = v1.distanceTo(v2);

      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const arcAltitude = radius + Math.min(dist * 0.22, 0.95);
      mid.normalize().multiplyScalar(arcAltitude);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      curves.push(curve);

      const pts = curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      geoms.push(geom);
    });

    return { arcGeometries: geoms, arcCurves: curves };
  }, [radius]);

  // Project Issue Pins onto sphere (strictly deduplicated)
  const pins = useMemo(() => {
    const seen = new Set();
    const unique = [];
    for (const i of issues) {
      const id = i.id || i.ticket_id;
      if (id && seen.has(id)) continue;
      if (id) seen.add(id);
      unique.push(i);
      if (unique.length >= 100) break;
    }
    return unique.map((i, idx) => {
      const isVoice = Boolean(
        i.is_voice_dispatch || i.urgency_score >= 8 || String(i.title || '').includes('VOICE')
      );
      const isDispatched = String(i.dispatch_status || '').includes('EN_ROUTE');
      const reportCount = i.report_count || 1;

      let pinColor = colorFor(i.category);
      if (isVoice) {
        pinColor = isDispatched ? '#00f0ff' : '#ff2a5f';
      }

      const pos = latLngToVector3(i.lat, i.lng, radius + 0.008);

      return {
        id: i.id || `pin-${idx}`,
        severity: i.severity || 3,
        color: pinColor,
        isVoice,
        isDispatched,
        reportCount,
        pos: [pos.x, pos.y, pos.z],
      };
    });
  }, [issues, radius]);

  // Animation Frame Loop
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // Rotate Earth and Clouds
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.032;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.048;
    if (globeGroupRef.current) globeGroupRef.current.rotation.y += dt * 0.032;

    // Animate traveling pulse particles on flight/dispatch arcs
    if (tracerGroupRef.current && arcCurves.length > 0) {
      tracerGroupRef.current.children.forEach((mesh, idx) => {
        const curve = arcCurves[idx];
        if (curve) {
          const progress = (t * 0.22 + idx * 0.12) % 1.0;
          const pos = curve.getPoint(progress);
          mesh.position.copy(pos);
        }
      });
    }

    // Pulse emergency pins & expanding shockwave rings
    if (pinsRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.12;
      const emergencyPulse = 1 + Math.sin(t * 5.0) * 0.35;
      const shockwaveScale = 1 + ((t * 2.5) % 3.0) * 0.8;
      const shockwaveOpacity = Math.max(0, 1 - ((t * 2.5) % 3.0) / 3.0);

      pinsRef.current.children.forEach((g) => {
        if (g.children[1]) g.children[1].scale.setScalar(s);
        if (g.children[2]) g.children[2].scale.setScalar(emergencyPulse);
        if (g.children[3]) {
          g.children[3].scale.setScalar(shockwaveScale);
          if (g.children[3].material) {
            g.children[3].material.opacity = shockwaveOpacity * 0.7;
          }
        }
      });
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* 1. Photoreal Earth Surface (Blue Marble Day + Night City Lights + Country Borders) */}
      <mesh ref={earthRef} material={earthMat}>
        <sphereGeometry args={[radius, 96, 96]} />
      </mesh>

      {/* 2. Real Drifting Cloud Layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[radius * 1.012, 72, 72]} />
        <meshStandardMaterial
          alphaMap={cloudMap}
          transparent
          opacity={0.42}
          depthWrite={false}
          color="#ffffff"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* 3. Atmospheric Halo Shell */}
      <mesh material={atmoMat} scale={1.16}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {/* 4. Global Great Circle Flight / Emergency Arcs */}
      <group>
        {arcGeometries.map((geom, idx) => (
          <primitive key={idx} object={new THREE.Line(
            geom,
            new THREE.LineBasicMaterial({
              color: '#67e8f9',
              transparent: true,
              opacity: 0.32,
              blending: THREE.AdditiveBlending,
            })
          )} />
        ))}
      </group>

      {/* 5. Traveling Light Particles on Arcs */}
      <group ref={tracerGroupRef}>
        {arcCurves.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* 6. Community Hero Active Emergency Pins */}
      <group ref={pinsRef}>
        {pins.map((p, idx) => (
          <group key={`${p.id}-${idx}`} position={p.pos}>
            <mesh>
              <sphereGeometry args={[0.028 + p.severity * 0.007, 14, 14]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.color}
                emissiveIntensity={p.isVoice ? 4.5 : 2.2}
                toneMapped={false}
              />
            </mesh>

            <mesh>
              <sphereGeometry args={[0.07 + p.severity * 0.015, 16, 16]} />
              <meshBasicMaterial color={p.color} transparent opacity={p.isVoice ? 0.45 : 0.22} toneMapped={false} />
            </mesh>

            {/* 3D Vertical Emergency Beacon */}
            {p.isVoice && (
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.008, 0.018, 0.16, 8]} />
                <meshBasicMaterial color={p.color} transparent opacity={0.85} toneMapped={false} />
              </mesh>
            )}

            {/* Expanding Shockwave Ring for Swarm Surge Clusters */}
            {p.isVoice && p.reportCount > 1 && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.09, 32]} />
                <meshBasicMaterial color="#ff2a5f" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
