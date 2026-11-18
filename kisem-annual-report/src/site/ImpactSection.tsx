import { useMemo, useState } from 'react';
import { FOLLOW_UPS, FYS, STATUSES, sum, type Row } from '../data';
import { useDevice } from './useDevice';
import { useCountUp } from '../lib/hooks';

// Impact and year by year (canvas "Component · Impact and year by year"), worked out from the audits.

const ind = (v: number) => Math.round(v).toLocaleString('en-IN');
const cr = (v: number) => '₹ ' + (v / 1e7).toFixed(2) + ' Cr';
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0) + '%';
const STATUS_COL: Record<string, string> = { 'Implementation verified': '#15803D', 'Post assessment done': '#2F6FC4', 'Post-audit pending': '#5B3FD6', 'Report under process': '#A3A0B5' };
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
type Metric = 'audits' | 'savings' | 'co2' | 'ecm';

export default function ImpactSection({ rows }: { rows: Row[] }) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const [m, setM] = useState<Metric>('savings');
  // Figures count up and bars grow the first time each block scrolls into view, as on the landing.
  const [kRef, p] = useCountUp<HTMLDivElement>(1400);
  const [cRef, c] = useCountUp<HTMLDivElement>(1400);

  const v = useMemo(() => {
    const t = (k: keyof Row) => sum(rows, k);
    const Y = FYS.map(fy => {
      const r = rows.filter(x => x.fy === fy);
      const rn = sum(r, 'rn'), inn = sum(r, 'in');
      return { fy, label: 'FY ' + fy.slice(2, 4) + '–' + fy.slice(5), full: 'FY ' + fy.replace('-', '–'), n: r.length, rn, in: inn, ri: sum(r, 'ri') / 1e7, ii: sum(r, 'ii') / 1e7, rc: sum(r, 'rc'), ic: sum(r, 'ic'), pc: rn ? Math.round((100 * inn) / rn) : 0 };
    }).filter(y => y.n > 0);
    return { Y, ri: t('ri'), ii: t('ii'), rn: t('rn'), in: t('in'), rc: t('rc'), ic: t('ic'), rk: t('rk'), ik: t('ik'), e: t('e'), cost: t('cost'), rv: t('rv'), iv: t('iv') };
  }, [rows]);

  const late = 'Implementation is recorded 3–5 months after each audit, so the latest year reads low until the post-audit visits are done.';
  const DEFS: Record<Metric, { tab: string; title: string; sub: string; aLabel: string; bLabel: string; a: 'rn' | 'ri' | 'rc' | null; b: 'in' | 'ii' | 'rc' | 'ic' | 'pc'; f: (x: number) => string; note: string }> = {
    audits: { tab: 'Audits & ECMs', title: 'Measures recommended and implemented', sub: 'Energy conservation measures (ECMs) per audit year', aLabel: 'Recommended', bLabel: 'Implemented', a: 'rn', b: 'in', f: ind, note: `${ind(v.rn)} measures recommended; ${ind(v.in)} carried out so far.` },
    savings: { tab: 'Energy savings', title: 'Annual savings, ₹ crore', sub: 'Recommended in the audits against what plants achieved', aLabel: 'Recommended', bLabel: 'Achieved', a: 'ri', b: 'ii', f: x => x.toFixed(2), note: `${cr(v.ri)} a year recommended; ${cr(v.ii)} a year achieved. ${late}` },
    co2: { tab: 'CO₂ reduction', title: 'CO₂ reduction, tonnes a year', sub: 'Potential identified against reduction achieved', aLabel: 'Potential', bLabel: 'Achieved', a: 'rc', b: 'ic', f: ind, note: `${ind(v.rc)} t a year of potential; ${ind(v.ic)} t a year achieved.` },
    ecm: { tab: 'Implementation', title: 'Implementation rate', sub: 'Share of recommended measures carried out, by audit year', aLabel: 'Recommended (100%)', bLabel: 'Implemented', a: null, b: 'pc', f: x => Math.round(x) + '%', note: `${pct(v.in, v.rn)} of all measures implemented. ${late}` },
  };
  const def = DEFS[m];
  const val = (y: (typeof v.Y)[number], k: string | null) => (k ? (y as unknown as Record<string, number>)[k] : 100);
  const grow = (x: number) => x * c;
  const mx = def.a ? Math.max(1e-9, ...v.Y.map(y => Math.max(val(y, def.a), val(y, def.b)))) : 100;
  const hh = (x: number) => Math.max(x ? 2 : 0, Math.round((82 * x) / mx)) + '%';
  const bars = v.Y.map(y => ({ label: D || T ? y.full : y.label, aText: def.a ? def.f(grow(val(y, def.a))) : '', bText: def.f(grow(val(y, def.b))), aH: hh(grow(val(y, def.a))), bH: hh(grow(val(y, def.b))) }));
  const aria = def.title + ': ' + bars.map(b => b.label + ' ' + (b.aText ? def.aLabel + ' ' + b.aText + ', ' : '') + def.bLabel + ' ' + b.bText).join('; ');

  const pairs = [
    { label: 'Annual cost savings', d: 'M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10', rec: cr(v.ri * p), imp: cr(v.ii * p), share: pct(v.ii * p, v.ri) },
    { label: 'Measures (ECMs)', d: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14l-3-3', rec: ind(v.rn * p), imp: ind(v.in * p), share: pct(v.in * p, v.rn) },
    { label: 'CO₂ reduction, t / yr', d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.4 5.2-6', rec: ind(v.rc * p), imp: ind(v.ic * p), share: pct(v.ic * p, v.rc) },
    { label: 'Electricity saved, kWh / yr', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', rec: (v.rk * p / 1e5).toFixed(1) + ' lakh', imp: (v.ik * p / 1e5).toFixed(1) + ' lakh', share: pct(v.ik * p, v.rk) },
  ];
  const baseline = [
    { label: 'Electricity assessed', v: (v.e * p / 1e6).toFixed(1) + ' GWh', sub: 'A year, all assessed plants' },
    { label: 'Energy bill assessed', v: cr(v.cost * p), sub: 'Electricity and fuel, a year' },
    { label: 'Investment proposed', v: cr(v.rv * p), sub: cr(v.iv * p) + ' already invested by plants' },
    { label: 'Average payback', v: v.ri ? Math.max(1, Math.round((12 * v.rv) / v.ri)) + ' months' : '—', sub: 'On the recommended measures' },
  ];
  const statuses = STATUSES.map(s => ({ s, n: rows.filter(r => r.st === s).length, c: STATUS_COL[s] }));
  const first = v.Y[0];

  const L = {
    pad: D ? '104px 40px 0' : T ? '80px 32px 0' : '64px 16px 0', h2: D ? 48 : T ? 40 : 32, lede: D ? 18 : 16,
    kCols: D ? 'repeat(4, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', bCols: D ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
    yCols: D || T ? `repeat(${v.Y.length}, minmax(0, 1fr))` : 'repeat(2, minmax(0, 1fr))', chartPad: D ? '28px' : T ? '24px' : '18px 14px',
    chartH: D ? 320 : T ? 280 : 240, barGap: D ? 32 : T ? 20 : 8, barW: D ? 56 : T ? 44 : 30,
  };
  const eyebrow = (t: string) => <span className="rd-eyebrow">{t}</span>;
  const h2 = (t: string) => <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>{t}</h2>;
  const lede = (t: string) => <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>{t}</p>;

  return (
    <div className="rd">
      <section id="impact" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
          {eyebrow('Impact')}{h2('Recommended, and actually achieved')}
          {lede('Every audit recommends energy conservation measures (ECMs). About 3 months after the report a separate team verifies what the plant implemented, and about 6 months after it we do a post assessment.')}
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#55526A' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 8, borderRadius: 999, background: '#BDB6E3' }} />Recommended</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 8, borderRadius: 999, background: '#15803D' }} />Achieved</span>
        </div>
        <div ref={kRef} style={{ display: 'grid', gridTemplateColumns: L.kCols, gap: 16 }}>
          {pairs.map(k => (
            <div key={k.label} className="rd-lift" style={{ background: '#FFFFFF', border: '1px solid #E7E5EE', borderRadius: 22, padding: 22, display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={k.d} /></svg></span>{k.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <b style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{k.share}</b>
                <span style={{ fontSize: 13, color: '#55526A' }}>achieved so far</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#55526A' }}><span>Recommended</span><b style={{ color: '#0F0D1A', fontVariantNumeric: 'tabular-nums' }}>{k.rec}</b></span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: '#EEECF3', display: 'flex', overflow: 'hidden' }}><span style={{ width: (100 * p).toFixed(1) + '%', background: '#BDB6E3', borderRadius: 999 }} /></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#55526A' }}><span>Achieved</span><b style={{ color: '#0F0D1A', fontVariantNumeric: 'tabular-nums' }}>{k.imp}</b></span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: '#EEECF3', display: 'flex', overflow: 'hidden' }}><span style={{ width: k.share, background: '#15803D', borderRadius: 999 }} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: L.bCols, border: '1px solid #E7E5EE', borderRadius: 20, overflow: 'hidden', background: '#FAFAFC' }}>
          {baseline.map(b => (
            <div key={b.label} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 4, borderRight: '1px solid #E7E5EE', borderBottom: '1px solid #E7E5EE', margin: '0 -1px -1px 0' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#55526A' }}>{b.label}</span>
              <b style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{b.v}</b>
              <span style={{ fontSize: 12, color: '#6B6880' }}>{b.sub}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRadius: 20, border: '1px solid #E7E5EE' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><b style={{ fontSize: 15 }}>Where each audit stands</b><span style={{ fontSize: 13, color: '#6B6880' }}>{rows.length} audits</span></div>
          <div aria-hidden="true" style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', gap: 3, width: (100 * p).toFixed(1) + '%' }}>
            {statuses.filter(s => s.n).map(s => <span key={s.s} style={{ flex: s.n, background: s.c }} />)}
          </div>
          <div style={{ display: 'flex', gap: '8px 22px', flexWrap: 'wrap', fontSize: 13 }}>
            {statuses.map(s => <span key={s.s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: s.c }} /><b>{Math.round(s.n * p)}</b><span style={{ color: '#55526A' }}>{s.s}</span></span>)}
          </div>
          {/* The two follow-up checks, counted on their own: an audit can have one without the other. */}
          <div style={{ display: 'grid', gridTemplateColumns: D || T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', gap: 12, paddingTop: 6 }}>
            {FOLLOW_UPS.map(f => {
              const n = rows.filter(r => r[f.key] === 1).length;
              return (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 16px', borderRadius: 16, background: '#FAFAFC', border: '1px solid #ECEAF2', minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <b style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: f.key === 'vr' ? '#15803D' : '#1D4F91' }}>{Math.round(n * p)}</b>
                    <span style={{ fontSize: 14, color: '#55526A' }}>of {rows.length} audits</span>
                  </span>
                  <span aria-hidden="true" style={{ height: 6, borderRadius: 999, background: '#E4E1F1', display: 'flex', overflow: 'hidden' }}><span style={{ width: (rows.length ? (100 * n * p) / rows.length : 0).toFixed(1) + '%', background: f.key === 'vr' ? '#15803D' : '#2F6FC4' }} /></span>
                  <b style={{ fontSize: 14, fontWeight: 600 }}>{f.key === 'vr' ? 'Implementation verified' : 'Post assessment done'}</b>
                  <span style={{ fontSize: 13, lineHeight: 1.5, color: '#6B6880' }}>{f.key === 'vr' ? 'Checked at the plant by a separate team, about 3 months after the report.' : 'A return visit about 6 months after the report.'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="journey" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
            {eyebrow('Year by year')}{h2(`${WORDS[v.Y.length] ?? v.Y.length} years of impact`)}
            {first && lede(`From ${first.n} pilot audits in ${first.full} to ${rows.length} detailed audits today.`)}
          </div>
          <div role="tablist" aria-label="Chart" style={{ display: 'flex', gap: 2, padding: 4, background: '#F4F3F8', borderRadius: 14, flexWrap: 'wrap', maxWidth: '100%' }}>
            {(Object.keys(DEFS) as Metric[]).map(k => {
              const on = k === m;
              return <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setM(k)} style={{ height: 40, padding: '0 14px', border: 0, borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: on ? '#FFFFFF' : 'transparent', color: on ? '#0F0D1A' : '#55526A', boxShadow: on ? '0 1px 3px rgba(15,13,26,.14)' : 'none' }}>{DEFS[k].tab}</button>;
            })}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: L.yCols, gap: 12 }}>
          {v.Y.map(y => (
            <div key={y.fy} style={{ padding: 16, borderRadius: 18, background: '#FAFAFC', border: '1px solid #E7E5EE', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6B6880' }}>{y.full}</span>
              <b style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>{y.n} <span style={{ fontSize: 13, fontWeight: 500, color: '#55526A', letterSpacing: 0 }}>audits</span></b>
              <span style={{ fontSize: 12, color: '#55526A' }}>{ind(y.rn)} ECMs · ₹ {y.ri.toFixed(2)} Cr identified</span>
            </div>
          ))}
        </div>
        <div ref={cRef} style={{ border: '1px solid #E7E5EE', borderRadius: 24, padding: L.chartPad, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><b style={{ fontSize: 17 }}>{def.title}</b><span style={{ fontSize: 13, color: '#55526A' }}>{def.sub}</span></div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#55526A' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#BDB6E3' }} />{def.aLabel}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#15803D' }} />{def.bLabel}</span>
            </div>
          </div>
          <div role="img" aria-label={aria} style={{ position: 'relative', height: L.chartH, display: 'grid', gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`, gap: L.barGap, alignItems: 'end', borderBottom: '1px solid #D9D7E3', backgroundImage: 'linear-gradient(#F0EFF4 1px, transparent 1px)', backgroundSize: '100% 25%' }}>
            {bars.map(b => (
              <div key={b.label} style={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
                <div style={{ height: '100%', width: L.barW, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#55526A', fontVariantNumeric: 'tabular-nums' }}>{b.aText}</span>
                  <span style={{ width: '100%', height: b.aH, background: '#BDB6E3', borderRadius: '8px 8px 0 0', transition: 'height .5s ease' }} />
                </div>
                <div style={{ height: '100%', width: L.barW, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0E6B33', fontVariantNumeric: 'tabular-nums' }}>{b.bText}</span>
                  <span style={{ width: '100%', height: b.bH, background: '#15803D', borderRadius: '8px 8px 0 0', transition: 'height .5s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`, gap: L.barGap, marginTop: -10 }}>
            {bars.map(b => <span key={b.label} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{b.label}</span>)}
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#55526A', paddingTop: 14, borderTop: '1px solid #F0EFF4' }}>{def.note}</p>
        </div>
      </section>
    </div>
  );
}
