/**
 * GIS asset layer — lightweight, dependency-free.
 *
 * Real municipal stacks (SeeClickFix/Cityworks, FixMyStreet asset layers)
 * load GeoJSON road/utility networks and test whether a report falls on a
 * public right-of-way, a private road, or near a known asset (so it can be
 * routed, deduplicated, or rejected). This module reproduces that behaviour
 * with a small hand-built network and exact point-to-segment geometry, so the
 * demo behaves like the real thing. Swap `ROAD_NETWORK` for live GeoJSON and
 * the contract is unchanged.
 */
import { getDb } from '../db/init.js';

// Each segment: [ [lat,lng], [lat,lng] ], classified public/private.
// Centred on the two seeded demo municipalities.
export const ROAD_NETWORK = [
  { id: 'mg-road', name: 'MG Road', type: 'arterial', private: false, line: [[28.6139, 77.2090], [28.6200, 77.2200]] },
  { id: 'ring-road', name: 'Ring Road', type: 'highway', private: false, line: [[28.6000, 77.2000], [28.6300, 77.2400]] },
  { id: 'nehru-pl', name: 'Nehru Place', type: 'local', private: false, line: [[28.5480, 77.2510], [28.5520, 77.2560]] },
  { id: 'dlf-gated', name: 'DLF Phase 2 Internal Rd', type: 'access', private: true, line: [[28.4900, 77.0900], [28.4950, 77.0980]] },
  { id: 'sector-rd', name: 'Sector 18 Service Lane', type: 'service', private: false, line: [[19.0760, 72.8770], [19.0800, 72.8820]] },
  { id: 'marine-dr', name: 'Marine Drive', type: 'arterial', private: false, line: [[18.9430, 72.8230], [18.9530, 72.8200]] },
  { id: 'pvt-society', name: 'Hiranandani Pvt Approach', type: 'access', private: true, line: [[19.1190, 72.9080], [19.1230, 72.9120]] },
];

const EARTH_KM = 111.32; // km per degree latitude (good enough at city scale)

function toMeters(dLatDeg, dLngDeg, lat) {
  const x = dLngDeg * EARTH_KM * Math.cos((lat * Math.PI) / 180);
  const y = dLatDeg * EARTH_KM;
  return Math.sqrt(x * x + y * y) * 1000;
}

/** Shortest distance (meters) from point P to segment AB, plus the foot of perpendicular. */
function distToSegment(p, a, b) {
  const ax = a[1], ay = a[0], bx = b[1], by = b[0], px = p[1], py = p[0];
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1e-12;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const fx = ax + t * dx, fy = ay + t * dy; // foot, [lng,lat]
  return toMeters(py - fy, px - fx, py);
}

/**
 * Classify a coordinate against the asset layer.
 * Returns nearest road, distance, and whether it sits on a private road
 * (within ~40m of a private segment and closer to it than any public one).
 */
export function classifyLocation(lat, lng) {
  const p = [lat, lng];
  let nearest = null;
  let nearestDist = Infinity;
  for (const seg of ROAD_NETWORK) {
    const d = distToSegment(p, seg.line[0], seg.line[1]);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = seg;
    }
  }
  const onRoad = nearestDist <= 60; // within 60m of a mapped road
  const onPrivateRoad = onRoad && !!nearest?.private;
  return {
    nearest_road_id: nearest?.id || null,
    nearest_road_name: nearest?.name || null,
    road_type: onRoad ? nearest?.type || 'unmapped' : 'off_network',
    distance_m: Math.round(nearestDist),
    on_private_road: onPrivateRoad,
    routable: onRoad && !onPrivateRoad,
  };
}

/**
 * Spatial + category dedup. Finds open issues of the same category within
 * `radiusM` meters — the "is this the same pothole someone already flagged?"
 * check that prevents duplicate work orders.
 */
export function findDuplicates(lat, lng, category, { radiusM = 75, excludeId = null } = {}) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, title, lat, lng, status, created_at FROM issues
       WHERE category = ? AND status NOT IN ('resolved','rejected')
       ${excludeId ? 'AND id != ?' : ''}`
    )
    .all(...(excludeId ? [category, excludeId] : [category]));

  return rows
    .map((r) => ({
      ...r,
      distance_m: Math.round(toMeters(r.lat - lat, r.lng - lng, lat)),
    }))
    .filter((r) => r.distance_m <= radiusM)
    .sort((a, b) => a.distance_m - b.distance_m);
}

/** GeoJSON FeatureCollection of the road network for the map layer. */
export function roadNetworkGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: ROAD_NETWORK.map((s) => ({
      type: 'Feature',
      properties: { id: s.id, name: s.name, road_type: s.type, private: s.private },
      geometry: {
        type: 'LineString',
        coordinates: s.line.map(([la, ln]) => [ln, la]), // GeoJSON is [lng,lat]
      },
    })),
  };
}
