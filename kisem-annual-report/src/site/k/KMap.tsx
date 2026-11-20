// Where we have worked: a sub-district (taluka) map of Gujarat, Daman, Diu and Dadra Nagar Haveli,
// each taluka shaded by the number of audits in it, with real district and state borders.
// Boundaries: geoBoundaries (LGD, ODbL), built by scripts/build-taluka-map.mjs and loaded only when
// the section is near. Audits are placed by their coordinates, but only the taluka is shown, so a
// plant's exact location never appears. Industrial clusters are numbered badges that match the list.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { titleOf, type Row } from '../../data';
import { useDevice } from '../useDevice';
import { CLUSTERS } from './design';
import { cr, goTo, sumK } from './kutil';

type Unit = { n: string; d: string; s: string; h: number; p: string; c: [number, number] };
type Geo = { W: number; H: number; frame: { w: number; e: number; s: number; n: number }; units: Unit[]; districts: string; states: string; coast: string; districtLabels: [string, number, number][] };
type Sel = { kind: 'taluka' | 'cluster'; name: string; sub: string; rows: Row[]; units: number[] } | null;

// The path format the build writes: "M x y l dx dy dx dy ... z" per ring.
function ringsOf(p: string): [number, number][][] {
  const out: [number, number][][] = [];
  for (const part of p.split('z')) {
    const m = part.match(/^M([-\d.]+) ([-\d.]+)l?(.*)$/);
    if (!m) continue;
    let x = +m[1], y = +m[2];
    const r: [number, number][] = [[x, y]];
    const n = (m[3].match(/-?\d*\.?\d+/g) || []).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; r.push([x, y]); }
    out.push(r);
  }
  return out;
}
function inside(pt: [number, number], rings: [number, number][][]) {
  let c = false;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// Shades for audits per taluka; the busiest stand out in amber.
const NONE = '#30295E';
const STEPS: [number, string, string][] = [[1, '#5443B0', '1'], [2, '#7C6AE6', '2–3'], [4, '#B4A8FF', '4–9'], [10, '#FCD34D', '10+']];
const shade = (k: number) => { let c = NONE; for (const [m, col] of STEPS) if (k >= m) c = col; return c; };
const SHORT: Record<string, string> = { Morbi: 'Morbi ceramic', Surat: 'Surat textile & diamond', Ahmedabad: 'Ahmedabad chemical & CETP', Porbandar: 'Porbandar–Veraval seafood', Aravalli: 'Modasa cold storage', Bharuch: 'Ankleshwar–Bharuch chemical', Vapi: 'Vapi paper & chemical' };
const IITGN = { lat: 23.2113, lng: 72.6842 };
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const CAP: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--mute)' };
const SVGTXT = { fontFamily: 'Inter, sans-serif', fontWeight: 700, pointerEvents: 'none' as const };

