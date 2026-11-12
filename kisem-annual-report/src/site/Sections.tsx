import { useMemo, useState } from 'react';
import { data, FYS, fyLabel, ind, inr, n0, pct, STATUS_TONE, STATUSES, sum, type Row } from '../data';
import { useCountUp } from '../lib/hooks';
import { APPLY_URL, WORKSHOPS_CONDUCTED, CONTACT, INSTRUMENTS, PARTNERS, REPORT_PDF, SCOPE, TEAMS } from './content';
import { Icon } from './Icon';
import { PATHS } from './icons';

const totals = (rows: Row[]) => ({
  rn: sum(rows, 'rn'), in: sum(rows, 'in'), ri: sum(rows, 'ri'), ii: sum(rows, 'ii'), rc: sum(rows, 'rc'), ic: sum(rows, 'ic'),
  rk: sum(rows, 'rk'), ik: sum(rows, 'ik'), rv: sum(rows, 'rv'), iv: sum(rows, 'iv'), e: sum(rows, 'e'), cost: sum(rows, 'cost'),
});

function Head({ eyebrow, title, lede, max = 680 }: { eyebrow: string; title: string; lede?: React.ReactNode; max?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: max }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h2">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

// ---------------------------------------------------------------- hero

export function Hero({ rows }: { rows: Row[] }) {
  const T = totals(rows);
  const [ref, p] = useCountUp<HTMLDListElement>();
  // [figure, label, icon, suffix]
  const figures: [number, string, string, string][] = [
    [data.counts.walkthrough, 'Walkthrough assessments', PATHS.clipboard, ''],
    [rows.length, 'Detailed energy audits', PATHS.gauge, ''],
    [data.counts.clusters, 'Industrial clusters', PATHS.pin, ''],
    [data.counts.iga, 'Paid audits', PATHS.medal, ''],
    [WORKSHOPS_CONDUCTED, 'Workshops conducted', PATHS.people, '+'],
  ];
  return (
    <section id="top" style={{ background: '#2B2644', backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '48px 48px', color: '#FFFFFF' }}>
      <div className="wrap" style={{ padding: 'clamp(48px, 10vw, 88px) 20px 48px', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 6vw, 48px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C9C5D6' }}>Energy audits for MSMEs · {fyLabel(FYS[0])} to {FYS[FYS.length - 1].replace('-', '–')}</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px, 7.4vw, 60px)', lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.035em', textWrap: 'balance' }}>Measuring the energy of an industrial state</h1>
          <p style={{ margin: 0, fontSize: 'clamp(16px, 2.4vw, 19px)', lineHeight: 1.55, color: '#DDDAE6', maxWidth: 660, textWrap: 'pretty' }}>
            {rows.length} detailed audits. {inr(T.ri)} of annual savings identified, {inr(T.ii)} already achieved. {ind(T.rc)} tonnes a year of CO₂ reduction potential, across MSMEs in Gujarat, Rajasthan and Daman.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 6 }}>
            <a className="btnw" href={APPLY_URL} target="_blank" rel="noopener" style={{ height: 50, padding: '0 22px', borderRadius: 14, background: '#FFFFFF', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>Apply for an audit<Icon d={PATHS.arrow} size={17} width={2.2} /></a>
            <a className="btno" href="#audits" style={{ height: 50, padding: '0 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,.3)', color: '#FFFFFF', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Explore all audits</a>
          </div>
        </div>
        <dl ref={ref} style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', borderTop: '1px solid rgba(255,255,255,.18)' }}>
          {figures.map(([v, label, d, plus]) => (
            <div key={label} style={{ padding: '24px 24px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={d} size={18} stroke="#FFFFFF" width={1.9} /></span>
              <dt style={{ fontSize: 14, color: '#C9C5D6', order: 2 }}>{label}</dt>
              <dd className="n" style={{ margin: 0, fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, order: 1 }}><span aria-hidden="true">{Math.round(v * p)}{plus}</span><span className="sr-only">{v}{plus}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- impact

export function Impact({ rows }: { rows: Row[] }) {
  const T = totals(rows);
  const [ref, p] = useCountUp<HTMLDivElement>(1400);
  // Count-up of a figure inside a formatted string: the number is scaled, the format kept.
  const pairs = [
    { label: 'Annual cost savings', d: PATHS.rupee, rec: inr(T.ri * p), imp: inr(T.ii * p), a: T.ii, b: T.ri },
    { label: 'Measures (ECMs)', d: PATHS.check, rec: ind(T.rn * p), imp: ind(T.in * p), a: T.in, b: T.rn },
    { label: 'CO₂ reduction, t / yr', d: PATHS.leaf, rec: ind(T.rc * p), imp: ind(T.ic * p), a: T.ic, b: T.rc },
    { label: 'Electricity saved, kWh / yr', d: PATHS.bolt, rec: (T.rk * p / 1e5).toFixed(1) + ' lakh', imp: (T.ik * p / 1e5).toFixed(1) + ' lakh', a: T.ik, b: T.rk },
  ];
  const baseline = [
    { label: 'Electricity assessed', v: (T.e / 1e6).toFixed(1) + ' GWh', sub: 'A year, all assessed plants' },
    { label: 'Energy bill assessed', v: inr(T.cost), sub: 'Electricity and fuel, a year' },
    { label: 'Investment proposed', v: inr(T.rv), sub: inr(T.iv) + ' already invested by plants' },
    { label: 'Average payback', v: T.ri ? Math.round((12 * T.rv) / T.ri) + ' months' : '—', sub: 'On the recommended measures' },
  ];
  const statusBar = STATUSES.map(s => ({ label: s, n: rows.filter(r => r.st === s).length, c: STATUS_TONE[s][2] }));
  return (
    <section id="impact" className="sec">
      <Head eyebrow="Impact" title="Recommended, and actually achieved" lede="Every audit recommends energy conservation measures (ECMs). A year later we go back and record what the plant carried out." />
      <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 16 }}>
        {pairs.map(k => {
          const share = pct(k.a, k.b);
          return (
            <div key={k.label} className="lift" style={{ background: '#F5F5F5', border: '1px solid transparent', borderRadius: 20, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={k.d} size={17} stroke="#FFFFFF" width={1.9} /></span>{k.label}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5E5E5E' }}><span>Recommended</span><span className="n" style={{ fontWeight: 600, color: '#000000' }}>{k.rec}</span></span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: '#C9C5D6' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5E5E5E' }}><span>Achieved</span><span className="n" style={{ fontWeight: 600, color: '#000000' }}>{k.imp}</span></span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: '#E3E3E3', display: 'flex', overflow: 'hidden' }}><span style={{ width: `calc(${share} * ${p})`, background: '#2B2644', borderRadius: 999 }} /></span>
                </div>
              </div>
              <span className="n" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{Math.round(parseInt(share) * p)}% <span style={{ fontSize: 13, fontWeight: 500, color: '#5E5E5E', letterSpacing: 0 }}>achieved so far</span></span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
        {baseline.map(b => (
          <div key={b.label} className="lift" style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#5E5E5E' }}>{b.label}</span>
            <span className="n" style={{ fontSize: 22, fontWeight: 600 }}>{b.v}</span>
            <span style={{ fontSize: 12, color: '#6B6B6B' }}>{b.sub}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Where each audit stands</span>
        <div aria-hidden="true" style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', gap: 3 }}>
          {statusBar.map(s => <span key={s.label} style={{ flex: s.n, background: s.c }} />)}
        </div>
        <div style={{ display: 'flex', gap: '8px 22px', flexWrap: 'wrap', fontSize: 13 }}>
          {statusBar.map(s => (
            <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: s.c }} /><span className="n" style={{ fontWeight: 600 }}>{s.n}</span><span style={{ color: '#5E5E5E' }}>{s.label}</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- year by year

type Metric = 'audits' | 'savings' | 'co2' | 'ecm';

export function Journey({ rows }: { rows: Row[] }) {
  const [metric, setMetric] = useState<Metric>('audits');
  const T = totals(rows);
  const Y = useMemo(() => FYS.map(fy => {
    const L = rows.filter(r => r.fy === fy);
    const rn = sum(L, 'rn'), inn = sum(L, 'in');
    return { fy, label: fyLabel(fy), n: L.length, rn, in: inn, ri: sum(L, 'ri') / 1e7, ii: sum(L, 'ii') / 1e7, rc: sum(L, 'rc'), ic: sum(L, 'ic'), pc: rn ? Math.round((100 * inn) / rn) : 0 };
  }), [rows]);
  type Y_ = (typeof Y)[number];
  const DEF = {
    audits: { title: 'Measures recommended and implemented', sub: 'Energy conservation measures (ECMs) per audit year', aLabel: 'Recommended', bLabel: 'Implemented', a: 'rn', b: 'in', f: (v: number) => ind(v) },
    savings: { title: 'Annual savings, ₹ crore', sub: 'Recommended in the audits against what plants achieved', aLabel: 'Recommended', bLabel: 'Achieved', a: 'ri', b: 'ii', f: (v: number) => v.toFixed(2) },
    co2: { title: 'CO₂ reduction, tonnes a year', sub: 'Potential identified against reduction achieved', aLabel: 'Potential', bLabel: 'Achieved', a: 'rc', b: 'ic', f: (v: number) => ind(v) },
    ecm: { title: 'Implementation rate', sub: 'Share of recommended measures carried out, by audit year', aLabel: 'Recommended (100%)', bLabel: 'Implemented', a: null, b: 'pc', f: (v: number) => v + '%' },
  }[metric] as { title: string; sub: string; aLabel: string; bLabel: string; a: keyof Y_ | null; b: keyof Y_; f: (v: number) => string };
  const val = (y: Y_, k: keyof Y_ | null) => (k ? Number(y[k]) : 100);
  const mx = DEF.a ? Math.max(...Y.map(y => Math.max(val(y, DEF.a), val(y, DEF.b)))) : 100;
  const hh = (v: number) => Math.max(v ? 2 : 0, Math.round((86 * v) / (mx || 1))) + '%';
  const bars = Y.map(y => ({ label: y.label.replace('FY 20', 'FY '), aText: DEF.a ? DEF.f(val(y, DEF.a)) : '', bText: DEF.f(val(y, DEF.b)), aH: hh(val(y, DEF.a)), bH: hh(val(y, DEF.b)) }));
  const aria = DEF.title + ': ' + Y.map(y => `${y.label} ${DEF.a ? `${DEF.aLabel} ${DEF.f(val(y, DEF.a))}, ` : ''}${DEF.bLabel} ${DEF.f(val(y, DEF.b))}`).join('; ');
  const late = 'Implementation is recorded 3–5 months after each audit, so the latest year reads low until the post-audit visits are done.';
  const note = {
    audits: `${ind(T.rn)} measures recommended; ${ind(T.in)} carried out so far.`,
    savings: `${inr(T.ri)} a year recommended; ${inr(T.ii)} a year achieved. ${late}`,
    co2: `${ind(T.rc)} t a year of potential; ${ind(T.ic)} t a year achieved.`,
    ecm: `${pct(T.in, T.rn)} of all measures implemented. ${late}`,
  }[metric];
  const metrics: [Metric, string][] = [['audits', 'Audits & ECMs'], ['savings', 'Energy savings'], ['co2', 'CO₂ reduction'], ['ecm', 'Implementation']];
  return (
    <section id="journey" className="sec">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <Head eyebrow="Year by year" title={`${FYS.length} years of impact`} lede={`From ${Y[0].n} pilot audits in ${Y[0].label} to ${rows.length} detailed audits today.`} max={640} />
        <div role="tablist" aria-label="Chart" style={{ display: 'flex', gap: 2, padding: 4, background: '#F5F5F5', borderRadius: 14, flexWrap: 'wrap' }}>
          {metrics.map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={k === metric} onClick={() => setMetric(k)} className={k === metric ? '' : 'ghost'}
              style={{ height: 38, padding: '0 16px', border: 0, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: k === metric ? '#FFFFFF' : 'transparent', color: k === metric ? '#000000' : '#5E5E5E', boxShadow: k === metric ? '0 1px 2px rgba(0,0,0,.12)' : 'none' }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: 12 }}>
        {Y.map(y => (
          <div key={y.fy} className="lift" style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', color: '#6B6B6B' }}>{y.label}</span>
            <span className="n" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{y.n}</span>
            <span style={{ fontSize: 13, color: '#5E5E5E' }}>detailed audits</span>
            <span className="n" style={{ fontSize: 15, fontWeight: 600, paddingTop: 8, borderTop: '1px solid #EBEBEB', marginTop: 8 }}>₹ {y.ri.toFixed(2)} Cr</span>
            <span style={{ fontSize: 12, color: '#6B6B6B' }}>savings recommended</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 'clamp(18px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{DEF.title}</h3>
            <span style={{ fontSize: 13, color: '#5E5E5E' }}>{DEF.sub}</span>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#3A3A3A' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#C9C5D6' }} />{DEF.aLabel}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#2B2644' }} />{DEF.bLabel}</span>
          </div>
        </div>
        <div className="vchart" role="img" aria-label={aria} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4%', height: 300, padding: '0 2%', borderBottom: '1px solid #D4D4D4', backgroundImage: 'linear-gradient(#F0F0F0 1px, transparent 1px)', backgroundSize: '100% 75px' }}>
            {bars.map(b => (
              <div key={b.label} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
                {[['a', b.aText, b.aH, '#C9C5D6', 600, '#5E5E5E'], ['b', b.bText, b.bH, '#2B2644', 700, '#000000']].map(([k, t, h, bg, fw, fg]) => (
                  <div key={k as string} style={{ flex: 1, maxWidth: 56, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                    <span className="n" style={{ fontSize: 12, fontWeight: fw as number, color: fg as string }}>{t}</span>
                    <span style={{ width: '100%', height: h as string, background: bg as string, borderRadius: '6px 6px 0 0', transition: 'height .4s ease' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4%', padding: '10px 2% 0' }}>
            {bars.map(b => <span key={b.label} style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#3A3A3A' }}>{b.label}</span>)}
          </div>
        </div>
        <div className="hchart" role="img" aria-label={aria} style={{ flexDirection: 'column', gap: 16 }}>
          {bars.map(b => (
            <div key={b.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px', gap: 10, alignItems: 'center' }}><span style={{ height: 12, borderRadius: 999, background: '#F0F0F0', display: 'flex', overflow: 'hidden' }}><span style={{ width: b.aH, background: '#C9C5D6', borderRadius: 999 }} /></span><span className="n" style={{ fontSize: 12, color: '#5E5E5E', textAlign: 'right' }}>{b.aText}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px', gap: 10, alignItems: 'center' }}><span style={{ height: 12, borderRadius: 999, background: '#F0F0F0', display: 'flex', overflow: 'hidden' }}><span style={{ width: b.bH, background: '#2B2644', borderRadius: 999 }} /></span><span className="n" style={{ fontSize: 12, fontWeight: 700, textAlign: 'right' }}>{b.bText}</span></div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#3A3A3A', paddingTop: 14, borderTop: '1px solid #EBEBEB' }}>{note}</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- sectors

export function Sectors({ rows, onPick }: { rows: Row[]; onPick: (sector: string) => void }) {
  const sg: Record<string, { n: number; ri: number; ii: number }> = {};
  rows.forEach(r => { const g = (sg[r.s] ||= { n: 0, ri: 0, ii: 0 }); g.n++; g.ri += n0(r.ri); g.ii += n0(r.ii); });
  const sl = Object.entries(sg).sort((a, b) => b[1].ri - a[1].ri);
  const smax = sl[0] ? sl[0][1].ri || 1 : 1;
  return (
    <section id="sectors" className="sec" style={{ gap: 24 }}>
      <Head eyebrow="Sectors" title="Savings by industry" lede="Annual savings recommended and achieved, ₹ crore, for each sector." />
      <div className="card" style={{ padding: 'clamp(18px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#3A3A3A' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#C9C5D6' }} />Recommended</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#2B2644' }} />Achieved</span>
        </div>
        {sl.map(([name, g]) => (
          <button key={name} type="button" className="sbar" onClick={() => onPick(name)} aria-label={`${name}: ${g.n} audits, ₹ ${(g.ri / 1e7).toFixed(2)} crore recommended, ₹ ${(g.ii / 1e7).toFixed(2)} crore achieved. Show these audits.`}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 180px) minmax(0, 1fr) 92px', gap: 14, alignItems: 'center', padding: '6px 8px', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{name}</span><span style={{ fontSize: 12, color: '#6B6B6B' }}>{g.n} audits</span></span>
            <span style={{ position: 'relative', height: 18, borderRadius: 6, background: '#F5F5F5', display: 'block' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (100 * g.ri / smax).toFixed(1) + '%', background: '#C9C5D6', borderRadius: 6 }} />
              <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: (100 * g.ii / smax).toFixed(1) + '%', background: '#2B2644', borderRadius: 4 }} />
            </span>
            <span className="n" style={{ fontSize: 13, textAlign: 'right', color: '#000000' }}><strong>{(g.ri / 1e7).toFixed(2)}</strong> <span style={{ color: '#5E5E5E' }}>/ {(g.ii / 1e7).toFixed(2)}</span></span>
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#6B6B6B' }}>Pick a sector to filter the audit list above.</span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- scope, instruments

export function Scope() {
  return (
    <section id="scope" className="sec">
      <Head eyebrow="Scope" title="What an audit covers" lede={`${SCOPE.length === 17 ? 'Seventeen' : SCOPE.length} areas, covering every major energy-using system and utility in the plant.`} max={640} />
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(270px, 100%), 1fr))', gap: '0 32px' }}>
        {SCOPE.map(s => (
          <li key={s.n} style={{ display: 'flex', gap: 14, padding: '16px 0', borderTop: '1px solid #E3E3E3' }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 34 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: '#ECEAF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={s.d} size={17} stroke="#2B2644" width={1.9} /></span>
              <span className="n" style={{ fontSize: 11, fontWeight: 600, color: '#6E6890' }}>{s.n}</span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</span><span style={{ fontSize: 13, lineHeight: 1.45, color: '#5E5E5E' }}>{s.what}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Instruments() {
  return (
    <section id="instruments" style={{ background: '#F5F5F5', marginTop: 'clamp(56px, 9vw, 88px)', scrollMarginTop: 128 }}>
      <div className="wrap" style={{ padding: 'clamp(48px, 8vw, 80px) 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Head eyebrow="Instruments" title="What we measure with" max={640} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
          {INSTRUMENTS.map(i => (
            <article key={i.name} className="lift" style={{ background: '#FFFFFF', border: '1px solid transparent', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: '#ECEAF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={i.d} size={20} stroke="#2B2644" width={1.9} /></span>
                <img src={i.img} alt="" loading="lazy" style={{ height: 56, maxWidth: 110, objectFit: 'contain' }} />
              </span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{i.name}</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#2B2644' }}>{i.models}</span>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#5E5E5E' }}>{i.what}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- team, contact, footer

function Photo({ src, name }: { src: string; name: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    const ini = name.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/, '').split(/\s+/).map(w => w[0]).slice(0, 2).join('');
    return <span aria-hidden="true" style={{ aspectRatio: '1 / 1', borderRadius: 14, background: '#ECEAF2', color: '#2B2644', fontSize: 28, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ini}</span>;
  }
  return <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} style={{ aspectRatio: '1 / 1', width: '100%', borderRadius: 14, objectFit: 'cover', objectPosition: 'top', background: '#F5F5F5', display: 'block' }} />;
}

export function Team() {
  return (
    <section id="team" className="sec" style={{ gap: 32 }}>
      <Head eyebrow="Team" title="The people behind the audits" max={640} />
      {TEAMS.map(g => (
        <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#5E5E5E' }}>{g.label}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16 }}>
            {g.people.map(m => (
              <article key={m.email} className="lift" style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: 20, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, background: '#FFFFFF' }}>
                <Photo src={m.photo} name={m.name} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 4px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6E6890' }}>{m.role}</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{m.name}</span>
                  <span style={{ fontSize: 13, color: '#5E5E5E' }}>{m.title}</span>
                  <a className="mail" href={'mailto:' + m.email} style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6, wordBreak: 'break-all', minHeight: 32 }}><Icon d={PATHS.mail} size={14} />{m.email}</a>
                </span>
              </article>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#5E5E5E' }}>Partners</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 12 }}>
          {PARTNERS.map(pa => (
            <span key={pa.name} className="lift" title={pa.role} style={{ minHeight: 72, borderRadius: 16, border: '1px solid rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: '#3A3A3A', textAlign: 'center', padding: '10px 12px' }}>
              {pa.logo && <img src={pa.logo} alt="" loading="lazy" style={{ height: 32, maxWidth: 56, objectFit: 'contain' }} />}{pa.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="wrap" style={{ padding: 'clamp(56px, 9vw, 88px) 20px', scrollMarginTop: 128 }}>
      <div style={{ background: '#2B2644', color: '#FFFFFF', borderRadius: 28, padding: 'clamp(28px, 6vw, 56px)', display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>
          <h2 className="h2" style={{ textWrap: 'balance' }}>Find out what your plant could save</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#DDDAE6' }}>MSME units can apply for an energy assessment by the IIT Gandhinagar team, funded under Kotak Mahindra Bank's CSR programme.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="btnw" href={APPLY_URL} target="_blank" rel="noopener" style={{ height: 50, padding: '0 22px', borderRadius: 14, background: '#FFFFFF', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Apply for an audit</a>
            <a className="btno" href={REPORT_PDF} target="_blank" rel="noopener" style={{ height: 50, padding: '0 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,.3)', color: '#FFFFFF', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Annual report (PDF)</a>
          </div>
        </div>
        <address style={{ flex: '0 1 320px', fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15, lineHeight: 1.5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#C9C5D6' }}>Contact</span>
          <a href={CONTACT.mapUrl} target="_blank" rel="noopener" style={{ color: '#FFFFFF', textDecoration: 'none' }}>{CONTACT.address}</a>
          <a href={'mailto:' + CONTACT.email} style={{ color: '#FFFFFF' }}>{CONTACT.email}</a>
          <a href={'tel:' + CONTACT.tel} style={{ color: '#FFFFFF', textDecoration: 'none' }}>{CONTACT.phone}</a>
        </address>
      </div>
    </section>
  );
}

export function Footer() {
  const asOf = new Date(data.asOf + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,.08)' }}>
      <div className="wrap" style={{ padding: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px 24px', fontSize: 13, color: '#5E5E5E' }}>
        <span>© {new Date().getFullYear()} KISEM, IIT Gandhinagar · Data as of the master data sheet, {asOf}</span>
        <nav aria-label="Footer" style={{ display: 'flex', gap: '6px 20px', flexWrap: 'wrap' }}>
          <a className="navl" href="https://console.eassiitgn.page" style={{ color: '#5E5E5E' }}>FOX Console</a>
          <a className="navl" href="https://console.eassiitgn.page/apps" style={{ color: '#5E5E5E' }}>Field apps</a>
          <a className="navl" href="#top" style={{ color: '#5E5E5E' }}>Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
