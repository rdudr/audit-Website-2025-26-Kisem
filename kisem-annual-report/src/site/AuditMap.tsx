// The audit map. Markers show the audit number (and the company name only when signed in),
// and open the same audit panel as the list.
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { STATUS_TONE, titleOf, type Row } from '../data';

export default function AuditMap({ rows, signed, onOpen }: { rows: Row[]; signed: boolean; onOpen: (code: string) => void }) {
  const pins = rows.filter(r => r.lat != null && r.lng != null);
  return (
    <>
      <ReactMapGL
        initialViewState={{ longitude: 71.8, latitude: 22.6, zoom: 5.6 }}
        style={{ position: 'absolute', inset: 0 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        cooperativeGestures
        reuseMaps
      >
        <NavigationControl position="top-right" showCompass={false} />
        {pins.map(r => (
          <Marker key={r.c} longitude={r.lng!} latitude={r.lat!} anchor="center">
            <button type="button" className="pin" onClick={() => onOpen(r.c)}
              title={`${r.c} · ${titleOf(r, signed)} · ${r.ci}`}
              aria-label={`Audit ${r.c}, ${titleOf(r, signed)}, ${r.ci}. Open details.`}
              style={{ width: 16, height: 16, padding: 0, borderRadius: '50%', border: '2px solid #FFFFFF', background: STATUS_TONE[r.st][2], boxShadow: '0 1px 4px rgba(0,0,0,.35)', cursor: 'pointer' }} />
          </Marker>
        ))}
      </ReactMapGL>
      <div aria-hidden="true" style={{ position: 'absolute', left: 10, bottom: 10, background: 'rgba(255,255,255,.92)', borderRadius: 10, padding: '6px 10px', fontSize: 12, display: 'flex', gap: 12, flexWrap: 'wrap', pointerEvents: 'none' }}>
        <span><strong className="n">{pins.length}</strong> audits on the map</span>
      </div>
    </>
  );
}
