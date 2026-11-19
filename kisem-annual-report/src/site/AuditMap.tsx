// The audit map. Markers show the audit number (and the company name only when signed in),
// and open the same audit panel as the list. Gujarat is outlined, and the districts that are
// known industrial clusters (Morbi ceramic, Surat textile, …) are ringed and labelled.
import { useMemo } from 'react';
import ReactMapGL, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { STATUS_TONE, titleOf, type Row } from '../data';
import gujarat from '../data/gujarat.json';
import { useDevice } from './useDevice';
import { clusterSpots } from './clusters';

export default function AuditMap({ rows, signed, onOpen }: { rows: Row[]; signed: boolean; onOpen: (code: string) => void }) {
  const pins = rows.filter(r => r.lat != null && r.lng != null);
  const spots = useMemo(() => clusterSpots(pins), [pins]);
  const phone = useDevice() === 'phone';
  return (
    <>
      <ReactMapGL
        initialViewState={{ longitude: 71.6, latitude: 22.4, zoom: phone ? 5.2 : 5.9 }}
        style={{ position: 'absolute', inset: 0 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        cooperativeGestures
        reuseMaps
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="gujarat" type="geojson" data={gujarat as GeoJSON.Feature}>
          <Layer id="gujarat-fill" type="fill" paint={{ 'fill-color': '#5B3FD6', 'fill-opacity': 0.07 }} />
          <Layer id="gujarat-line" type="line" paint={{ 'line-color': '#5B3FD6', 'line-width': 2, 'line-opacity': 0.75 }} />
        </Source>
        {/* Cluster districts: a soft ring under the pins, and a label above. */}
        {spots.map(s => (
          <Marker key={'ring-' + s.ci} longitude={s.lng} latitude={s.lat} anchor="center" style={{ pointerEvents: 'none' }}>
            <span aria-hidden="true" style={{ display: 'block', width: phone ? 34 : 52, height: phone ? 34 : 52, borderRadius: '50%', background: 'rgba(214,120,0,.16)', border: '2px solid rgba(214,120,0,.55)' }} />
          </Marker>
        ))}
        {pins.map(r => (
          <Marker key={r.c} longitude={r.lng!} latitude={r.lat!} anchor="center">
            <button type="button" className="pin" onClick={() => onOpen(r.c)}
              title={`${r.c} · ${titleOf(r, signed)} · ${r.ci}`}
              aria-label={`Audit ${r.c}, ${titleOf(r, signed)}, ${r.ci}. Open details.`}
              style={{ width: 16, height: 16, padding: 0, borderRadius: '50%', border: '2px solid #FFFFFF', background: STATUS_TONE[r.st][2], boxShadow: '0 1px 4px rgba(0,0,0,.35)', cursor: 'pointer' }} />
          </Marker>
        ))}
        {!phone && spots.map(s => (
          <Marker key={'label-' + s.ci} longitude={s.lng} latitude={s.lat} anchor="bottom" offset={[0, -28]} style={{ pointerEvents: 'none' }}>
            <span aria-hidden="true" style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,.95)', border: '1px solid #E8C79A', boxShadow: '0 2px 6px rgba(0,0,0,.15)', fontSize: 11, fontWeight: 700, color: '#7A4300', whiteSpace: 'nowrap' }}>{s.label} · {s.n}</span>
          </Marker>
        ))}
      </ReactMapGL>
      <div aria-hidden="true" style={{ position: 'absolute', left: 10, bottom: 10, background: 'rgba(255,255,255,.92)', borderRadius: 10, padding: '6px 10px', fontSize: 12, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', pointerEvents: 'none' }}>
        <span><strong className="n">{pins.length}</strong> audits on the map</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 3, background: '#5B3FD6', borderRadius: 2 }} />Gujarat</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(214,120,0,.16)', border: '2px solid rgba(214,120,0,.55)', boxSizing: 'border-box' }} />Industrial cluster</span>
      </div>
    </>
  );
}
