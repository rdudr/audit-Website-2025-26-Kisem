import { useEffect, useMemo, useRef, useState } from 'react';
import { data, FYS, fyLabel, ind, inr, n0, pct, STATUS_TONE, STATUSES, sum, type Row } from '../data';
import { useCountUp } from '../lib/hooks';
import { APPLY_URL, WORKSHOPS_CONDUCTED, CONTACT, FIELD_PHOTOS, INSTRUMENTS, PARTNERS, REPORT_PDF, SCOPE, TEAMS } from './content';
import { DuoIcon, Icon } from './Icon';
import { DUO, PATHS } from './icons';

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

// Chart colours: recommended in orange, achieved in green (Impact, Year by year, Sectors).
const REC = '#F08A24';
const ACH = '#16A34A';
const ACH_TEXT = '#0E7A38';

// ---------------------------------------------------------------- hero

// The headline lands letter by letter, as on the earlier site: each letter rises 60px, tilts back
// into place and fades in, 30ms after the one before. Screen readers get the sentence once (aria-label).
// "industrial state" keeps its white-to-lavender gradient as one colour per letter, since a clipped
// gradient cannot follow letters that move on their own.
const HEADLINE: [string, boolean][] = [['Measuring the energy of an', false], ['industrial state', true]];
function gradAt(t: number) {
  const stops: [number, number[]][] = [[0, [255, 255, 255]], [0.55, [201, 197, 214]], [1, [167, 150, 255]]];
  const i = t <= 0.55 ? 0 : 1, [a, ca] = stops[i], [b, cb] = stops[i + 1], k = (t - a) / (b - a);
  return `rgb(${ca.map((v, j) => Math.round(v + (cb[j] - v) * k)).join(',')})`;
}
function LandingHeadline() {
  let n = 0;
  return (
    <h1 className="hero-h1" aria-label={HEADLINE.map(([t]) => t).join(' ')}>
      {HEADLINE.map(([text, grad], pi) => {
        const letters = text.replace(/ /g, '').length;
        let li = 0;
        return text.split(' ').map((word, wi) => (
          <span key={`${pi}-${wi}`} aria-hidden="true">
            <span className="land-word">
              {[...word].map((ch, ci) => {
                const style: React.CSSProperties & Record<string, string> = { '--d': `${(n++) * 30 + 400}ms` };
                if (grad) style.color = gradAt(letters > 1 ? li++ / (letters - 1) : 0);
                return <span key={ci} className="land-ch" style={style}>{ch}</span>;
              })}
            </span>{' '}
          </span>
        ));
      })}
    </h1>
  );
}

