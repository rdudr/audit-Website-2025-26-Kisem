// Where we have worked (a drawn map of Gujarat with pins from the live rows) and Sectors.
// Industrial clusters are named in clear space beside the state, each with an arrow to its
// district pins, so no name sits on another; on a phone the names become numbered badges that
// match the cluster list next to the map.
import { useMemo, useState } from 'react';
import { titleOf, type Row } from '../../data';
import { useDevice } from '../useDevice';
import MAP from './map.json';
import { CLUSTERS } from './design';
import { cr, goTo, sumK } from './kutil';

// Projection of the design's map (Web Mercator, fitted to its city points): lng/lat -> viewBox.
const W = MAP.W, H = MAP.H;
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const px = (lng: number) => 129.7906 * lng - 8812.492;
const py = (lat: number) => -130.3729 * merc(lat) + 3463.354;

// Where each cluster's name goes (viewBox units) and which way it reads. Right-hand names sit
// over Rajasthan / Madhya Pradesh / Maharashtra, left-hand ones over the sea, spaced apart.
const CALLOUT: Record<string, { x: number; y: number; side: 'l' | 'r'; short: string }> = {
  Morbi: { x: 230, y: 440, side: 'l', short: 'Morbi ceramic' },
  Porbandar: { x: 230, y: 660, side: 'l', short: 'Porbandar–Veraval seafood' },
  Aravalli: { x: 740, y: 250, side: 'r', short: 'Modasa cold storage' },
  Ahmedabad: { x: 740, y: 400, side: 'r', short: 'Ahmedabad chemical & CETP' },
  Bharuch: { x: 740, y: 525, side: 'r', short: 'Ankleshwar–Bharuch chemical' },
  Surat: { x: 740, y: 630, side: 'r', short: 'Surat textile & diamond' },
  Vapi: { x: 740, y: 745, side: 'r', short: 'Vapi paper & chemical' },
};
// Names of the two busiest places outside the clusters, set where nothing else sits:
// Gandhinagar above-left (clear of the Ahmedabad pin, with a leader line), Bhavnagar below.
const CITY_LABEL: Record<string, { x: number; y: number; tx: string; text: string; leader?: boolean }> = {
  Gandhinagar: { x: 516, y: 332, tx: '-100%', text: 'Gandhinagar · IITGN', leader: true },
  Bhavnagar: { x: 552, y: 600, tx: '-50%', text: 'Bhavnagar' },
};

type Sel = { name: string; cities: string[] } | null;

