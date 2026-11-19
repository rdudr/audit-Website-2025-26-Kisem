// Top of the redesigned page: the white pill navigation (with the team bar when signed in), the
// hero with the implementation scorecard, the partner strip, the scroll statement with its glow,
// and the dark split with Laal Minar. Motion follows the design export and switches off for
// prefers-reduced-motion.
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { Row } from '../../data';
import { APPLY_URL } from '../content';
import { H2, PARTNERS, STATS, STMT } from './design';
import { COUNTS, DOT_PATH, cr, indN, pctS, totals } from './kutil';

const NAV: [string, string][] = [['Impact', '#impact'], ['Years', '#journey'], ['Audits', '#audits'], ['Map', '#map'], ['Sectors', '#sectors'], ['Scope', '#scope'], ['Team', '#team'], ['Contact', '#contact']];
const NAV_TOP = ['Impact', 'Audits', 'Map', 'Sectors', 'Scope', 'FOX', 'Team'];

export function Dot({ big }: { big?: boolean }) {
  return <span className="dot"><svg viewBox="0 0 12 12" aria-hidden="true"><path d={DOT_PATH} /></svg>{big ? null : null}</span>;
}

/** Highlights the nav link of the section on screen. */
function useActive() {
  const [on, setOn] = useState('Impact');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) {
        const hit = NAV.find(([, h]) => h === '#' + e.target.id);
        if (hit) setOn(hit[0]);
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([, h]) => { const el = document.getElementById(h.slice(1)); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return on;
}

export function KNav({ signed, signLabel, onSign, teamBar }: { signed: boolean; signLabel: string; onSign: () => void; teamBar: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const on = useActive();
  const links = NAV.filter(([l]) => NAV_TOP.includes(l));
  const extra: [string, string][] = signed ? [['Companies', '#/companies']] : [];
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, padding: '18px var(--gut) 0', pointerEvents: 'none' }}>
      <nav id="knav" className="knav" aria-label="Main" style={{ pointerEvents: 'auto' }}>
        <a href="#top" className="kbrand">
          <img src="/brand/kisem.png" alt="" width={30} height={30} style={{ borderRadius: 8, objectFit: 'contain' }} />
          <img src="/brand/iitgn.png" alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-.02em' }}>KISEM <span className="hide-sm" style={{ color: 'var(--mute)', fontWeight: 500 }}>· IIT Gandhinagar</span></span>
        </a>
        <div className="navlinks klinks">
          {links.map(([l, h]) => <a key={h} className="klink" href={h} aria-current={on === l ? 'true' : 'false'}>{l}</a>)}
        </div>
        <span style={{ flex: 1 }} />
        <button type="button" className="klogin hide-sm" onClick={onSign}>{signLabel}</button>
        <span className="navcta hide-sm"><a className="btnd" href={APPLY_URL} target="_blank" rel="noopener" style={{ width: 168 }}><span className="lbl">Apply for an audit</span><Dot /></a></span>
        <button type="button" className="menubtn" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="kmenu" aria-label="Menu"
          style={{ width: 44, height: 44, border: 0, borderRadius: 999, background: 'rgba(11,10,20,.06)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', marginLeft: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </nav>
      {menu && (
        <div id="kmenu" style={{ pointerEvents: 'auto', margin: '8px 0 0', borderRadius: 24, background: '#FFFFFF', boxShadow: '0 18px 40px -16px rgba(22,19,42,.35)', padding: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 4, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          {[...NAV, ...extra].map(([l, h]) => (
            <a key={h} href={h} onClick={() => setMenu(false)} style={{ minHeight: 48, padding: '0 14px', borderRadius: 14, display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600, textDecoration: 'none', background: on === l ? '#ECEAF8' : 'transparent' }}>{l}</a>
          ))}
          <button type="button" onClick={() => { setMenu(false); onSign(); }} style={{ minHeight: 48, borderRadius: 14, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{signLabel}</button>
          <a href={APPLY_URL} target="_blank" rel="noopener" onClick={() => setMenu(false)} style={{ minHeight: 48, borderRadius: 14, background: '#16132A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>Apply for an audit</a>
        </div>
      )}
      {teamBar && <div style={{ pointerEvents: 'auto', marginTop: 8 }}>{teamBar}</div>}
    </div>
  );
}

// The skyline video of the previous landing page, behind the hero. Phones, data saver and
// reduced motion get its still frame; it pauses when scrolled away and has a pause button.
function HeroVideo({ host }: { host: RefObject<HTMLElement | null> }) {
  const still = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  const lite = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return !!saveData || window.innerWidth < 640;
  }, []);
  const video = !still && !lite;
  const vid = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = host.current;
    if (!video || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [video, host]);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (!paused && inView) v.play().catch(() => {});
    else v.pause();
  }, [paused, inView]);
  const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -3 } as const;
  if (!video) return <img src="/hero-skyline-poster.jpg" alt="" aria-hidden="true" style={fill} />;
  return (
    <>
      <video ref={vid} muted loop playsInline preload="metadata" poster="/hero-skyline-poster.jpg" aria-hidden="true" style={fill}><source src="/hero-skyline.mp4" type="video/mp4" /></video>
      <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play the background video' : 'Pause the background video'} title={paused ? 'Play video' : 'Pause video'} style={{ position: 'absolute', right: 20, bottom: 20, zIndex: 2, width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', background: 'rgba(14,11,32,.55)', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        {paused
          ? <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9.5-5.5z" fill="currentColor" /></svg>
          : <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" /></svg>}
      </button>
    </>
  );
}

export function KHero({ rows }: { rows: Row[] }) {
  const host = useRef<HTMLElement>(null);
  const T = totals(rows);
  const vals = [COUNTS.walkthrough, rows.length, COUNTS.clusters, COUNTS.iga, COUNTS.sessions];
  const pct = pctS(T.in, T.rn);
  return (
    <section id="top" ref={host} style={{ position: 'relative', marginTop: -80, minHeight: 860, color: '#FFFFFF', overflow: 'hidden', isolation: 'isolate', background: '#16132A' }}>
      <HeroVideo host={host} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -2, background: 'linear-gradient(100deg, rgba(14,11,32,.95) 0%, rgba(30,24,64,.82) 42%, rgba(43,38,68,.35) 75%, rgba(43,38,68,.15) 100%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -2, background: 'linear-gradient(180deg, rgba(14,11,32,.55) 0%, rgba(14,11,32,0) 22%, rgba(14,11,32,0) 60%, rgba(14,11,32,.92) 100%)' }} />
      <div className="wrap" style={{ paddingTop: 168, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 520px', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={{ alignSelf: 'flex-start', minHeight: 34, padding: '4px 14px 4px 12px', boxSizing: 'border-box', borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: '#ECEAF2' }}><span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />Energy audits for industry · FY 2022–23 to 2026–27</span>
            <h1 style={{ margin: 0, fontSize: 'clamp(44px, 7.4vw, 88px)', lineHeight: 0.98, fontWeight: 700, letterSpacing: '-.045em', textWrap: 'balance' }}>Measuring the energy of an <span style={{ background: 'linear-gradient(92deg, #FFFFFF 0%, #DCD3FF 45%, #A796FF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>industrial state</span></h1>
            <p className="n" style={{ margin: 0, fontSize: 'clamp(17px, 1.7vw, 21px)', lineHeight: 1.55, color: '#DDDAE6', maxWidth: 600 }}>
              {rows.length} detailed audits across MSMEs in Gujarat, Rajasthan and Daman. {T.in} of the {T.rn} recommended measures are implemented, saving {cr(T.ii)} and {indN(T.ic)} tonnes of CO₂ a year.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btnd lg light" href={APPLY_URL} target="_blank" rel="noopener">Apply for an audit<Dot /></a>
              <a className="pill pglass" href="#audits" style={{ height: 52, padding: '0 24px', fontSize: 16 }}>Explore all audits</a>
            </div>
          </div>
          <aside aria-label="Implementation scorecard" style={{ flex: '0 1 380px', minWidth: 0, borderRadius: 28, padding: 22, background: 'linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,.05))', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(22px) saturate(140%)', WebkitBackdropFilter: 'blur(22px) saturate(140%)', boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#DCD3FF' }}>Implementation scorecard</span><span style={{ fontSize: 12, color: '#C9C5D6' }}>All audits · per year</span></div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <svg width="118" height="118" viewBox="0 0 36 36" role="img" aria-label={pct + ' of measures implemented'} style={{ flexShrink: 0 }}>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3.4" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#4ADE80" strokeWidth="3.4" strokeLinecap="round" strokeDasharray={(T.rn ? (100 * T.in / T.rn) * 0.974 : 0).toFixed(1) + ' 100'} transform="rotate(-90 18 18)" />
                <text x="18" y="18.4" textAnchor="middle" fontSize="8.4" fontWeight="700" fill="#FFFFFF" fontFamily="Inter, sans-serif">{pct}</text>
                <text x="18" y="23.6" textAnchor="middle" fontSize="2.6" fill="#C9C5D6" fontFamily="Inter, sans-serif">of ECMs implemented</text>
              </svg>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><dt style={{ fontSize: 12, color: '#C9C5D6' }}>Saving achieved, a year</dt><dd className="n" style={{ margin: '2px 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-.02em', color: '#86EFAC' }}>{cr(T.ii)}</dd></div>
                <div><dt style={{ fontSize: 12, color: '#C9C5D6' }}>CO₂ avoided, a year</dt><dd className="n" style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: '#86EFAC' }}>{indN(T.ic)} t CO₂e</dd></div>
              </dl>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ borderRadius: 16, background: 'rgba(255,255,255,.08)', padding: '12px 14px' }}><span className="n" style={{ display: 'block', fontSize: 20, fontWeight: 700 }}>{T.ii ? Math.round((12 * T.iv) / T.ii) : 0} months</span><span style={{ fontSize: 12, color: '#C9C5D6' }}>Average payback</span></div>
              <div style={{ borderRadius: 16, background: 'rgba(255,255,255,.08)', padding: '12px 14px' }}><span className="n" style={{ display: 'block', fontSize: 20, fontWeight: 700 }}>{T.in} of {T.rn}</span><span style={{ fontSize: 12, color: '#C9C5D6' }}>ECMs implemented</span></div>
            </div>
          </aside>
        </div>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(190px, 100%), 1fr))', gap: 12 }}>
          {STATS.map(([label, tag, note, d, d2]: string[], i: number) => (
            <div key={label} className="press" style={{ borderRadius: 22, padding: 18, background: 'linear-gradient(160deg, rgba(255,255,255,.13), rgba(255,255,255,.04))', border: '1px solid rgba(255,255,255,.16)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(145deg, #8E88A8, #4A4270)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d2} fill="rgba(228,222,255,.22)" stroke="#E4DEFF" strokeWidth="1.5" /><path d={d} stroke="#FFFFFF" strokeWidth="1.6" /></svg></span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#C9C5D6' }}>{tag}</span>
              </span>
              <dd className="n" style={{ margin: 0, fontSize: 40, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1 }}>{vals[i]}</dd>
              <dt style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span><span style={{ fontSize: 13, lineHeight: 1.4, color: '#C9C5D6' }}>{note}</span></dt>
            </div>
          ))}
        </dl>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#C9C5D6' }}>
          <a href="#impact" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#DDDAE6' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>Scroll to see the impact</a>
          <span>IIT Gandhinagar campus, Palaj</span>
        </div>
      </div>
    </section>
  );
}

export function KPartners() {
  const list = [...PARTNERS, ...PARTNERS].filter((p: string[]) => p[2]);
  const half = list.length / 2;
  return (
    <section aria-label="Partners" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="wrap" style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <span className="hide-sm" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mute)', whiteSpace: 'nowrap' }}>In partnership with</span>
        <div className="marqwrap" style={{ flex: 1, minWidth: 0, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
          <div className="marq" style={{ display: 'flex', gap: 56, width: 'max-content', alignItems: 'center' }}>
            {list.map((p: string[], i: number) => (
              <span key={i} aria-hidden={i >= half} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
                <img src={p[2]} alt="" style={{ height: 38, maxWidth: 110, objectFit: 'contain' }} />
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{p[0]}</span><span style={{ fontSize: 12, color: 'var(--mute)' }}>{p[1]}</span></span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------- letter-by-letter reveal text

function Letters({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="kline">
          {line.split(' ').map((w, wi) => {
            const hl = w.startsWith('*');
            const t = w.replace(/\*/g, '');
            return (
              <Fragment key={wi}>
                <span className="kw" aria-hidden="true">{[...t].map((c, ci) => <span key={ci} className="ch" data-hl={hl ? '1' : '0'}>{c}</span>)}</span>{' '}
              </Fragment>
            );
          })}
        </span>
      ))}
    </>
  );
}
const plain = (L: string[]) => L.join(' ').replace(/\*/g, '');

// The glow and the reveal, ported from the design export's component.
const GLOW = { core: [181, 164, 255], rim: [236, 230, 255], out: [255, 255, 255] };
const KEYS: Record<string, number[]> = { q: [0, 0.03, 0.08, 0.18, 0.4, 0.66, 0.87, 1.15, 1.43, 1.8], tip: [0.3, 0.45, 0.65, 0.8, 0.95, 1.05, 1.05, 1.1, 1.3, 2.4], half: [0.34, 0.38, 0.38, 0.38, 0.38, 0.46, 0.66, 0.9, 1.6, 3.0], soft: [0.22, 0.26, 0.22, 0.22, 0.19, 0.16, 0.13, 0.1, 0.1, 0.1] };
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const sstep = (v: number) => { v = clamp01(v); return v * v * (3 - 2 * v); };
const interp = (key: string, q: number) => {
  const Q = KEYS.q, V = KEYS[key];
  if (q <= Q[0]) return V[0];
  for (let i = 1; i < Q.length; i++) if (q <= Q[i]) { const t = (q - Q[i - 1]) / (Q[i] - Q[i - 1]); return V[i - 1] + (V[i] - V[i - 1]) * t; }
  return V[V.length - 1];
};
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function paintChars(chars: NodeListOf<HTMLElement>, p: number, spread: number, fin: string, acc: string, ghost: string, hlc: string) {
  const n = chars.length, F = hex(fin), A = hex(acc), G = hex(ghost), HL = hex(hlc);
  for (let i = 0; i < n; i++) {
    const el = chars[i], t = clamp01((p * (1 + spread) - i / n) / spread), hl = el.getAttribute('data-hl') === '1';
    let o: number, c: number[], b: number;
    if (t <= 0) { o = 0; c = G; b = 8; }
    else if (t < 0.35) { const u = t / 0.35; o = u; c = G; b = 8 - 6.5 * u; }
    else if (t < 0.7) { const u = (t - 0.35) / 0.35; o = 1; c = mix(G, A, u); b = 1.5 * (1 - u); }
    else { const u = (t - 0.7) / 0.3; o = 1; c = mix(A, hl ? HL : F, u); b = 0; }
    el.style.opacity = o.toFixed(3); el.style.color = 'rgb(' + c.map(Math.round).join(',') + ')'; el.style.filter = b > 0.05 ? 'blur(' + b.toFixed(2) + 'px)' : 'none';
  }
}

function useStoryMotion() {
  useEffect(() => {
    const still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const cur = { tip: -0.3, half: 0.3, soft: 0.1 } as Record<string, number>;
    let tgt = { tip: 0.3, half: 0.34, soft: 0.22 } as Record<string, number>;
    const t0 = performance.now();
    const $ = (id: string) => document.getElementById(id);
    let raf = 0, q = 0;
    const update = () => {
      const vh = window.innerHeight || 800, sec = $('kstate'), spl = $('ksplit'), nav = $('knav');
      if (!sec || !spl) return;
      const qs = -sec.getBoundingClientRect().top / vh;
      const qq = Math.max(0, (qs + 0.8) * 0.75);
      tgt = { tip: interp('tip', qq), half: interp('half', qq), soft: interp('soft', qq) };
      const p = still ? 1 : clamp01((qs - 0.1) / 1.5), rise = clamp01((qs + 0.2) / 0.6);
      const stmt = $('kstmt');
      if (stmt) { stmt.style.transform = 'translateY(' + (0.205 * (1 - rise) * (1 - rise) * vh).toFixed(1) + 'px)'; paintChars(stmt.querySelectorAll('.ch'), p, 0.16, '#16132A', '#6D5BD0', '#FFFFFF', '#5B3FD6'); }
      const tag = $('kstateTag'); if (tag) tag.setAttribute('data-on', qs > -0.4 ? '1' : '0');
      if (nav) nav.setAttribute('data-on', p > 0.4 || qs > 3 ? '1' : '0');
      const top = spl.getBoundingClientRect().top / vh, p2 = still ? 1 : clamp01((0.8 - top) / 0.65);
      const h2 = $('kh2'); if (h2) paintChars(h2.querySelectorAll('.ch'), p2, 0.35, '#FFFFFF', '#C4B8FF', '#5E567E', '#C4B8FF');
      const row = $('krow'); if (row) row.setAttribute('data-on', p2 > 0.92 ? '1' : '0');
      const img = $('kship'); if (img) img.style.transform = 'scale(' + (1.08 - 0.08 * clamp01(1 - top)).toFixed(4) + ')';
    };
    const draw = (now: number) => {
      const cv = $('kglow') as HTMLCanvasElement | null;
      const box = cv?.getBoundingClientRect();
      if (cv && box && box.bottom > -50 && box.top < (window.innerHeight || 800) + 50) {
        const intro = clamp01((now - t0 - 250) / 1050);
        for (const k of ['tip', 'half', 'soft']) cur[k] += (tgt[k] - cur[k]) * (intro < 1 ? sstep(intro) * 0.5 + 0.05 : 0.12);
        let tip = cur.tip, half = cur.half; const soft = cur.soft;
        if (!still) { tip += Math.sin(now * 0.00033 + 1.3) * 0.02; half += Math.sin(now * 0.0005) * 0.015; }
        const W = 96, H = 60, asp = cv.clientWidth / Math.max(1, cv.clientHeight), ctx = cv.getContext('2d');
        if (ctx) {
          const img = ctx.createImageData(W, H), d = img.data;
          const P: number[][] = []; const tp = Math.max(tip, 0.001);
          for (let k = 0; k < 48; k++) { const yy = -0.3 + ((tp + 0.3) * k) / 47; P.push([half * asp * Math.pow(Math.max(0, 1 - yy / tp), 0.72), yy]); }
          for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
            const px = Math.abs((i + 0.5) / W - 0.5) * asp, py = (j + 0.5) / H;
            let best = 1e9;
            for (let k = 0; k < 47; k++) {
              const ax = P[k][0], ay = P[k][1], vx = P[k + 1][0] - ax, vy = P[k + 1][1] - ay;
              const l = vx * vx + vy * vy || 1e-9;
              let t = ((px - ax) * vx + (py - ay) * vy) / l; t = t < 0 ? 0 : t > 1 ? 1 : t;
              const dx = px - ax - vx * t, dy = py - ay - vy * t, dd = dx * dx + dy * dy;
              if (dd < best) best = dd;
            }
            let sd = Math.sqrt(best);
            const inside = py < tp && px < half * asp * Math.pow(Math.max(0, 1 - py / tp), 0.72);
            if (inside) sd = -sd;
            sd -= 0.25;
            const g = 1 - sstep((sd + soft) / (2 * soft));
            const c = g < 0.38 ? mix(GLOW.out, GLOW.rim, sstep(g / 0.38)) : mix(GLOW.rim, GLOW.core, sstep((g - 0.38) / 0.62));
            const o = (j * W + i) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
          }
          ctx.putImageData(img, 0, 0);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const onScroll = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; update(); }); };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    update();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); cancelAnimationFrame(q); };
  }, []);
}

export function KStory({ rows }: { rows: Row[] }) {
  useStoryMotion();
  const split: [string, string][] = [[String(COUNTS.walkthrough + rows.length), 'audits so far'], ['17', 'areas measured on site'], ['3 months', 'to the verification visit']];
  return (
    <>
      <section id="kstate" aria-label="What KISEM does" style={{ position: 'relative', height: '300vh', background: '#FFFFFF' }}>
        <div className="kpin" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <canvas id="kglow" width={96} height={60} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, paddingTop: '18vh', display: 'flex', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center' }}>
            <span id="kstateTag" className="kfade" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#4C3FB0', padding: '0 20px' }}>Kotak IIT Madras Save Energy Mission · IIT Gandhinagar</span>
          </div>
          <p id="kstmt" className="krv" aria-label={plain(STMT)} style={{ position: 'absolute', top: '38vh', left: 0, right: 0, margin: '0 auto', padding: '0 20px', textAlign: 'center', fontSize: 'clamp(22px, 2.55vw, 40px)', lineHeight: 1.18, fontWeight: 500, letterSpacing: '-.03em', willChange: 'transform' }}>
            <Letters lines={STMT} />
          </p>
        </div>
      </section>
      <section id="ksplit" className="ksplit" aria-label="How we work">
        <div className="kl">
          <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'var(--gut)', width: 1, background: 'rgba(255,255,255,.12)' }} />
          <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(var(--gut) + 6.2vw)', width: 1, background: 'rgba(255,255,255,.05)' }} />
          <h2 id="kh2" className="krv" aria-label={plain(H2)} style={{ margin: 0, padding: '21vh 0 0 calc(var(--gut) + 6.2vw)', fontSize: 'clamp(32px, 3.4vw, 54px)', lineHeight: 1.08, fontWeight: 500, letterSpacing: '-.035em', position: 'relative' }}>
            <Letters lines={H2} />
          </h2>
          <div id="krow" className="krow">
            <h3 style={{ margin: 0, fontSize: 'clamp(17px, 1.4vw, 21px)', fontWeight: 500 }}>MSME plants</h3>
            <p style={{ margin: 0, fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.45, color: 'rgba(255,255,255,.55)', maxWidth: '22em' }}><strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Measured. Costed. Verified.</strong> Seventeen areas logged on site, every measure priced with its saving and payback, and a return visit to record what the plant carried out.</p>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 28, flexWrap: 'wrap', paddingTop: '2vh' }}>
              {split.map(([v, k]) => <span key={k} style={{ display: 'flex', flexDirection: 'column' }}><span className="n" style={{ fontSize: 'clamp(26px, 2.4vw, 36px)', fontWeight: 600, letterSpacing: '-.03em', color: '#FFFFFF' }}>{v}</span><span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{k}</span></span>)}
            </div>
          </div>
        </div>
        <div className="kr">
          <img id="kship" src="/campus/lal-minar.jpg" alt="Laal Minar at IIT Gandhinagar at dusk" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '50% 60%', transform: 'scale(1.08)' }} />
          <span style={{ position: 'absolute', left: 18, bottom: 18, height: 30, padding: '0 12px', borderRadius: 999, background: 'rgba(26,21,51,.55)', backdropFilter: 'blur(10px)', color: '#FFFFFF', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Laal Minar · IIT Gandhinagar</span>
        </div>
      </section>
    </>
  );
}
