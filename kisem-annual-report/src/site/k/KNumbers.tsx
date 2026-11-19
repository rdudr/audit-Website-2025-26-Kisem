// Impact (recommended against achieved, where each audit stands) and Year by year.
import { useState } from 'react';
import { FYS, STATUSES, type Row, type Status } from '../../data';
import { I } from './design';
import { SC, cr, indN, lakh, pctS, sumK, totals } from './kutil';

export function KImpact({ rows, onStatus }: { rows: Row[]; onStatus: (s: Status) => void }) {
  const R = rows, T = totals(R);
  const pairs = [
    { label: 'Annual cost savings', d: I.rupee, big: cr(T.ii), bigLabel: 'saved a year by plants', rec: cr(T.ri), imp: cr(T.ii), w: pctS(T.ii, T.ri) },
    { label: 'Measures (ECMs)', d: I.check, big: pctS(T.in, T.rn), bigLabel: 'of ECMs implemented', rec: String(T.rn), imp: String(T.in), w: pctS(T.in, T.rn) },
    { label: 'CO₂ reduction, t / yr', d: I.leaf, big: indN(T.ic) + ' t', bigLabel: 'CO₂e avoided a year', rec: indN(T.rc), imp: indN(T.ic), w: pctS(T.ic, T.rc) },
    { label: 'Electricity saved, kWh / yr', d: I.bolt, big: lakh(T.ik) + ' lakh kWh', bigLabel: 'saved a year', rec: lakh(T.rk) + ' lakh', imp: lakh(T.ik) + ' lakh', w: pctS(T.ik, T.rk) },
  ];
  const baseline = [
    { label: 'Electricity assessed', v: (T.e / 1e6).toFixed(1) + ' GWh', sub: 'A year, all assessed plants' },
    { label: 'Energy bill assessed', v: cr(T.cost), sub: 'Electricity and fuel, a year' },
    { label: 'Investment proposed', v: cr(T.rv), sub: cr(T.iv) + ' already invested by plants' },
    { label: 'Average payback', v: (T.ri ? Math.round((12 * T.rv) / T.ri) : 0) + ' months', sub: 'On the recommended measures' },
  ];
  const statusBar = STATUSES.map(s => ({ label: s, n: R.filter(r => r.st === s).length, c: SC[s][2] }));
  const vr = R.filter(r => r.vr === 1).length, pa = R.filter(r => r.pa === 1).length;
  const checks = [
    { label: 'Implementation verified', n: vr, sub: 'Checked at the plant by a separate team, about 3 months after the report.', col: '#0B7A45' },
    { label: 'Post assessment done', n: pa, sub: 'A return visit about 6 months after the report.', col: '#6D5BD0' },
  ];
  return (
    <section id="impact" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
          <span className="eyebrow">Impact</span>
          <h2 className="h2">Recommended, and actually achieved</h2>
          <p className="lede">Every audit recommends energy conservation measures (ECMs). About 3 months after the report a separate team verifies what the plant implemented, and about 6 months after it we do a post assessment.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 14 }}>
          {pairs.map(k => (
            <article key={k.label} className="tile press" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--sub)' }}><span style={{ width: 34, height: 34, borderRadius: 11, background: '#0B0A14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={k.d} /></svg></span>{k.label}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="n" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1, color: 'var(--ok)' }}>{k.big}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{k.bigLabel}</span></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span aria-hidden="true" style={{ position: 'relative', height: 10, borderRadius: 999, background: '#DCD8EA', overflow: 'hidden' }}><span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: k.w, borderRadius: 999, background: 'linear-gradient(90deg, #0B7A45, #34C77B)' }} /></span>
                <span className="n" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', fontSize: 13, color: 'var(--sub)' }}><span>Recommended <strong style={{ color: 'var(--ink)' }}>{k.rec}</strong></span><span>Achieved <strong style={{ color: 'var(--ok)' }}>{k.imp}</strong></span></span>
              </span>
            </article>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {baseline.map(b => (
            <div key={b.label} style={{ padding: '22px 20px 22px 0', display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 13, color: 'var(--sub)' }}>{b.label}</span><span className="n" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.03em' }}>{b.v}</span><span style={{ fontSize: 13, color: 'var(--mute)' }}>{b.sub}</span></div>
          ))}
        </div>
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}><h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>Where each audit stands</h3><span className="n" style={{ fontSize: 14, color: 'var(--sub)' }}>{R.length} audits</span></div>
          <div role="img" aria-label={statusBar.map(s => s.n + ' ' + s.label).join(', ')} style={{ display: 'flex', height: 16, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
            {statusBar.filter(s => s.n).map(s => <span key={s.label} title={`${s.label}: ${s.n}`} style={{ flex: s.n, background: s.c }} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
            {statusBar.map(s => (
              <button key={s.label} type="button" onClick={() => onStatus(s.label)} className="press" style={{ textAlign: 'left', border: '1px solid var(--line)', background: '#FFFFFF', borderRadius: 16, padding: '12px 14px', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.c, flexShrink: 0 }} /><span className="n" style={{ fontSize: 22, fontWeight: 700 }}>{s.n}</span><span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.3 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 12 }}>
            {checks.map(c => (
              <div key={c.label} className="tile" style={{ padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <svg width="58" height="58" viewBox="0 0 36 36" aria-hidden="true" style={{ flexShrink: 0 }}><circle cx="18" cy="18" r="15" fill="none" stroke="#DCD8EA" strokeWidth="4" /><circle cx="18" cy="18" r="15" fill="none" stroke={c.col} strokeWidth="4" strokeLinecap="round" strokeDasharray={(R.length ? (100 * c.n / R.length) * 0.942 : 0).toFixed(1) + ' 100'} transform="rotate(-90 18 18)" /></svg>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span className="n" style={{ fontSize: 15, fontWeight: 700 }}>{c.n} of {R.length} audits · {c.label}</span><span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.45 }}>{c.sub}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Metric = 'ecm' | 'save' | 'co2' | 'impl';
const fyL = (fy: string) => 'FY ' + fy.replace('-', '–');

export function KJourney({ rows }: { rows: Row[] }) {
  const [metric, setMetric] = useState<Metric>('save');
  const R = rows, T = totals(R);
  const Y = FYS.map(fy => { const L = R.filter(r => r.fy === fy); return { fy, n: L.length, rn: sumK('rn', L), in: sumK('in', L), ri: sumK('ri', L), ii: sumK('ii', L), rc: sumK('rc', L), ic: sumK('ic', L) }; });
  type Y_ = (typeof Y)[number];
  const M: Record<Metric, [string, string, string, string, (y: Y_) => number, (y: Y_) => number, (v: number) => string]> = {
    ecm: ['Audits & ECMs', 'ECMs recommended against ECMs implemented', 'Recommended', 'Implemented', y => y.rn, y => y.in, v => String(v)],
    save: ['Energy savings', 'Annual savings, ₹ crore: recommended in the audits against what plants achieved', 'Recommended', 'Achieved', y => y.ri / 1e7, y => y.ii / 1e7, v => v.toFixed(2)],
    co2: ['CO₂ reduction', 'Tonnes of CO₂ a year: potential against avoided', 'Potential', 'Avoided', y => y.rc, y => y.ic, v => indN(v)],
    impl: ['Implementation', 'Share of recommended measures implemented', 'All measures', 'Implemented', () => 100, y => (y.rn ? (100 * y.in) / y.rn : 0), v => Math.round(v) + '%'],
  };
  const m = M[metric], mx = Math.max(...Y.map(m[4]), 1);
  const first = Y.find(y => y.n);
  return (
    <section id="journey" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
            <span className="eyebrow">Year by year</span>
            <h2 className="h2">Five years of impact</h2>
            <p className="lede">From {first?.n ?? 0} pilot audits in {fyL(first?.fy ?? FYS[0])} to {R.length} detailed audits today.</p>
          </div>
          <div className="seg" role="group" aria-label="Measure" style={{ overflowX: 'auto', maxWidth: '100%' }}>
            {([['ecm', 'Audits & ECMs'], ['save', 'Energy savings'], ['co2', 'CO₂ reduction'], ['impl', 'Implementation']] as [Metric, string][]).map(([k, l]) => <button key={k} type="button" onClick={() => setMetric(k)} aria-pressed={metric === k}>{l}</button>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))', gap: 12 }}>
          {Y.map(y => (
            <div key={y.fy} className="tile" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600, color: '#6D5BD0' }}>{fyL(y.fy)}</span><span className="n" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.03em' }}>{y.n} <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--sub)' }}>audits</span></span><span className="n" style={{ fontSize: 13, color: 'var(--sub)' }}>{y.rn} ECMs · {cr(y.ri)} identified</span></div>
          ))}
        </div>
        <figure className="card" style={{ margin: 0, padding: '24px 24px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <figcaption style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}><span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 17, fontWeight: 700 }}>{m[0]}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{m[1]}</span></span>
            <span style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--sub)' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#C9C2EC' }} />{m[2]}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#2B2644' }} />{m[3]}</span></span>
          </figcaption>
          <div className="kbars" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14, alignItems: 'end', height: 280, borderBottom: '1px solid var(--line)', padding: '0 6px' }}>
            {Y.map(y => (
              <div key={y.fy} style={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
                <span style={{ width: '34%', maxWidth: 46, height: ((100 * m[4](y)) / mx).toFixed(1) + '%', background: '#C9C2EC', borderRadius: '10px 10px 4px 4px', position: 'relative' }}><span className="n kbarv" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--sub)', whiteSpace: 'nowrap' }}>{m[6](m[4](y))}</span></span>
                <span style={{ width: '34%', maxWidth: 46, height: Math.max(1.5, (100 * m[5](y)) / mx).toFixed(1) + '%', background: '#2B2644', borderRadius: '10px 10px 4px 4px', position: 'relative' }}><span className="n kbarv" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: 6, fontSize: 12, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{m[6](m[5](y))}</span></span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14, padding: '0 6px' }}>
            {Y.map(y => <span key={y.fy} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}>{fyL(y.fy)}</span>)}
          </div>
          <p className="n" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--sub)' }}>{cr(T.ri)} a year recommended; {cr(T.ii)} a year achieved. Implementation is verified about 3 months after each report, so the latest year reads low until verification is done.</p>
        </figure>
      </div>
    </section>
  );
}