export function Hero({ rows }: { rows: Row[] }) {
  const T = totals(rows);
  const [ref, p] = useCountUp<HTMLDListElement>();
  const heroRef = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  // Reduced motion: nothing moves. Phones (under 640px) and data saver: the poster only, no video download.
  const still = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  const lite = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return !!saveData || window.innerWidth < 640;
  }, []);
  const video = !still && !lite;
  // The visitor's own pause stops all hero motion (video, waveform, glow, pulse): WCAG 2.2.2.
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const moving = !still && !userPaused;

  // Off screen, the video pauses; back on screen it plays again, unless the visitor paused it.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    if (moving && inView) v.play().catch(() => {});
    else v.pause();
  }, [moving, inView]);

  const figures: { v: number; label: string; tag: string; note: string; icon: { d: string; d2: string }; plus?: string }[] = [
    { v: data.counts.walkthrough, label: 'Walkthrough assessments', tag: 'Field', note: 'A one-day visit that finds the quick wins in a plant.', icon: DUO.walkthrough },
    { v: rows.length, label: 'Detailed energy audits', tag: 'Measured', note: 'Logged with instruments, every ECM costed with payback.', icon: DUO.detailed },
    { v: data.counts.clusters, label: 'Industrial clusters', tag: 'Reach', note: 'Across Gujarat, Rajasthan and Daman.', icon: DUO.clusters },
    { v: data.counts.iga, label: 'Paid audits', tag: 'Bankable', note: 'Investment grade, detailed enough to finance the upgrade.', icon: DUO.paid },
    { v: WORKSHOPS_CONDUCTED, label: 'Workshops conducted', tag: 'Outreach', note: 'Awareness sessions with industry associations.', icon: DUO.workshops, plus: '+' },
  ];
  return (
    <section id="top" ref={heroRef} className={`hero${moving ? '' : ' hero-still'}${video ? '' : ' hero-lite'}`}>
      {video && (
        <video ref={vidRef} className="hero-vid" muted loop playsInline preload="metadata" poster="/hero-skyline-poster.jpg" aria-hidden="true">
          <source src="/hero-skyline.mp4" type="video/mp4" />
        </video>
      )}
      <div aria-hidden="true" className="hero-tint" />
      <div aria-hidden="true" className="hero-fade" />
      <div aria-hidden="true" className="hero-grid" />
      <div aria-hidden="true" className="hero-orb" />
      <svg aria-hidden="true" className="hero-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path className="hero-wave-line" d="M0 60 C 50 10, 100 10, 150 60 S 250 110, 300 60 S 400 10, 450 60 S 550 110, 600 60 S 700 10, 750 60 S 850 110, 900 60 S 1000 10, 1050 60 S 1150 110, 1200 60" fill="none" stroke="#C9C5D6" strokeWidth="1.5" />
        <path d="M0 60 C 50 30, 100 30, 150 60 S 250 90, 300 60 S 400 30, 450 60 S 550 90, 600 60 S 700 30, 750 60 S 850 90, 900 60 S 1000 30, 1050 60 S 1150 90, 1200 60" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
      </svg>

      <div className="wrap hero-in">
        <div className="hero-copy">
          <span className="hero-pill"><span className="hero-dot" aria-hidden="true" />Energy audits for Industry · {fyLabel(FYS[0])} to {FYS[FYS.length - 1].replace('-', '–')}</span>
          <LandingHeadline />
          <p className="hero-lede">
            {rows.length} detailed audits. {inr(T.ri)} of annual savings identified, {inr(T.ii)} already achieved. {ind(T.rc)} tonnes a year of CO₂ reduction potential, across MSMEs in Gujarat, Rajasthan and Daman.
          </p>
          <div className="hero-btns">
            <a className="btnw hero-apply" href={APPLY_URL} target="_blank" rel="noopener">Apply for an audit<Icon d={PATHS.arrow} size={17} width={2.2} /></a>
            <a className="hero-glassbtn" href="#audits">Explore all audits</a>
          </div>
        </div>

        <dl ref={ref} className="hero-cards">
          {figures.map(f => (
            <div key={f.label} className="hero-glass">
              <span className="hero-cardtop">
                <span className="hero-ico"><DuoIcon d={f.icon.d} d2={f.icon.d2} /></span>
                <span className="hero-tag">{f.tag}</span>
              </span>
              <dd className="n hero-num"><span aria-hidden="true">{Math.round(f.v * p)}{f.plus}</span><span className="sr-only">{f.v}{f.plus}</span></dd>
              <dt style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span className="hero-label">{f.label}</span>
                <span className="hero-note">{f.note}</span>
              </dt>
            </div>
          ))}
        </dl>

        <div className="hero-foot">
          <a href="#impact" className="hero-scroll"><span className="hero-cue" aria-hidden="true"><span /></span>Scroll to see the impact</a>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {!still && (
              <button type="button" className="hero-vidbtn" onClick={() => setUserPaused(x => !x)} aria-pressed={userPaused}
                aria-label={userPaused ? 'Play the background motion' : 'Pause the background motion'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={userPaused ? 'M8 5l11 7-11 7z' : 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'} /></svg>
              </button>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

/** Partner logos scrolling under the hero. The second copy is for the loop only: screen readers skip it. */
export function PartnerStrip() {
  const withLogo = PARTNERS.filter(pa => pa.logo);
  const set = (hidden: boolean) => withLogo.map(pa => (
    <span key={pa.name + (hidden ? '-2' : '')} className="pstrip-item" aria-hidden={hidden || undefined}>
      <img src={pa.logo} alt="" loading="lazy" height={40} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{pa.name}</span>
        <span style={{ fontSize: 12, color: '#6B6B6B' }}>{pa.role}</span>
      </span>
    </span>
  ));
  return (
    <section aria-label="Partners" className="pstrip">
      <div className="wrap pstrip-in">
        <span className="hide-sm pstrip-label">In partnership with</span>
        <div className="pstrip-window" tabIndex={0} aria-label="Partner logos">
          <div className="pstrip-track">{set(false)}{set(true)}</div>
        </div>
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
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: REC }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5E5E5E' }}><span>Achieved</span><span className="n" style={{ fontWeight: 600, color: '#000000' }}>{k.imp}</span></span>
                  <span aria-hidden="true" style={{ height: 8, borderRadius: 999, background: '#E3E3E3', display: 'flex', overflow: 'hidden' }}><span style={{ width: `calc(${share} * ${p})`, background: ACH, borderRadius: 999 }} /></span>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: REC }} />{DEF.aLabel}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: ACH }} />{DEF.bLabel}</span>
          </div>
        </div>
        <div className="vchart" role="img" aria-label={aria} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4%', height: 300, padding: '0 2%', borderBottom: '1px solid #D4D4D4', backgroundImage: 'linear-gradient(#F0F0F0 1px, transparent 1px)', backgroundSize: '100% 75px' }}>
            {bars.map(b => (
              <div key={b.label} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
                {[['a', b.aText, b.aH, REC, 600, '#5E5E5E'], ['b', b.bText, b.bH, ACH, 700, '#000000']].map(([k, t, h, bg, fw, fg]) => (
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
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px', gap: 10, alignItems: 'center' }}><span style={{ height: 12, borderRadius: 999, background: '#F0F0F0', display: 'flex', overflow: 'hidden' }}><span style={{ width: b.aH, background: REC, borderRadius: 999 }} /></span><span className="n" style={{ fontSize: 12, color: '#5E5E5E', textAlign: 'right' }}>{b.aText}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px', gap: 10, alignItems: 'center' }}><span style={{ height: 12, borderRadius: 999, background: '#F0F0F0', display: 'flex', overflow: 'hidden' }}><span style={{ width: b.bH, background: ACH, borderRadius: 999 }} /></span><span className="n" style={{ fontSize: 12, fontWeight: 700, textAlign: 'right' }}>{b.bText}</span></div>
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
      <Head eyebrow="Sectors" title="Savings by industry" lede="Annual savings achieved out of those recommended, ₹ crore, for each sector." />
      <div className="card" style={{ padding: 'clamp(18px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#3A3A3A' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: REC }} />Recommended</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: ACH }} />Achieved</span>
        </div>
        {sl.map(([name, g]) => (
          <button key={name} type="button" className="sbar" onClick={() => onPick(name)} aria-label={`${name}: ${g.n} audits, ₹ ${(g.ii / 1e7).toFixed(2)} crore achieved of ₹ ${(g.ri / 1e7).toFixed(2)} crore recommended. Show these audits.`}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 180px) minmax(0, 1fr) 92px', gap: 14, alignItems: 'center', padding: '6px 8px', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{name}</span><span style={{ fontSize: 12, color: '#6B6B6B' }}>{g.n} audits</span></span>
            <span style={{ position: 'relative', height: 18, borderRadius: 6, background: '#F5F5F5', display: 'block' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (100 * g.ri / smax).toFixed(1) + '%', background: REC, borderRadius: 6 }} />
              <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: (100 * g.ii / smax).toFixed(1) + '%', background: ACH, borderRadius: 4 }} />
            </span>
            <span className="n" style={{ fontSize: 13, textAlign: 'right', color: '#000000' }}><strong style={{ color: ACH_TEXT }}>{(g.ii / 1e7).toFixed(2)}</strong> <span style={{ color: '#5E5E5E' }}>/ {(g.ri / 1e7).toFixed(2)}</span></span>
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
            <article key={i.name} className="lift icard">
              <div className="icard-img">
                <picture>
                  <source srcSet={encodeURI(i.webp)} type="image/webp" />
                  <img src={i.img} alt={i.alt} loading="lazy" decoding="async" width={800} height={540} />
                </picture>
                <span className="icard-badge"><Icon d={i.d} size={20} stroke="#FFFFFF" width={1.9} /></span>
              </div>
              <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{i.name}</h3>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2B2644' }}>{i.models}</span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#5E5E5E' }}>{i.what}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- how we measure (photo collage)

/** Field work in pictures: a framed collage of eight photos, big and small, on one landscape page. */
export function HowWeMeasure() {
  return (
    <section id="how" className="sec">
      <Head eyebrow="How we measure" title="Out on the plant floor" lede="Every detailed audit means days on site: logging the supply, imaging panels and steam lines, and testing compressors, pumps, chillers and solar." />
      <div className="collage">
        {FIELD_PHOTOS.map((ph, i) => (
          <figure key={ph.slug} className={`collage-item c${i + 1}`}>
            <picture>
              <source srcSet={`/field/${ph.slug}.webp`} type="image/webp" />
              <img src={`/field/${ph.slug}.jpg`} alt={`${ph.title}: ${ph.what}`} loading="lazy" decoding="async" />
            </picture>
            <figcaption><b>{ph.title}</b><span>{ph.what}</span></figcaption>
          </figure>
        ))}
      </div>
      <p className="collage-credit">Photos for illustration, from Wikimedia Commons:{' '}
        {FIELD_PHOTOS.map((ph, i) => (
          <span key={ph.slug}>{i ? '; ' : ''}<a href={ph.source} target="_blank" rel="noopener">{ph.title.toLowerCase()}</a> by {ph.credit}</span>
        ))}.
      </p>
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