export function KMap({ rows, signed, onOpen }: { rows: Row[]; signed: boolean; onOpen: (c: string) => void }) {
  const phone = useDevice() === 'phone';
  const [geo, setGeo] = useState<Geo | null>(null);
  const [sel, setSel] = useState<Sel>(null);
  const [hover, setHover] = useState<{ u: number; x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  // On a phone the details sit below the map: bring them into view when something is picked.
  useEffect(() => { if (sel && phone) asideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [sel, phone]);

  // Load the boundaries when the section comes near the screen.
  useEffect(() => {
    const el = secRef.current;
    let done = false;
    const load = () => { if (!done) { done = true; import('./taluka-map.json').then(m => setGeo(m.default as unknown as Geo)); } };
    if (!el || !('IntersectionObserver' in window)) { load(); return; }
    const io = new IntersectionObserver(e => { if (e.some(x => x.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const proj = useMemo(() => {
    if (!geo) return null;
    const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
    const k = geo.W / (geo.frame.e - geo.frame.w), top = merc(geo.frame.n);
    return (lng: number, lat: number): [number, number] => [(lng - geo.frame.w) * k, (top - merc(lat)) * k];
  }, [geo]);

  // Each audit's taluka: inside its outline, else the nearest taluka centre (points on the coast).
  const place = useMemo(() => {
    if (!geo || !proj) return null;
    const R = geo.units.map(u => ringsOf(u.p));
    const bb = R.map(rs => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of rs) for (const [x, y] of r) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; } return [a, b, c, d]; });
    const of = new Map<string, number>();
    for (const r of rows) {
      if (r.lat == null || r.lng == null) continue;
      const p = proj(r.lng, r.lat);
      let u = R.findIndex((rs, i) => p[0] >= bb[i][0] && p[0] <= bb[i][2] && p[1] >= bb[i][1] && p[1] <= bb[i][3] && inside(p, rs));
      if (u < 0) {
        let best = 1e9;
        geo.units.forEach((x, i) => { const d = Math.hypot(x.c[0] - p[0], x.c[1] - p[1]); if (d < best) { best = d; u = i; } });
        if (best > 25) u = -1;
      }
      if (u >= 0) of.set(r.c, u);
    }
    const count = new Map<number, Row[]>();
    for (const r of rows) { const u = of.get(r.c); if (u != null) count.set(u, [...(count.get(u) || []), r]); }
    return { of, count };
  }, [geo, proj, rows]);

  const talukas = geo && place ? [...place.count.entries()].map(([u, L]) => ({ u, L, unit: geo.units[u] })).sort((a, b) => b.L.length - a.L.length) : [];
  const districts = new Set(talukas.map(t => t.unit.d + '|' + t.unit.s));
  const states = ['Gujarat', 'Rajasthan', 'Daman'].map(s => ({ s, n: rows.filter(r => r.stt === s).length })).filter(s => s.n);
  const clusters = (CLUSTERS as [string[], string][]).map(([ds, name], i) => {
    const L = rows.filter(r => ds.includes(r.ci));
    const pts = proj ? L.filter(r => r.lat != null && r.lng != null).map(r => proj(r.lng!, r.lat!)) : [];
    const at = pts.length ? [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length] : null;
    return { i: i + 1, name, short: SHORT[ds[0]] || name, L, at, units: [...new Set(L.map(r => place?.of.get(r.c)).filter((u): u is number => u != null))] };
  }).filter(c => c.L.length);
  const maxC = Math.max(1, ...clusters.map(c => c.L.length));
  const pickTaluka = (u: number) => {
    if (!geo || !place) return;
    const L = place.count.get(u) || [];
    if (!L.length) return;
    const x = geo.units[u];
    setSel(sel?.kind === 'taluka' && sel.units[0] === u ? null : { kind: 'taluka', name: x.n, sub: `${x.d} district, ${x.s}`, rows: L, units: [u] });
  };
  const pickCluster = (c: (typeof clusters)[number]) => setSel(sel?.kind === 'cluster' && sel.name === c.name ? null : { kind: 'cluster', name: c.name, sub: plural(c.units.length, 'taluka'), rows: c.L, units: c.units });
  const selUnits = new Set(sel?.units || []);
  const W = geo?.W || 1000, H = geo?.H || 799;
  const pct = (v: number, of: number) => (100 * v) / of + '%';
  const home = proj ? proj(IITGN.lng, IITGN.lat) : null;
  const hov = hover && geo ? { ...hover, unit: geo.units[hover.u], n: place?.count.get(hover.u)?.length || 0 } : null;
  // District names where audits are, except under a cluster badge or the IIT Gandhinagar star.
  const marks = [...clusters.map(c => c.at).filter((a): a is number[] => !!a), ...(home ? [home, [home[0] - 70, home[1] - 12]] : [])];
  const dLabels = geo && !phone ? geo.districtLabels.filter(([n, x, y]) => talukas.some(t => t.unit.d === n) && !marks.some(m => Math.abs(m[0] - x) < 52 && Math.abs(m[1] - (y + 24)) < 26)) : [];

  const onMove = (e: RPointerEvent, u: number) => {
    if (e.pointerType === 'touch') return;
    const b = box.current?.getBoundingClientRect();
    if (b) setHover({ u, x: e.clientX - b.left, y: e.clientY - b.top });
  };

  return (
    <section id="map" className="sec" ref={secRef}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          <span className="eyebrow">Where we have worked</span>
          <h2 className="h2">{rows.length} audits{talukas.length ? ` in ${talukas.length} talukas across ${districts.size} districts` : ''}</h2>
          <p className="lede">Each taluka is shaded by the number of audits in it. Pick a shaded taluka or an industrial cluster to see its audits.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
          <figure style={{ flex: '999 1 560px', minWidth: 0, margin: 0, position: 'relative', borderRadius: 28, overflow: 'hidden', background: 'radial-gradient(120% 90% at 70% 20%, #231D45 0%, #15122A 60%, #0E0B20 100%)', display: 'flex', flexDirection: 'column' }}>
            <div ref={box} style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}` }} onPointerLeave={() => setHover(null)}>
              {!geo && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', fontSize: 14 }}>Loading the map…</div>}
              {geo && (
                <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of Gujarat by taluka: ${talukas.length} talukas have audits`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                  {geo.units.map((u, i) => {
                    const n = place?.count.get(i)?.length || 0;
                    const hv = hover?.u === i;
                    return (
                      <path key={i} d={u.p} fill={n ? shade(n) : u.h ? NONE : 'rgba(255,255,255,.022)'} fillRule="evenodd"
                        stroke={hv ? 'rgba(255,255,255,.95)' : u.h ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.05)'} strokeWidth={hv ? 1.6 : 0.6} strokeLinejoin="round"
                        style={{ cursor: n ? 'pointer' : 'default', transition: 'fill .2s ease' }}
                        onPointerMove={e => onMove(e, i)} onClick={() => pickTaluka(i)} />
                    );
                  })}
                  <path d={geo.districts} fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.1" strokeLinejoin="round" pointerEvents="none" />
                  <path d={geo.states} fill="none" stroke="#B4A8FF" strokeWidth="1.6" strokeLinejoin="round" pointerEvents="none" />
                  <path d={geo.coast} fill="none" stroke="#9D8CF7" strokeWidth="1.5" strokeLinejoin="round" pointerEvents="none" />
                  {/* Selected talukas outlined on top, so a neighbour's border never hides the outline. */}
                  {[...selUnits].map(i => <path key={'s' + i} d={geo.units[i].p} fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" pointerEvents="none" />)}
                  <text x={110} y={765} fill="rgba(255,255,255,.24)" fontSize="17" fontStyle="italic" letterSpacing="5" {...SVGTXT} fontWeight={400}>Arabian Sea</text>
                  <text x={840} y={40} fill="rgba(255,255,255,.26)" fontSize="15" letterSpacing="6" textAnchor="middle" {...SVGTXT}>RAJASTHAN</text>
                  <text x={992} y={290} fill="rgba(255,255,255,.22)" fontSize="13" letterSpacing="4" textAnchor="end" {...SVGTXT}><tspan x={992}>MADHYA</tspan><tspan x={992} dy="17">PRADESH</tspan></text>
                  <text x={880} y={770} fill="rgba(255,255,255,.2)" fontSize="13" letterSpacing="4" textAnchor="middle" {...SVGTXT}>MAHARASHTRA</text>
                  {dLabels.map(([n, x, y]) => <text key={n} x={x} y={y + 24} fill="rgba(255,255,255,.66)" fontSize="12.5" fontWeight={600} letterSpacing=".04em" textAnchor="middle" fontFamily="Inter, sans-serif" pointerEvents="none" style={{ paintOrder: 'stroke', stroke: 'rgba(14,11,32,.8)', strokeWidth: 3 }}>{n}</text>)}
                  {home && <path pointerEvents="none" d={`M${home[0].toFixed(1)} ${(home[1] - 10).toFixed(1)}l2.9 6.2 6.8.8-5 4.6 1.4 6.7-6.1-3.4-6.1 3.4 1.4-6.7-5-4.6 6.8-.8z`} fill="#FFFFFF" stroke="#0E0B20" strokeWidth="1.2" />}
                </svg>
              )}
              {geo && home && !phone && (
                <span aria-hidden="true" style={{ position: 'absolute', left: pct(home[0] - 12, W), top: pct(home[1] - 12, H), transform: 'translate(-100%, -50%)', fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 1px 6px rgba(0,0,0,.95)' }}>IIT Gandhinagar</span>
              )}
              {geo && clusters.filter(c => c.at).map(c => {
                const on = sel?.kind === 'cluster' && sel.name === c.name;
                return (
                  <button key={c.name} type="button" onClick={() => pickCluster(c)} aria-label={`${c.name}: ${plural(c.L.length, 'audit')}`} aria-pressed={on} title={c.name}
                    style={{ position: 'absolute', left: pct(c.at![0], W), top: pct(c.at![1], H), transform: 'translate(-50%, -50%)', width: phone ? 22 : 28, height: phone ? 22 : 28, borderRadius: '50%', border: `2px solid ${on ? '#FFFFFF' : '#0E0B20'}`, background: on ? '#FFFFFF' : '#FDBA74', color: '#0B0A14', font: 'inherit', fontSize: phone ? 11 : 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, zIndex: 3, boxShadow: on ? '0 0 0 6px rgba(253,186,116,.45)' : '0 4px 12px -4px rgba(0,0,0,.8)' }}>{c.i}</button>
                );
              })}
              {hov && (
                <div role="status" style={{ position: 'absolute', left: hov.x, top: hov.y, transform: `translate(${hov.x > (box.current?.clientWidth || 0) * 0.6 ? 'calc(-100% - 14px)' : '14px'}, -50%)`, zIndex: 5, pointerEvents: 'none', padding: '8px 12px', borderRadius: 12, background: 'rgba(255,255,255,.97)', color: '#0B0A14', boxShadow: '0 10px 30px -10px rgba(0,0,0,.6)', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 14 }}>{hov.unit.n}</strong>
                  <span style={{ fontSize: 12, color: '#5E5B6B' }}>{hov.unit.d} district{hov.unit.h ? '' : ', ' + hov.unit.s}</span>
                  <span className="n" style={{ fontSize: 12.5, fontWeight: 700, color: hov.n ? '#5443B0' : '#86838F' }}>{hov.n ? plural(hov.n, 'audit') : 'No audit yet'}</span>
                </div>
              )}
            </div>
            <figcaption style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px', padding: phone ? '12px 14px 14px' : '14px 20px 16px', borderTop: '1px solid rgba(255,255,255,.08)', color: '#DDDAE6', fontSize: 12.5 }}>
              <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}>
                <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Audits per taluka</span>
                {STEPS.map(([, c, l]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: c }} />{l}</span>)}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: NONE, border: '1px solid rgba(255,255,255,.3)' }} />None yet</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#FDBA74' }} />Cluster</span>
              </span>
              <span style={{ color: 'rgba(221,218,230,.72)', fontSize: 11.5 }}>Boundaries: geoBoundaries, LGD (ODbL)</span>
            </figcaption>
          </figure>
          <aside ref={asideRef} className="card" style={{ flex: '1 1 320px', padding: 20, scrollMarginTop: 96, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {([[talukas.length, 'talukas'], [districts.size, 'districts'], [states.length, 'states and UT']] as [number, string][]).map(([n, l]) => (
                <div key={l} className="tile" style={{ borderRadius: 16, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong className="n" style={{ fontSize: 24, letterSpacing: '-.02em', lineHeight: 1.1 }}>{geo ? n : '–'}</strong>
                  <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{l}</span>
                </div>
              ))}
            </div>
            {sel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={CAP}>{sel.kind === 'cluster' ? 'Industrial cluster' : 'Taluka'}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.2 }}>{sel.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--sub)' }}>{sel.sub}</span>
                  </span>
                  <button type="button" onClick={() => setSel(null)} style={{ minHeight: 36, padding: '0 14px', borderRadius: 999, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Back to all</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                  {[[String(sel.rows.length), sel.rows.length === 1 ? 'audit' : 'audits'], [`${sumK('in', sel.rows)} of ${sumK('rn', sel.rows)}`, 'measures done'], [cr(sumK('ii', sel.rows)), 'saved a year']].map(([v, l]) => (
                    <span key={l} style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '8px 10px', borderRadius: 12, background: 'var(--wash)' }}><strong className="n" style={{ fontSize: 15 }}>{v}</strong><span style={{ fontSize: 12, color: 'var(--sub)' }}>{l}</span></span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 380, overflowY: 'auto' }}>
                  {sel.rows.map(r => (
                    <button key={r.c} type="button" className="row" onClick={() => onOpen(r.c)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 14, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{titleOf(r, signed)}</span>
                        <span className="n" style={{ fontSize: 12, color: 'var(--sub)' }}>{r.c} · {r.s}</span>
                      </span>
                      <span className="n" title="Measures implemented of those recommended" style={{ fontSize: 12, fontWeight: 700, color: '#5443B0', flexShrink: 0 }}>{r.in ?? 0}/{r.rn ?? 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ ...CAP, marginBottom: 4 }}>Industrial clusters</span>
                  {clusters.map(c => (
                    <button key={c.name} type="button" className="row" onClick={() => pickCluster(c)} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr) auto', gap: '5px 12px', alignItems: 'center', padding: '9px 10px', borderRadius: 14, border: 0, background: 'transparent', font: 'inherit', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                      <span className="n" aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', background: '#FDBA74', color: '#0B0A14', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.i}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{c.short}</span>
                      <span className="n" style={{ fontSize: 14, fontWeight: 700 }}>{c.L.length}</span>
                      <span aria-hidden="true" style={{ gridColumn: '2 / 4', height: 6, borderRadius: 999, background: 'var(--wash)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: (100 * c.L.length) / maxC + '%', borderRadius: 999, background: '#B4A8FF' }} /></span>
                    </button>
                  ))}
                </div>
                {talukas.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={CAP}>Most audited talukas</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {talukas.slice(0, 8).map(t => (
                        <button key={t.u} type="button" onClick={() => pickTaluka(t.u)} style={{ minHeight: 36, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', fontSize: 13, cursor: 'pointer', color: 'inherit' }}>
                          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: shade(t.L.length) }} />{t.unit.n}<strong className="n">{t.L.length}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <span style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.5 }}>Audits by state: {states.map(s => `${s.s} ${s.n}`).join(', ')}. The map shows the taluka only, never a plant's exact location.</span>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export function KSectors({ rows, onPick }: { rows: Row[]; onPick: (s: string) => void }) {
  const secs = [...new Set(rows.map(r => r.s))].map(s => { const X = rows.filter(r => r.s === s); return { s, n: X.length, ri: sumK('ri', X), ii: sumK('ii', X) }; }).sort((a, b) => b.ri - a.ri);
  const smax = secs[0]?.ri || 1;
  const byCity = new Map<string, number>();
  for (const r of rows) byCity.set(r.ci, (byCity.get(r.ci) || 0) + 1);
  const cc = [...byCity.entries()].sort((a, b) => b[1] - a[1]);
  const top = secs[0];
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
  return (
    <section id="sectors" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          <span className="eyebrow">Sectors</span>
          <h2 className="h2">{words[secs.length] || secs.length} industries, one method</h2>
          <p className="lede">Annual savings by sector, in ₹ crore: what the audits recommended, and what plants have achieved. Pick a sector to see its audits.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
          <div className="card" style={{ flex: '999 1 560px', minWidth: 0, padding: '10px 14px' }}>
            {secs.map(x => (
              <a key={x.s} href="#audits" className="row secrow" onClick={e => { e.preventDefault(); onPick(x.s); goTo('audits'); }} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 190px) minmax(0, 1fr) 96px', gap: 14, alignItems: 'center', padding: '9px 8px', borderRadius: 12, textDecoration: 'none' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 14, fontWeight: 600 }}>{x.s}</span><span className="n" style={{ fontSize: 12, color: 'var(--mute)' }}>{x.n} audit{x.n === 1 ? '' : 's'}</span></span>
                <span className="secbar" aria-hidden="true" style={{ position: 'relative', height: 14 }}><span style={{ position: 'absolute', left: 0, top: 0, height: 14, width: ((100 * x.ri) / smax).toFixed(1) + '%', borderRadius: 999, background: '#DCD6F5' }} /><span style={{ position: 'absolute', left: 0, top: 0, height: 14, width: ((100 * x.ii) / smax).toFixed(1) + '%', borderRadius: 999, background: '#2B2644' }} /></span>
                <span className="n" style={{ fontSize: 13, textAlign: 'right', color: 'var(--sub)' }}><strong style={{ color: 'var(--ink)' }}>{(x.ii / 1e7).toFixed(2)}</strong> / {(x.ri / 1e7).toFixed(2)}</span>
              </a>
            ))}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '10px 8px 6px', fontSize: 12, color: 'var(--sub)' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#DCD6F5' }} />Recommended</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#2B2644' }} />Achieved</span><span>₹ Cr / yr</span></div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="tile" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--mute)' }}>Top places</span>
              {cc.slice(0, 7).map(([l, n]) => <span key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span>{l}</span><span className="n" style={{ fontWeight: 700 }}>{n}</span></span>)}
              {cc.length > 7 && <span style={{ fontSize: 13, color: 'var(--sub)' }}>and {cc.length - 7} more places with {cc.slice(7).reduce((a, c) => a + c[1], 0)} audits between them</span>}
            </div>
            {top && (
              <div style={{ borderRadius: 24, padding: 22, background: '#16132A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#C4B8FF' }}>Top sector by savings identified</span>
                <span style={{ fontSize: 16, lineHeight: 1.5, color: '#ECEAF2' }}>{top.s}: {cr(top.ri)} a year recommended across {top.n} audits, {cr(top.ii)} already achieved.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
