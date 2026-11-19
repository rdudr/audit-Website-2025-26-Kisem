// The work: Scope (plant tour, energy flow, stages, the 17 areas), the FOX platform, the
// instruments, and the field photographs.
import { useState } from 'react';
import type { Row } from '../../data';
import { FAM, FOXC, FOXL, INSTR, MEAS, MOSAIC, TOUR, WALK } from './design';
import { COUNTS, cr, indN, lakh, totals } from './kutil';

// Family: key, label, colour, tint, blurb, photo, alt, instruments, areas [no, title, what].
type FamT = [string, string, string, string, string, string, string, string, string[][]];
const FAMS = FAM as FamT[];

const STAGES: [string, string, string][] = [
  ['01', 'Walkthrough audit', 'A first visit to the plant to map the utilities, the major loads and the energy bills, and to find the quick wins.'],
  ['02', 'Detailed energy audit', 'Days on the plant floor: logging the supply, imaging panels and steam lines, testing compressors, pumps, chillers and solar.'],
  ['03', 'Energy audit report submission', 'Each finding becomes an energy conservation measure with its saving in ₹, energy and CO₂ a year, the investment and the payback, submitted to the plant as the audit report.'],
  ['04', 'Implementation and follow-up', 'A separate team verifies what the plant implemented about 3 months after the report, and a post assessment follows about 6 months after it.'],
];