export function KMap({ rows, signed, onOpen }: { rows: Row[]; signed: boolean; onOpen: (c: string) => void }) {
  const phone = useDevice() === 'phone';
  const [sel, setSel] = useState<Sel>(null);
  const cities = useMemo(() => {
    const by = new Map<string, Row[]>();
    for (const r of rows) if (r.lat != null && r.lng != null) by.set(r.ci, [...(by.get(r.ci) || []), r]);
    return [...by.entries()].map(([ci, L]) => ({
      ci, stt: L[0].stt, n: L.length,
      x: px(L.reduce((a, r) => a + r.lng!, 0) / L.length), y: py(L.reduce((a, r) => a + r.lat!, 0) / L.length),
    })).sort((a, b) => b.n - a.n);
  }, [rows]);
  const maxN = Math.max(1, ...cities.map(c => c.n));
  const rad = (n: number) => 11 + 15 * Math.sqrt(n / maxN);
  const clusters = (CLUSTERS as [string[], string][])
    .map(([ds, name]) => ({ ds, name, n: rows.filter(r => ds.includes(r.ci)).length, co: CALLOUT[ds[0]] }))
    .filter(c => c.n);
  const inCluster = new Set(clusters.filter(c => c.co).flatMap(c => c.ds));
  const selRows = sel ? rows.filter(r => sel.cities.includes(r.ci)) : [];
  const states = ['Gujarat', 'Rajasthan', 'Daman'].map(s => ({ s, n: rows.filter(r => r.stt === s).length })).filter(s => s.n);
  const pctX = (x: number) => (100 * x) / W + '%', pctY = (y: number) => (100 * y) / H + '%';

  return (
    <section id="map" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
          <span className="eyebrow">Where we have worked</span>
          <h2 className="h2">{rows.length} audits, {cities.length} places, one state at the centre</h2>
          <p className="lede">Pins are sized by the number of audits. Pick a place or an industrial cluster to see its audits.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
          <figure style={{ flex: '999 1 560px', minWidth: 0, margin: 0, position: 'relative', borderRadius: 28, overflow: 'hidden', background: 'radial-gradient(120% 90% at 70% 20%, #2A2350 0%, #16132A 60%, #0E0B20 100%)' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of Gujarat with audit locations and the industrial clusters" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <defs>
                  <pattern id="kdots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,.07)" /></pattern>
                  <linearGradient id="kguj" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A3170" /><stop offset="1" stopColor="#2B2552" /></linearGradient>
                  <marker id="karrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#FDBA74" /></marker>
                  <marker id="karrowOn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#FCD34D" /></marker>
                </defs>
                <rect width={W} height={H} fill="url(#kdots)" />
                <path d={MAP.paths.raj} fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.14)" strokeWidth="1" />
                <path d={MAP.paths.mp} fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <path d={MAP.paths.mh} fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <path d={MAP.paths.guj} fill="url(#kguj)" stroke="#8E7CF0" strokeWidth="1.6" strokeLinejoin="round" />
                <path d={MAP.paths.dd} fill="#3A3170" stroke="#8E7CF0" strokeWidth="1.2" />
                <text x="300" y="270" fill="rgba(255,255,255,.28)" fontSize="34" fontWeight="700" letterSpacing="10" fontFamily="Inter, sans-serif">GUJARAT</text>
                <text x="720" y="60" fill="rgba(255,255,255,.2)" fontSize="20" fontWeight="700" letterSpacing="7" fontFamily="Inter, sans-serif">RAJASTHAN</text>
                <text x="150" y="790" fill="rgba(255,255,255,.18)" fontSize="15" fontStyle="italic" letterSpacing="4" fontFamily="Inter, sans-serif">Arabian Sea</text>
                {/* Arrows from each cluster name to its district pins. */}
                {clusters.filter(c => c.co).map(c => {
                  const on = sel?.name === c.name;
                  return c.ds.map(d => {
                    const p = cities.find(x => x.ci === d);
                    if (!p) return null;
                    const sx = c.co.side === 'r' ? c.co.x - 8 : c.co.x + 8, sy = c.co.y;
                    const dx = p.x - sx, dy = p.y - sy, len = Math.hypot(dx, dy) || 1, stop = rad(p.n) + 6;
                    const ex = p.x - (dx / len) * stop, ey = p.y - (dy / len) * stop;
                    return <line key={c.name + d} x1={sx} y1={sy} x2={ex} y2={ey} stroke={on ? '#FCD34D' : '#FDBA74'} strokeWidth={on ? 2.6 : 2} strokeDasharray={on ? undefined : '6 5'} markerEnd={`url(#${on ? 'karrowOn' : 'karrow'})`} opacity={0.95} />;
                  });
                })}
                {!phone && cities.filter(p => CITY_LABEL[p.ci]?.leader && !inCluster.has(p.ci)).map(p => {
                  const l = CITY_LABEL[p.ci], dx = p.x - (l.x + 4), dy = p.y - l.y, len = Math.hypot(dx, dy) || 1, stop = rad(p.n) + 3;
                  return <line key={'lead-' + p.ci} x1={l.x + 4} y1={l.y} x2={p.x - (dx / len) * stop} y2={p.y - (dy / len) * stop} stroke="rgba(236,234,242,.7)" strokeWidth="1.4" />;
                })}
              </svg>
              {cities.map(p => {
                const on = !!sel?.cities.includes(p.ci), r = rad(p.n);
                const lab = !phone && !inCluster.has(p.ci) ? CITY_LABEL[p.ci] : undefined;
                return (
                  <div key={p.ci}>
                    <button type="button" onClick={() => setSel(on && sel?.cities.length === 1 ? null : { name: p.ci, cities: [p.ci] })} aria-label={`${p.ci}, ${p.n} audits`} aria-pressed={on}
                      style={{ position: 'absolute', left: pctX(p.x), top: pctY(p.y), width: phone ? Math.max(18, r * 1.1) : 2 * r, height: phone ? Math.max(18, r * 1.1) : 2 * r, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${on ? 3 : 2}px solid #FFFFFF`, background: on ? '#FCD34D' : '#C4B8FF', boxShadow: `0 0 0 ${on ? 8 : 5}px ${on ? 'rgba(252,211,77,.35)' : 'rgba(196,184,255,.22)'}, 0 6px 18px -6px rgba(0,0,0,.7)`, color: '#0B0A14', font: 'inherit', fontSize: phone ? 10 : p.n >= 10 ? 13 : 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, zIndex: on ? 3 : p.n >= 4 ? 2 : 1 }}>{p.n}</button>
                    {lab && (
                      <span aria-hidden="true" style={{ position: 'absolute', left: pctX(lab.x), top: pctY(lab.y), transform: `translate(${lab.tx}, -50%)`, fontSize: 13, fontWeight: 600, color: on ? '#FCD34D' : '#ECEAF2', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 1px 6px rgba(0,0,0,.8)' }}>{lab.text}</span>
                    )}
                  </div>
                );
              })}
              {clusters.filter(c => c.co).map((c, i) => {
                const on = sel?.name === c.name;
                return (
                  <button key={c.name} type="button" onClick={() => setSel(on ? null : { name: c.name, cities: c.ds })} aria-label={`${c.name}, ${c.n} audits`} aria-pressed={on}
                    style={{ position: 'absolute', left: pctX(c.co.x), top: pctY(c.co.y), transform: `translate(${c.co.side === 'l' ? '-100%' : '0'}, -50%)`, zIndex: 4, display: 'flex', alignItems: 'center', gap: 7, flexDirection: c.co.side === 'l' ? 'row-reverse' : 'row', padding: phone ? 0 : '5px 10px 5px 6px', borderRadius: 999, border: phone ? 0 : `1px solid ${on ? '#FCD34D' : 'rgba(253,186,116,.55)'}`, background: phone ? 'transparent' : on ? 'rgba(252,211,77,.16)' : 'rgba(14,11,32,.72)', color: '#FFFFFF', font: 'inherit', cursor: 'pointer', textAlign: c.co.side === 'l' ? 'right' : 'left', maxWidth: phone ? undefined : 190 }}>
                    <span className="n" style={{ width: 22, height: 22, borderRadius: '50%', background: on ? '#FCD34D' : '#FDBA74', color: '#0B0A14', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                    {!phone && <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}><span style={{ fontSize: 12, fontWeight: 700 }}>{c.co.short}</span><span className="n" style={{ fontSize: 11, color: '#FED7AA' }}>{c.n} audit{c.n === 1 ? '' : 's'}</span></span>}
                  </button>
                );
              })}
            </div>
            <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }} className="hide-sm">
              {states.map(s => <span key={s.s} style={{ height: 32, padding: '0 12px', borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', color: '#FFFFFF', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}><strong className="n">{s.n}</strong> {s.s}</span>)}
            </div>
            <div style={{ position: 'absolute', left: phone ? 8 : 16, top: phone ? 8 : 16, display: 'flex', flexDirection: 'column', gap: 6, padding: phone ? '6px 8px' : '10px 12px', borderRadius: 14, background: 'rgba(14,11,32,.6)', border: '1px solid rgba(255,255,255,.14)', color: '#DDDAE6', fontSize: phone ? 10.5 : 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#C4B8FF' }} />Audited place</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FDBA74' }} />Industrial cluster</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FCD34D' }} />Selected</span>
            </div>
          </figure>
          <aside className="card" style={{ flex: '1 1 320px', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>{sel.name}</span><button type="button" onClick={() => setSel(null)} aria-label="Show all places" style={{ height: 30, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>All places</button></div>
                <span className="n" style={{ fontSize: 14, color: 'var(--sub)' }}>{selRows.length} audits · {sumK('in', selRows)} of {sumK('rn', selRows)} ECMs implemented · {cr(sumK('ii', selRows))} a year saved</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
                  {selRows.map(r => (
                    <button key={r.c} type="button" className="row" onClick={() => onOpen(r.c)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 14, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}><span className="n" style={{ fontSize: 13, fontWeight: 700, color: '#6D5BD0', minWidth: 64 }}>{r.c}</span><span style={{ flex: 1, fontSize: 14 }}>{titleOf(r, signed)}</span><span className="n" style={{ fontSize: 12, color: 'var(--sub)' }}>{r.in ?? 0}/{r.rn ?? 0}</span></button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--mute)' }}>Industrial clusters audited in Gujarat</span>
                {clusters.map((c, i) => (
                  <button key={c.name} type="button" className="row" onClick={() => setSel({ name: c.name, cities: c.ds })} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 14, border: 0, background: 'var(--wash)', font: 'inherit', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                    <span className="n" aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: '#FDBA74', color: '#0B0A14', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                    <span className="n" style={{ minWidth: 34, height: 34, borderRadius: 10, background: '#0B0A14', color: '#FFFFFF', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.n}</span>
                  </button>
                ))}
              </div>
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
