import { useEffect, useMemo, useRef, useState } from 'react';
import { data, FYS, sum, type Row } from '../data';
import { APPLY_URL, PARTNERS, WORKSHOPS_CONDUCTED } from './content';
import { useDevice } from './useDevice';

// Hero and partners (canvas "Component · Hero and partners"). The skyline video stays behind it
// (poster only on phones, data saver and reduced motion; a pause button for the motion).

const cr = (v: number) => '₹ ' + (v / 1e7).toFixed(2) + ' Cr';
const ARROW = 'M5 12h14M13 6l6 6-6 6';

export default function HeroSection({ rows }: { rows: Row[] }) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const still = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  const lite = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return !!saveData || window.innerWidth < 640;
  }, []);
  const video = !still && !lite;
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (!paused && inView) v.play().catch(() => {}); else v.pause();
  }, [paused, inView]);

  const f = useMemo(() => {
    const ri = sum(rows, 'ri'), ii = sum(rows, 'ii');
    return {
      ri, ii, pct: ri ? Math.round((100 * ii) / ri) : 0, co2: Math.round(sum(rows, 'rc')).toLocaleString('en-IN'),
      payback: ri ? Math.max(1, Math.round((12 * sum(rows, 'rv')) / ri)) : 0,
      done: Math.round(sum(rows, 'in')), rn: Math.round(sum(rows, 'rn')),
      states: [...new Set(rows.map(r => r.stt))],
    };
  }, [rows]);
  const where = f.states.length > 1 ? f.states.slice(0, -1).join(', ') + ' and ' + f.states[f.states.length - 1] : f.states[0] || 'Gujarat';
  const ring = 2 * Math.PI * 54, arc = (ring * f.pct) / 100;
  const figs = [
    { v: data.counts.walkthrough, label: 'Walkthrough assessments', tag: 'Field', note: 'A one-day visit that finds the quick wins in a plant.', d: 'M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
    { v: rows.length, label: 'Detailed energy audits', tag: 'Measured', note: 'Logged with instruments, every ECM costed with payback.', d: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { v: data.counts.clusters, label: 'Industrial clusters', tag: 'Reach', note: `Across ${where}.`, d: 'M3 21h18M5 21V9l5 3V9l5 3V5h4v16' },
    { v: data.counts.iga, label: 'Paid audits', tag: 'Bankable', note: 'Investment grade, detailed enough to finance the upgrade.', d: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { v: WORKSHOPS_CONDUCTED, label: 'Awareness programmes', tag: 'Outreach', note: 'Workshops, college sessions and industry events.', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' },
  ];
  const L = {
    pad: D ? '96px 40px 48px' : T ? '72px 32px 40px' : '48px 16px 32px', gap: D ? 56 : 40,
    cols: D ? 'minmax(0, 1.35fr) minmax(0, 1fr)' : 'minmax(0, 1fr)', h1: D ? 72 : T ? 56 : 40, lede: D ? 19 : 16,
    figCols: D ? 'repeat(5, minmax(0, 1fr))' : T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', fig: D ? 40 : 34,
    stripPad: D ? '22px 40px' : T ? '22px 32px' : '20px 16px', partCols: D ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
  };
  const partners = PARTNERS.filter(p => p.logo);
  const fy0 = FYS[0].replace('-', '–'), fy1 = FYS[FYS.length - 1].replace('-', '–');

  return (
    <div className="rd">
      <section id="top" ref={ref} style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: '#1E1A33', color: '#FFFFFF' }}>
        {video
          ? <video ref={vid} muted loop playsInline preload="metadata" poster="/hero-skyline-poster.jpg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, zIndex: -2 }}><source src="/hero-skyline.mp4" type="video/mp4" /></video>
          : <img src="/hero-skyline-poster.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, zIndex: -2 }} />}
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(100deg, rgba(30,26,51,.97) 0%, rgba(43,38,68,.88) 42%, rgba(43,38,68,.55) 75%, rgba(43,38,68,.4) 100%)' }} />
        <span aria-hidden="true" className="rd-hero-grid" style={{ position: 'absolute', inset: 0, zIndex: -1 }} />
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', zIndex: -1, background: 'linear-gradient(180deg, rgba(30,26,51,0) 0%, rgba(30,26,51,.94) 100%)' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: L.gap }}>
          <div style={{ display: 'grid', gridTemplateColumns: L.cols, gap: 40, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
              <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 34, padding: '4px 14px 4px 12px', boxSizing: 'border-box', borderRadius: 999, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', fontSize: 13, fontWeight: 600, color: '#ECEAF2' }}>
                <span className="rd-hero-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />Energy audits for industry · FY {fy0} to {fy1}
              </span>
              <h1 style={{ margin: 0, fontSize: L.h1, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.045em', textWrap: 'balance' } as import('react').CSSProperties}>Measuring the energy of an <span style={{ color: '#C4B8FF' }}>industrial state</span></h1>
              <p style={{ margin: 0, maxWidth: 600, fontSize: L.lede, lineHeight: 1.6, color: '#DDDAE6' }}>{rows.length} detailed audits. {cr(f.ri)} of annual savings identified, {cr(f.ii)} already achieved. {f.co2} tonnes a year of CO₂ reduction potential, across MSMEs in {where}.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a className="rd-white" href={APPLY_URL} target="_blank" rel="noopener" style={{ height: 52, padding: '0 22px', borderRadius: 14, background: '#FFFFFF', color: '#0F0D1A', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 30px -12px rgba(167,150,255,.7)' }}>Apply for an audit
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ARROW} /></svg></a>
                <a className="rd-glass" href="#audits" style={{ height: 52, padding: '0 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.06)', color: '#FFFFFF', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Explore all audits</a>
              </div>
            </div>

            {/* savings scorecard */}
            <div style={{ borderRadius: 24, padding: 24, background: 'linear-gradient(160deg, rgba(255,255,255,.13), rgba(255,255,255,.04))', border: '1px solid rgba(255,255,255,.18)', WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4B8FF' }}>Savings scorecard</span>
                <span style={{ fontSize: 12, color: '#C9C5D6' }}>All audits · per year</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: 132, height: 132, flexShrink: 0 }}>
                  <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={`${f.pct} percent of recommended savings achieved`}>
                    <circle cx="66" cy="66" r="54" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="14" />
                    <circle cx="66" cy="66" r="54" fill="none" stroke="#4ADE80" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${arc.toFixed(1)} ${ring.toFixed(1)}`} transform="rotate(-90 66 66)" />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <b style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{f.pct}%</b>
                    <span style={{ fontSize: 11, color: '#C9C5D6', marginTop: 4 }}>achieved</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 160px', minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 12, color: '#C9C5D6' }}>Recommended</span><b style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{cr(f.ri)}</b></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 12, color: '#C9C5D6' }}>Achieved by plants</span><b style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#86EFAC' }}>{cr(f.ii)}</b></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 18 }}>{f.payback} months</b><span style={{ fontSize: 12, color: '#C9C5D6' }}>Average payback</span></div>
                <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 18 }}>{f.done} of {f.rn}</b><span style={{ fontSize: 12, color: '#C9C5D6' }}>Measures carried out</span></div>
              </div>
            </div>
          </div>

          {/* programme figures */}
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: L.figCols, gap: 12 }}>
            {figs.map((x, i) => (
              <div key={x.label} style={{ borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', minWidth: 0, gridColumn: `span ${!D && i === 4 ? (T ? 1 : 2) : 1}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(196,184,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4B8FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={x.d} /></svg>
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#C9C5D6' }}>{x.tag}</span>
                </div>
                <dd style={{ margin: 0, fontSize: L.fig, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{x.v}</dd>
                <dt style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{x.label}</span>
                  <span style={{ fontSize: 12, lineHeight: 1.45, color: '#C9C5D6' }}>{x.note}</span>
                </dt>
              </div>
            ))}
          </dl>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <a href="#impact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: '#DDDAE6', textDecoration: 'none' }}>
              <span aria-hidden="true" style={{ width: 22, height: 34, borderRadius: 12, border: '2px solid rgba(255,255,255,.4)', display: 'flex', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box' }}><span style={{ width: 3, height: 7, borderRadius: 2, background: '#FFFFFF' }} /></span>Scroll to see the impact</a>
            {video && (
              <button type="button" onClick={() => setPaused(x => !x)} aria-pressed={paused} aria-label={paused ? 'Play the background video' : 'Pause the background video'}
                style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.08)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={paused ? 'M8 5l11 7-11 7z' : 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'} /></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* partner strip */}
      <section aria-label="Partners" style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEAF2' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: L.stripPad, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 28, flexWrap: D ? 'nowrap' : 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6880', whiteSpace: 'nowrap', flexShrink: 0 }}>In partnership with</span>
          <div style={{ display: 'grid', gridTemplateColumns: L.partCols, gap: '14px 28px', flex: 1, minWidth: 0, width: '100%' }}>
            {partners.map(p => (
              <span key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span style={{ width: 72, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={p.logo} alt="" loading="lazy" style={{ maxWidth: 72, maxHeight: 44, objectFit: 'contain', display: 'block' }} /></span>
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0F0D1A' }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: '#6B6880' }}>{p.role}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
