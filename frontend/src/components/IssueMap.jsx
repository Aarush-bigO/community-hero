import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  pothole: '#f87171',
  streetlight: '#fbbf24',
  water: '#38bdf8',
  waste: '#a3e635',
  infrastructure: '#a855f7',
};

export default function IssueMap({ issues = [], center = [28.6139, 77.209], zoom = 12 }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((i) => (
        <CircleMarker
          key={i.id}
          center={[i.lat, i.lng]}
          radius={6 + (i.severity || 3) * 1.5}
          pathOptions={{
            color: CATEGORY_COLORS[i.category] || '#06a0ee',
            fillColor: CATEGORY_COLORS[i.category] || '#06a0ee',
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong>{i.title}</strong>
              <br />
              <small style={{ color: '#64748b' }}>
                {i.category} · sev {i.severity}/5
              </small>
              <br />
              <span>{i.ai_summary}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
