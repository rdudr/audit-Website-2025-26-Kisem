import { useMemo } from 'react';
import { n0, type Row } from '../data';
import { useDevice } from './useDevice';
import { useCountUp } from '../lib/hooks';

// Savings by industry and where the audits were (canvas "Component · Audits and sectors").
// Picking a sector filters the audit list above, as before.
export default function SectorsSection({ rows, onPick }: { rows: Row[]; onPick: (sector: string) => void }) {
  const dev = useDevice();
  // Bars grow and figures count up the first time they scroll into view, as on the landing.
  const [ref, p] = useCountUp<HTMLDivElement>(1400);
  const D = dev === 'desktop', T = dev === 'tablet';

  const v = useMemo(() => {
    const sg: Record<string, { n: number; ri: number; ii: number }> = {};
    rows.forEach(r => { const g = (sg[r.s] ||= { n: 0, ri: 0, ii: 0 }); g.n++; g.ri += n0(r.ri); g.ii += n0(r.ii); });
    const sectors = Object.entries(sg).sort((a, b) => b[1].ri - a[1].ri);
    const smax = sectors[0]?.[1].ri || 1;
    const st: Record<string, number> = {}, ci: Record<string, number> = {};
    rows.forEach(r => { st[r.stt] = (st[r.stt] || 0) + 1; ci[r.ci] = (ci[r.ci] || 0) + 1; });
    const states = Object.entries(st).sort((a, b) => b[1] - a[1]);
    const cities = Object.entries(ci).sort((a, b) => b[1] - a[1]);
    return { sectors, smax, states, top: cities.slice(0, 7), rest: cities.slice(7), cmax: cities[0]?.[1] || 1 };
  }, [rows]);
  const restN = v.rest.reduce((a, [, n]) => a + n, 0);
  const top = v.sectors[0];

  const L = {
    pad: D ? '104px 40px 0' : T ? '80px 32px 0' : '64px 16px 0', h2: D ? 48 : T ? 40 : 32, lede: D ? 18 : 16,
    sCols: D ? 'minmax(0, 1.6fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
    sbCols: D || T ? 'minmax(120px, 190px) minmax(0, 1fr) 96px' : '108px minmax(0, 1fr) 80px',
  };
  const cr = (x: number) => (x / 1e7).toFixed(2);

  return (
    <section id="sectors" className="rd" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
        <span className="rd-eyebrow">Sectors</span>
        <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>{v.sectors.length === 16 ? 'Sixteen' : v.sectors.length} industries, one method</h2>
        <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>Annual savings by sector, in ₹ crore: what the audits recommended, and what plants have achieved. Pick a sector to see its audits.</p>
      </div>
      <div ref={ref} style={{ display: 'grid', gridTemplateColumns: L.sCols, gap: 20, alignItems: 'start' }}>
        <div style={{ border: '1px solid #E7E5EE', borderRadius: 22, padding: 14, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '6px 10px 10px' }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#55526A' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#BDB6E3' }} />Recommended</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#15803D' }} />Achieved</span>
            </div>
            <span style={{ fontSize: 12, color: '#6B6880' }}>₹ Cr / yr</span>
          </div>
          {v.sectors.map(([name, g]) => (
            <button key={name} type="button" className="rd-sbar" onClick={() => onPick(name)}
              aria-label={`${name}: ${g.n} audits, ₹ ${cr(g.ii)} crore achieved of ₹ ${cr(g.ri)} crore recommended. Show these audits.`}
              style={{ display: 'grid', gridTemplateColumns: L.sbCols, gap: 14, alignItems: 'center', padding: '8px 10px', border: 0, borderRadius: 12, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 600, color: '#0F0D1A' }}>{name}</span><span style={{ fontSize: 12, color: '#6B6880' }}>{g.n} audits</span></span>
              <span style={{ position: 'relative', height: 18, borderRadius: 6, background: '#F4F3F8', display: 'block' }}>
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (100 * g.ri * p / v.smax).toFixed(1) + '%', background: '#BDB6E3', borderRadius: 6 }} />
                <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: (100 * g.ii * p / v.smax).toFixed(1) + '%', background: '#15803D', borderRadius: 4 }} />
              </span>
              <span style={{ fontSize: 13, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}><b style={{ color: '#0E6B33' }}>{cr(g.ii * p)}</b> <span style={{ color: '#55526A' }}>/ {cr(g.ri * p)}</span></span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div style={{ borderRadius: 22, background: '#1E1A33', color: '#FFFFFF', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4B8FF' }}>Where we have worked</span>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, v.states.length)}, minmax(0, 1fr))`, gap: 8 }}>
              {v.states.slice(0, 3).map(([s, n]) => (
                <div key={s} style={{ padding: 12, borderRadius: 14, background: 'rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 26 }}>{Math.round(n * p)}</b><span style={{ fontSize: 12, color: '#C9C5D6' }}>{s}</span></div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {v.top.map(([name, n]) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) 28px', gap: 10, alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: '#ECEAF2' }}>{name}</span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.1)', display: 'flex', overflow: 'hidden' }}><span style={{ width: Math.round(100 * n * p / v.cmax) + '%', background: '#C4B8FF', borderRadius: 999 }} /></span>
                  <b style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{n}</b>
                </div>
              ))}
            </div>
            {v.rest.length > 0 && <span style={{ fontSize: 12, color: '#C9C5D6' }}>and {v.rest.length} more places with {restN} audits between them</span>}
          </div>
          {top && (
            <div style={{ border: '1px solid #E7E5EE', borderRadius: 22, padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <b style={{ fontSize: 15 }}>Top sector by savings identified</b>
              <span style={{ fontSize: 14, lineHeight: 1.55, color: '#55526A' }}>{top[0] === 'CETP' ? 'Common effluent treatment plants' : top[0]}: ₹ {cr(top[1].ri)} Cr a year recommended across {top[1].n} audits, ₹ {cr(top[1].ii)} Cr already achieved.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
