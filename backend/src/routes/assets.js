/**
 * GIS asset-layer endpoints.
 *   GET /api/assets/roads.json        → road network as GeoJSON (map overlay)
 *   GET /api/assets/classify?lat=&lng= → classify a point (public/private/off-network)
 *   GET /api/assets/duplicates?lat=&lng=&category= → nearby open duplicates
 */
import { Router } from 'express';
import { classifyLocation, findDuplicates, roadNetworkGeoJSON } from '../services/assets.js';

const router = Router();

router.get('/roads.json', (_req, res) => res.json(roadNetworkGeoJSON()));

router.get('/classify', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng))
    return res.status(400).json({ error: 'lat and lng required' });
  res.json(classifyLocation(lat, lng));
});

router.get('/duplicates', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const { category } = req.query;
  if (Number.isNaN(lat) || Number.isNaN(lng) || !category)
    return res.status(400).json({ error: 'lat, lng, category required' });
  res.json(findDuplicates(lat, lng, category, { radiusM: Number(req.query.radius_m) || 75 }));
});

export default router;
