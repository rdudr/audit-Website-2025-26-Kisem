// Team, awards, events and partners; Apply with the contact card; the footer.
// (The design's "Rooted at IIT Gandhinagar" campus band is left out on purpose.)
import { useEffect, useRef } from 'react';
import type { Session } from '../../lib/console';
import { APPLY_URL } from '../content';
import { AWARDS, EVENTS, I, PARTNERS, TEAM } from './design';
import { AS_OF, COUNTS } from './kutil';
import { Dot } from './KTop';

export function KTeam() {
  return (
    <section id="team" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
          <span className="eyebrow">Team</span>
          <h2 className="h2">The people behind the audits</h2>
          <p className="lede">Faculty from IIT Gandhinagar guide the programme; a field team of engineers runs every audit on site.</p>
        </div>
        {TEAM.map(([label, ppl]: [string, string[][]]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--sub)' }}>{label} <span className="n" style={{ fontWeight: 500, color: 'var(--mute)' }}>· {ppl.length} people</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))', gap: 14 }}>
              {ppl.map(([role, name, title, email, ph]) => (
                <article key={name} className="press" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ aspectRatio: '4 / 5', borderRadius: 22, overflow: 'hidden', background: '#ECEAF2' }}><img className="ph" src={`/team/${ph}.webp`} alt={name} loading="lazy" style={{ objectPosition: 'center 25%' }} /></div>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 2px', minWidth: 0 }}><span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6D5BD0' }}>{role}</span><span style={{ fontSize: 16, fontWeight: 700 }}>{name}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{title}</span><a href={'mailto:' + email} style={{ fontSize: 13, color: '#6D5BD0', textDecoration: 'none', wordBreak: 'break-all', paddingTop: 2 }}>{email}</a></span>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>Awards and recognition</h3>
          <div className="awardgrid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 14 }}>
            <article style={{ borderRadius: 28, padding: 26, background: 'radial-gradient(100% 80% at 90% 0%, rgba(252,211,77,.28), rgba(22,19,42,0) 60%), #16132A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(145deg, #FCD34D, #B45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg></span><span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#FCD34D' }}>NATIONAL AWARD · 2026</span></span>
              <span style={{ fontSize: 13, color: '#C9C5D6' }}>SEEM Awards 2026 · National Energy Management Awards</span>
              <h4 style={{ margin: 0, fontSize: 26, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-.02em' }}>Best Performance Award, Energy Audit Firm</h4>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#DDDAE6' }}>The Energy Assessment Cell, IIT Gandhinagar (KISEM) has been selected for the SEEM National Energy Management Awards 2026 by the Society of Energy Engineers and Managers, chosen by the national jury from nearly two hundred nominations across sectors.</p>
              <span style={{ fontSize: 13, color: '#FCD34D', fontWeight: 600, marginTop: 'auto' }}>Ceremony 3–4 December 2026 · Dr. Ambedkar International Convention Centre, New Delhi</span>
            </article>
            {AWARDS.map(([img, alt, kicker, t, s]: string[]) => {
              const [place, date, prize] = kicker.split(' · ');
              const [title, who] = t.split(' — ');
              return (
                <article key={t} className="zoom press" style={{ position: 'relative', minHeight: 420, borderRadius: 28, overflow: 'hidden', background: '#16132A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', isolation: 'isolate' }}>
                  <img className="ph" src={img} alt={alt} loading="lazy" style={{ position: 'absolute', inset: 0, zIndex: -2 }} />
                  <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, rgba(14,11,32,0) 30%, rgba(14,11,32,.55) 55%, rgba(14,11,32,.94) 100%)' }} />
                  <span style={{ position: 'absolute', top: 16, left: 16, height: 30, padding: '0 12px 0 6px', borderRadius: 999, background: 'linear-gradient(135deg, #FDE68A, #F59E0B)', color: '#3B2300', fontSize: 11.5, fontWeight: 800, letterSpacing: '.08em', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 20px -10px rgba(245,158,11,.9)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B2300" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /></svg></span>{prize || 'WINNER'}
                  </span>
                  <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span className="n" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', color: '#FCD34D' }}>{[place, date].filter(Boolean).join(' · ')}</span>
                    <span style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.01em' }}>{title}</span>
                    {who && <span style={{ fontSize: 14, fontWeight: 600, color: '#ECEAF2' }}>{who}</span>}
                    <span style={{ fontSize: 13, lineHeight: 1.5, color: '#C9C5D6' }}>{s}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}><h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>Events and outreach</h3><span className="n" style={{ fontSize: 14, color: 'var(--sub)' }}>{COUNTS.sessions} awareness sessions</span></div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
            {EVENTS.map(([key, tag, when, t, s, alt]: string[]) => (
              <article key={key} className="card" style={{ flex: '0 0 min(300px, 82vw)', overflow: 'hidden', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
                <div className="zoom" style={{ aspectRatio: '16 / 10', overflow: 'hidden', position: 'relative' }}><img className="ph" src={`/events/${key}-1.webp`} alt={alt} loading="lazy" /><span style={{ position: 'absolute', left: 12, top: 12, height: 26, padding: '0 10px', borderRadius: 999, background: 'rgba(255,255,255,.92)', fontSize: 11.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>{tag}</span></div>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 5 }}><span className="n" style={{ fontSize: 12, color: 'var(--mute)' }}>{when}</span><span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{t}</span><span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--sub)' }}>{s}</span></div>
              </article>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>Partners</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
            {PARTNERS.map(([name, role, logo]: string[]) => (
              <div key={name} className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: '100%', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, borderRadius: 12, background: 'transparent', color: '#FFFFFF', fontSize: 13, fontWeight: 800 }}>{logo ? <img src={logo} alt="" style={{ maxWidth: '100%', maxHeight: 56, objectFit: 'contain' }} /> : <span style={{ width: 72, height: 48, borderRadius: 12, background: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>MSME</span>}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{name}</span><span style={{ fontSize: 13, color: 'var(--sub)' }}>{role}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CONTACT: [string, string, string][] = [
  [I.pin, 'IIT Gandhinagar, Palaj, Gandhinagar, Gujarat 382055', 'https://maps.google.com/?q=IIT+Gandhinagar'],
  [I.mail, 'iea@iitgn.ac.in', 'mailto:iea@iitgn.ac.in'],
  [I.phone, '+91 90337 98820', 'tel:+919033798820'],
  [I.phone, '+91 96101 29501', 'tel:+919610129501'],
];

export function KApply() {
  return (
    <section id="apply" className="sec" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div style={{ position: 'relative', borderRadius: 36, overflow: 'hidden', isolation: 'isolate', color: '#FFFFFF', minHeight: 520 }}>
          <img src="/campus/river-sunset.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(110deg, rgba(14,11,32,.94) 0%, rgba(30,24,64,.8) 50%, rgba(30,24,64,.35) 100%)' }} />
          <div style={{ padding: 'clamp(24px, 6vw, 64px)', display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 380px', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span className="eyebrow" style={{ color: '#C4B8FF' }}>Apply</span>
              <h2 className="h2">Find out what your plant could save</h2>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: '#DDDAE6' }}>MSME units can apply for an energy assessment by the IIT Gandhinagar team, funded under Kotak Mahindra Bank's CSR programme.</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Seventeen areas audited on site, with calibrated instruments', 'Every measure costed, with its saving and payback', 'A follow-up visit to record what was carried out'].map(p => (
                  <li key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 16 }}><span style={{ width: 24, height: 24, borderRadius: '50%', background: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B0A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg></span>{p}</li>
                ))}
              </ul>
              <a className="btnd lg light" href={APPLY_URL} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start' }}>Apply for an audit<Dot /></a>
            </div>
            <div id="contact" style={{ flex: '0 1 360px', minWidth: 0, alignSelf: 'flex-end', borderRadius: 24, padding: 22, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#C4B8FF' }}>CONTACT</span>
              {CONTACT.map(([d, v, href]) => (
                <a key={v} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: '#FFFFFF', fontSize: 15 }}><span style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg></span><span className="n">{v}</span></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOT: [string, [string, string][]][] = [
  ['Explore', [['Impact', '#impact'], ['All audits', '#audits'], ['Map', '#map'], ['Sectors', '#sectors']]],
  ['The work', [['What an audit covers', '#scope'], ['FOX platform', '#scope'], ['Instruments', '#instruments'], ['On the plant floor', '#field']]],
  ['People', [['Team', '#team'], ['Apply for an audit', '#apply'], ['Contact', '#contact']]],
];

// The footer follows the FOX Console's: two soft waves that drift sideways as the page scrolls
// (still with reduced motion), a lavender band with the brand, link columns and a legal line.
const WAVE_BACK = 'M0 62 C 200 20, 400 20, 600 62 S 1000 104, 1200 62 S 1600 20, 1800 62 S 2200 104, 2400 62 V110 H0 Z';
const WAVE_FRONT = 'M0 40 C 220 100, 420 108, 640 74 S 1010 4, 1200 40 C 1420 100, 1620 108, 1840 74 S 2210 4, 2400 40 V110 H0 Z';

export function KFooter({ session }: { session: Session | null }) {
  const back = useRef<SVGSVGElement>(null), front = useRef<SVGSVGElement>(null);
  useEffect(() => {
    // Each wave repeats every 1200 of its 2400 units, so a shift of 0-50% loops with no seam.
    const loop = (px: number) => ((((px % 1200) + 1200) % 1200) / 2400) * 100;
    // Stretch: the faster the page scrolls, the taller the waves grow (up to about 1.7x); when
    // scrolling stops they ease back down to their resting height.
    let stretch = 0, lastY = window.scrollY || 0, lastT = performance.now(), raf = 0;
    const place = () => {
      const y = window.scrollY || 0;
      if (front.current) front.current.style.transform = `translateX(-${loop(y * 0.35).toFixed(3)}%) scaleY(${(1 + stretch).toFixed(3)})`;
      if (back.current) back.current.style.transform = `translateX(-${loop(-y * 0.21 + 300).toFixed(3)}%) scaleY(${(1 + stretch * 1.35).toFixed(3)})`;
    };
    place();
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const settle = () => {
      stretch *= 0.9;
      if (stretch < 0.004) stretch = 0;
      place();
      raf = stretch ? requestAnimationFrame(settle) : 0;
    };
    const onScroll = () => {
      const y = window.scrollY || 0, t = performance.now();
      const speed = Math.abs(y - lastY) / Math.max(8, t - lastT); // px per ms
      lastY = y; lastT = t;
      stretch = Math.max(stretch, Math.min(0.7, speed * 0.35));
      place();
      if (!raf) raf = requestAnimationFrame(settle);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const wave = (ref: typeof back, d: string, fill: string, bottom: number) => (
    <svg ref={ref} viewBox="0 0 2400 110" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom, width: '200%', height: 110, display: 'block', willChange: 'transform', transformOrigin: 'bottom' }}><path d={d} fill={fill} /></svg>
  );
  return (
    <footer className="kfoot" style={{ marginTop: 0, color: '#2B2644', overflowX: 'clip' }}>
      <div aria-hidden="true" style={{ position: 'relative', height: 110, marginTop: 100, overflow: 'visible', clipPath: 'inset(-120px 0 0 0)' }}>
        {wave(back, WAVE_BACK, '#EEEDF3', 0)}
        {wave(front, WAVE_FRONT, '#E4E3EC', -1)}
      </div>
      <div className="kfoot-body" style={{ background: '#E4E3EC', padding: '12px 40px 28px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px 64px', justifyContent: 'space-between', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
          <div style={{ flex: '1 1 260px', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#2B2644', fontSize: 17, fontWeight: 700, letterSpacing: '.02em' }}>
              <span style={{ display: 'flex', gap: 8 }}>
                <img src="/brand/kisem.png" alt="" width={38} height={38} style={{ borderRadius: 11, background: '#FFFFFF', objectFit: 'contain', padding: 3, boxSizing: 'border-box' }} />
                <img src="/brand/iitgn.png" alt="" width={38} height={38} style={{ borderRadius: 11, background: '#FFFFFF', objectFit: 'contain', padding: 3, boxSizing: 'border-box' }} />
              </span>
              <span>KISEM · IIT GANDHINAGAR</span>
            </a>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#3A3A3A' }}>Energy audits for MSMEs in Gujarat, Rajasthan and Daman, funded under Kotak Mahindra Bank's CSR programme.</p>
            <p style={{ margin: 0, fontSize: 13, color: '#3A3A3A' }}>Questions about an audit: <a href={CONTACT[1][2]} style={{ color: '#2B2644' }}>{CONTACT[1][1]}</a></p>
          </div>
          <div style={{ flex: '2 1 420px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '28px 32px' }}>
            {FOOT.map(([t, links]) => (
              <nav key={t} aria-label={t} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 600, paddingBottom: 4 }}>{t}</span>
                {links.map(([l, h]) => <a key={h} className="kflink" href={h}>{l}</a>)}
                {t === 'People' && session && <a className="kflink" href="#/companies">Companies (team)</a>}
              </nav>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', borderTop: '1px solid #A9A6BB', paddingTop: 18, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', fontSize: 13, color: '#5E5E5E' }}>
          <span>© {new Date().getFullYear()} KISEM, IIT Gandhinagar. Figures are totals across all KISEM audits, from the master data sheet as of {AS_OF}.</span>
          <span>Campus photographs: IIT Gandhinagar</span>
        </div>
      </div>
    </footer>
  );
}
