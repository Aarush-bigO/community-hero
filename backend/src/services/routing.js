/**
 * Multi-authority routing — given a (lat, lng) and a category, find the
 * correct municipality and department.
 *
 * Uses bounding-box matching (works for the demo and for cities that haven't
 * uploaded GeoJSON polygons yet). Real GIS layers can be plugged in by replacing
 * `pointInMunicipality` with a polygon test (turf.js / RBush).
 */
import { getDb } from '../db/init.js';

export function routeReport({ lat, lng, category }) {
  const db = getDb();

  // 1. Find municipality by bbox
  const munis = db.prepare('SELECT * FROM municipalities').all();
  let muni = munis.find((m) => pointInMunicipality(lat, lng, m));
  if (!muni) muni = munis[0]; // fallback to default tenant

  // 2. Find department in that municipality whose categories include this one
  const depts = db
    .prepare('SELECT * FROM departments WHERE municipality_id = ?')
    .all(muni?.id || 'demo-city');

  let dept = depts.find((d) => {
    try {
      return JSON.parse(d.categories || '[]').includes(category);
    } catch {
      return false;
    }
  });
  if (!dept) dept = depts.find((d) => d.name?.toLowerCase().includes('general')) || depts[0];

  return {
    municipality: muni || null,
    department: dept || null,
    sla_hours: dept?.sla_hours || 72,
  };
}

export function pointInMunicipality(lat, lng, muni) {
  if (!muni?.bbox) return false;
  try {
    const bb = JSON.parse(muni.bbox);
    return lat >= bb.south && lat <= bb.north && lng >= bb.west && lng <= bb.east;
  } catch {
    return false;
  }
}

export function computeSlaDueAt(slaHours = 72) {
  const due = new Date(Date.now() + slaHours * 3600 * 1000);
  return due.toISOString().replace('T', ' ').slice(0, 19);
}
