import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { assetUrl } from '../utils/api';

// Fix default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  pothole: '#EAAA00',      // Marigold
  streetlight: '#FFD12E',  // Radiant Gold
  water: '#DDE3E8',        // Ice Silver
  waste: '#34d399',        // Emerald
  infrastructure: '#CF91C6',// Aubergine Heather
  other: '#EAAA00',        // Marigold
};

const CATEGORY_EMOJIS = {
  pothole: '🕳️',
  streetlight: '💡',
  water: '💧',
  waste: '🗑️',
  infrastructure: '🏗️',
  other: '📍',
};

export default function IssueMap({ issues = [], center = [28.6139, 77.209], zoom = 12 }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 1, isolation: 'isolate' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((i) => {
        const color = CATEGORY_COLORS[i.category] || '#EAAA00';
        const emoji = CATEGORY_EMOJIS[i.category] || '📍';
        return (
          <CircleMarker
            key={i.id}
            center={[i.lat, i.lng]}
            radius={7 + (i.severity || 3) * 1.5}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="space-y-1.5 font-sans" style={{ minWidth: 200 }}>
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide flex items-center gap-1 text-marigold-300">
                    <span>{emoji}</span> {i.category}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                    style={{
                      background: `${color}25`,
                      color: color,
                      border: `1px solid ${color}60`,
                    }}
                  >
                    Sev {i.severity}/5
                  </span>
                </div>
                {i.photo_url && (
                  <div className="w-full h-24 rounded-lg overflow-hidden my-1.5 border border-white/10 bg-[#08090C]">
                    <img
                      src={assetUrl(i.photo_url)}
                      alt={i.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <strong className="block text-sm font-semibold text-silver-100 mt-1 leading-snug">
                  {i.title}
                </strong>
                {i.address && (
                  <p className="text-[11px] text-silver-400 font-mono flex items-center gap-1">
                    📍 {i.address}
                  </p>
                )}
                {i.ai_summary && (
                  <p className="text-xs text-silver-300 leading-relaxed bg-[#08090C]/90 p-2 rounded-lg border border-white/10">
                    {i.ai_summary}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1 text-[10px] text-silver-400 font-mono">
                  <span>Status: <strong className="text-silver-200 uppercase">{i.status || 'REPORTED'}</strong></span>
                  <span>{i.confirms || 0} confirms</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