export function KScope({ rows }: { rows: Row[] }) {
  const [stop, setStop] = useState(0);
  const [fam, setFam] = useState('All');
  const T = totals(rows);
  const t = TOUR[stop] as string[];
  const nStops = TOUR.length;
  const flow = [
    { k: 'Energy in', t: 'What the plant buys', s: 'Grid power, fuel and water, read from the bills and the meters.', v: cr(T.cost) + ' a year of electricity and fuel assessed across ' + rows.length + ' plants.', bg: '#F5F5F7', fg: '#0B0A14', kc: '#6D5BD0' },
    { k: 'The audit', t: '17 areas measured on site', s: 'Calibrated instruments on every utility, then each finding costed as an energy conservation measure with its payback.', v: T.rn + ' measures recommended so far', bg: '#16132A', fg: '#FFFFFF', kc: '#C4B8FF' },
    { k: 'Cleaner output', t: 'What the plant gains', s: cr(T.ri) + ' savings a year identified · ' + indN(T.rc) + ' t CO₂ a year potential cut · ' + lakh(T.rk) + ' lakh kWh a year to save.', v: (T.ri ? Math.round((12 * T.rv) / T.ri) : 0) + ' months average payback', bg: '#E1F0E8', fg: '#063D23', kc: '#0B7A45' },
  ];
  const fams: [string, string, number][] = [["All", "All areas", 17], ...FAMS.map(f => [f[0], f[1], f[8].length] as [string, string, number])];
  const cards = FAMS.filter(f => fam === 'All' || f[0] === fam);
  return (
    <section id="scope" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
            <span className="eyebrow">Scope</span>
            <h2 className="h2">What an audit covers</h2>
            <p className="lede">Seventeen areas, covering every major energy-using system and utility in the plant — from the grid incomer to the top of the stack.</p>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[['17', 'Areas covered'], [String(nStops), 'Stops on the plant tour'], [String(INSTR.length), 'Instrument classes']].map(([v, k]) => <span key={k} style={{ display: 'flex', flexDirection: 'column' }}><span className="n" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1 }}>{v}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{k}</span></span>)}
          </div>
        </div>

        <div style={{ borderRadius: 32, background: '#12101F', color: '#FFFFFF', overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4B8FF' }}>Plant tour · supply to stack</span>
            <span className="n" style={{ fontSize: 12, color: '#8E88A8' }}>Stop {String(stop + 1).padStart(2, '0')} of {nStops}</span>
          </div>
          <div role="tablist" aria-label="Tour stops" style={{ padding: '14px 24px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
            {TOUR.map((x: string[], i: number) => {
              const on = i === stop;
              return <button key={x[0]} type="button" role="tab" aria-selected={on} onClick={() => setStop(i)} style={{ flexShrink: 0, height: 36, padding: '0 12px', borderRadius: 999, border: `1px solid ${on ? '#FFFFFF' : 'rgba(255,255,255,.14)'}`, background: on ? '#FFFFFF' : 'rgba(255,255,255,.05)', color: on ? '#12101F' : '#DDDAE6', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="n" style={{ opacity: 0.6 }}>{String(i + 1).padStart(2, '0')}</span>{x[0]}</button>;
            })}
          </div>
          <div role="tabpanel" style={{ display: 'flex', flexWrap: 'wrap', padding: 18 }}>
            <div style={{ flex: '999 1 520px', position: 'relative', minHeight: 'clamp(260px, 50vw, 420px)', borderRadius: 22, overflow: 'hidden', background: '#1E1A33' }}>
              <img src={t[7]} alt="" aria-hidden="true" style={{ position: 'absolute', inset: -30, width: 'calc(100% + 60px)', height: 'calc(100% + 60px)', objectFit: 'cover', filter: 'blur(26px) brightness(.45) saturate(1.2)' }} />
              <img key={t[7]} src={t[7]} alt={t[9]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: t[8] as 'cover' | 'contain' }} />
              <span style={{ position: 'absolute', left: 14, top: 14, minHeight: 30, padding: '4px 12px', boxSizing: 'border-box', borderRadius: 999, background: 'rgba(18,16,31,.7)', backdropFilter: 'blur(10px)', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', display: 'inline-flex', alignItems: 'center', color: '#C4B8FF' }}>{t[10]}</span>
            </div>
            <div className="ktourtxt" style={{ flex: '1 1 340px', padding: '10px 10px 10px 26px', display: 'flex', flexDirection: 'column', gap: 14, boxSizing: 'border-box', minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: '#8E88A8' }}>{t[1]}</span>
              <h3 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-.03em' }}>{t[2]}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#DDDAE6' }}>{t[3]}</p>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ borderRadius: 16, padding: '12px 14px', background: 'rgba(252,165,165,.08)', border: '1px solid rgba(252,165,165,.2)' }}><span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#FCA5A5', paddingBottom: 4 }}>WHAT WE USUALLY FIND</span><span style={{ fontSize: 14, lineHeight: 1.5, color: '#F4EFFF' }}>{t[4]}</span></div>
                <div style={{ borderRadius: 16, padding: '12px 14px', background: 'rgba(134,239,172,.08)', border: '1px solid rgba(134,239,172,.2)' }}><span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#86EFAC', paddingBottom: 4 }}>WHAT WE RECOMMEND</span><span style={{ fontSize: 14, lineHeight: 1.5, color: '#F4EFFF' }}>{t[5]}</span></div>
              </div>
              <span style={{ fontSize: 13, color: '#8E88A8' }}>Areas covered: <span className="n" style={{ color: '#FFFFFF', fontWeight: 600 }}>{t[6]}</span></span>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button type="button" onClick={() => setStop((stop + nStops - 1) % nStops)} aria-label="Previous stop" style={{ width: 44, height: 44, borderRadius: 14, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.05)', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg></button>
                <button type="button" onClick={() => setStop((stop + 1) % nStops)} style={{ height: 44, padding: '0 16px', borderRadius: 14, border: 0, background: '#FFFFFF', color: '#12101F', font: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Next: {TOUR[(stop + 1) % nStops][0]}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 14 }}>
          {flow.map(f => (
            <div key={f.k} style={{ borderRadius: 24, padding: 22, background: f.bg, color: f.fg, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: f.kc }}>{f.k}</span>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>{f.t}</span>
              <span style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.85 }}>{f.s}</span>
              <span className="n" style={{ fontSize: 14, fontWeight: 700 }}>{f.v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>How an audit runs <span style={{ color: 'var(--mute)', fontWeight: 600 }}>· four stages, one team, one report</span></h3>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 12 }}>
            {STAGES.map(([n, tt, s]) => (
              <li key={n} className="tile" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="n" style={{ fontSize: 12, fontWeight: 700, color: '#6D5BD0' }}>STAGE {n}</span>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>{tt}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--sub)' }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>The 17 areas, by kind of system</h3>
            <div className="seg" role="group" aria-label="Kind of system" style={{ overflowX: 'auto', maxWidth: '100%' }}>
              {fams.map(([k, l, n]) => <button key={k} type="button" onClick={() => setFam(k)} aria-pressed={fam === k}>{l} <span className="n" style={{ opacity: 0.55 }}>{n}</span></button>)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 14 }}>
            {cards.map(f => (
              <article key={f[0]} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="zoom" style={{ position: 'relative', aspectRatio: '16 / 7', overflow: 'hidden', background: f[3] }}><img className="ph" src={f[5]} alt={f[6]} loading="lazy" /><span style={{ position: 'absolute', left: 14, bottom: 12, height: 28, padding: '0 12px', borderRadius: 999, background: f[2], color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>{f[1]} · {f[8].length} areas</span></div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 14, color: 'var(--sub)' }}>{f[4]}</span>
                  {f[8].map(([n, tt, s]: string[]) => (
                    <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '8px 0', borderTop: '1px solid var(--line)' }}><span className="n" style={{ fontSize: 12, fontWeight: 700, color: f[2], minWidth: 22 }}>{n}</span><span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 15, fontWeight: 600 }}>{tt}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{s}</span></span></div>
                  ))}
                  <span style={{ fontSize: 12, color: 'var(--mute)', paddingTop: 4 }}>Measured with: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{f[7]}</span></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FC: Record<string, [string, string, string, string]> = { F: ['#6D5BD0', '#ECEAF8', '#4C3FB0', 'Forecasting'], O: ['#C2410C', '#FDEBDD', '#9A3412', 'Operation'], X: ['#0B7A45', '#E1F0E8', '#0B7A45', 'Execution'] };

export function KFox() {
  const [fl, setFl] = useState<string | null>(null);
  return (
    <section id="fox" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
          <span className="eyebrow">The platform behind every audit</span>
          <h2 className="h2">FOX turns site readings into the report, fast</h2>
          <p className="lede">Every reading, photo and logger file goes into FOX, the KISEM platform built for these audits. Eleven tools, in three steps.</p>
        </div>
        <div className="foxgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
          <article style={{ gridColumn: 'span 2', gridRow: 'span 2', borderRadius: 28, padding: 28, background: 'radial-gradient(120% 90% at 85% 0%, rgba(249,115,22,.22), rgba(22,19,42,0) 55%), #16132A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="76" height="76" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#3A3360" strokeWidth="5" strokeDasharray="15.15 3" transform="rotate(-90 32 32)" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F97316" strokeWidth="5" strokeDasharray="15.15 3 15.15 3 15.15 3 15.15 3 15.15 3 15.15 400" transform="rotate(-90 32 32)" />
                <path d="M17 45 V33 L24 37 V33 L31 37 V33 L38 37 V22 H44 V45 Z" fill="#FED7AA" />
                <circle cx="41" cy="17" r="2.2" fill="#FB923C" />
              </svg>
              <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '.02em', lineHeight: 1 }}>FOX</span><span style={{ fontSize: 13, color: '#C9C5D6' }}>Reporting tools and AI platform · {FOXC.length + 1} tools</span></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FOXL.map(([L, head, rest, col, lc, what]: string[]) => {
                const on = fl === L;
                return (
                  <button key={L} type="button" onClick={() => setFl(on ? null : L)} aria-pressed={on} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 16px', borderRadius: 18, border: `1px solid ${on ? lc : 'rgba(255,255,255,.1)'}`, background: on ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', color: '#FFFFFF', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                    <span style={{ width: 52, height: 52, borderRadius: 16, background: col, fontSize: 30, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{L}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}><span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}><span style={{ color: lc }}>{head}</span>{rest}</span><span style={{ fontSize: 13.5, lineHeight: 1.45, color: '#C9C5D6' }}>{what}</span></span>
                    <span className="n" style={{ marginLeft: 'auto', fontSize: 12, color: '#8E88A8', whiteSpace: 'nowrap' }}>{FOXC.filter((c: string[]) => c[0] === L).length} tools</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#8E88A8', marginTop: 'auto' }}>
              <span>PLANT FLOOR</span><span aria-hidden="true">→</span><span style={{ color: '#C4B8FF' }}>F</span><span aria-hidden="true">·</span><span style={{ color: '#FDBA74' }}>O</span><span aria-hidden="true">·</span><span style={{ color: '#86EFAC' }}>X</span><span aria-hidden="true">→</span><span>COSTED REPORT</span>
            </div>
          </article>
          {FOXC.map(([L, name, what, d]: string[], i: number) => {
            const c = FC[L], on = fl === L;
            return (
              <article key={name} className="press" style={{ gridColumn: `span ${i === 9 ? 2 : 1}`, borderRadius: 24, padding: 18, background: on ? c[1] : '#FFFFFF', border: `1px solid ${on ? c[0] : 'rgba(11,10,20,.08)'}`, opacity: !fl || on ? 1 : 0.38, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 13, background: c[0], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg></span>
                  <span style={{ height: 24, padding: '0 9px', borderRadius: 999, background: c[1], color: c[2], fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><span className="n">{String(i + 2).padStart(2, '0')}</span>· {c[3]}</span>
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{name}</span>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--sub)' }}>{what}</span>
              </article>
            );
          })}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--mute)' }}>Field apps work offline on site; the AI analyser reads power-quality and clamp-meter files in seconds; the report is drafted from the data in PostMan.</p>
      </div>
    </section>
  );
}

export function KInstruments() {
  return (
    <section id="instruments" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
            <span className="eyebrow">Instruments</span>
            <h2 className="h2">What we measure with</h2>
            <p className="lede">Calibrated, Class A where it matters, and carried to every plant. Readings are logged on site, not estimated.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="pill" style={{ height: 36, background: 'var(--wash)', fontSize: 13, cursor: 'default' }}>{INSTR.length} instrument classes</span><span className="pill" style={{ height: 36, background: 'var(--wash)', fontSize: 13, cursor: 'default' }}>IEC 61000-4-30 Class A</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(330px, 100%), 1fr))', gap: 14 }}>
          {INSTR.map(([img, alt, name, models, what]: string[], i: number) => (
            <article key={name} className="card press zoom" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '16 / 10', background: '#FFFFFF', overflow: 'hidden', borderBottom: '1px solid var(--line)', position: 'relative' }}><img src={img} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16, boxSizing: 'border-box' }} /><span className="n" style={{ position: 'absolute', left: 14, top: 14, fontSize: 13, fontWeight: 800, color: '#6D5BD0' }}>{String(i + 1).padStart(2, '0')}</span></div>
              <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}><h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{name}</h3><span style={{ fontSize: 13, fontWeight: 600, color: '#6D5BD0' }}>{models}</span><p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--sub)' }}>{what}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KField() {
  return (
    <section id="field" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          <span className="eyebrow">How we measure</span>
          <h2 className="h2">Out on the plant floor</h2>
          <p className="lede">Every detailed audit means days on site: logging the supply, imaging panels and steam lines, and testing compressors, pumps, chillers and solar.</p>
        </div>
        <div className="mosaic" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: 210, gap: 12 }}>
          {MOSAIC.map(([f, t, s, cs, rs]: [string, string, string, number, number]) => (
            <figure key={f} className="zoom" style={{ margin: 0, position: 'relative', borderRadius: 22, overflow: 'hidden', background: '#1E1A33', gridColumn: `span ${cs}`, gridRow: `span ${rs}` }}>
              <img className="ph" src={`/field/mosaic/${f}.webp`} alt={`${t}: ${s}`} loading="lazy" />
              <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '40px 16px 14px', background: 'linear-gradient(180deg, transparent, rgba(11,10,20,.82))', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{t}</span><span style={{ fontSize: 12.5, color: '#DDDAE6' }}>{s}</span></figcaption>
            </figure>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div className="tile" style={{ flex: '1 1 460px', minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>Walkthrough audits with GEDA</h3><span className="pill pdark n" style={{ height: 32, fontSize: 13, cursor: 'default' }}>{COUNTS.walkthrough} walkthrough energy audits</span></div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--sub)' }}>One-day plant visits that find the quick wins: compressors, furnaces, drives, chillers and the lines that feed them.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {WALK.map(([n, alt]: string[]) => <div key={n} className="zoom" style={{ aspectRatio: '3 / 2', borderRadius: 14, overflow: 'hidden', background: '#ECEAF2' }}><img className="ph" src={`/field/walk/${n}.webp`} alt={alt} loading="lazy" /></div>)}
            </div>
          </div>
          <div className="tile" style={{ flex: '1 1 460px', minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>Measuring on site</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--sub)' }}>The team logging power, flow and heat during detailed audits, with the plant running as usual.</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
              {MEAS.map(([f, t, s]: string[]) => (
                <figure key={f} style={{ margin: 0, flex: '0 0 150px', borderRadius: 16, overflow: 'hidden', background: '#FFFFFF' }}><div className="zoom" style={{ aspectRatio: '3 / 4', overflow: 'hidden' }}><img className="ph" src={`/field/${f}.webp`} alt={`${t}: ${s}`} loading="lazy" /></div><figcaption style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 13, fontWeight: 700 }}>{t}</span><span style={{ fontSize: 11.5, lineHeight: 1.35, color: 'var(--sub)' }}>{s}</span></figcaption></figure>
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--mute)' }}>Photos from KISEM audits on site.</span>
      </div>
    </section>
  );
}
