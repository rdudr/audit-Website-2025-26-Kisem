// Team, awards, events and partners; Apply with the contact card; the footer.
// (The design's "Rooted at IIT Gandhinagar" campus band is left out on purpose.)
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
            {AWARDS.map(([img, alt, kicker, t, s]: string[]) => (
              <article key={t} className="card press" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="zoom" style={{ aspectRatio: '4 / 3', overflow: 'hidden' }}><img className="ph" src={img} alt={alt} loading="lazy" /></div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.07em', color: '#6D5BD0' }}>{kicker}</span><span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{t}</span><span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--sub)' }}>{s}</span></div>
              </article>
            ))}
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
              <div key={name} className="card" style={{ minHeight: 92, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 64, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 12, background: logo ? 'transparent' : '#2B2644', color: '#FFFFFF', fontSize: 13, fontWeight: 800 }}>{logo ? <img src={logo} alt="" style={{ maxWidth: 64, maxHeight: 44, objectFit: 'contain' }} /> : 'MSME'}</span>
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
  ['The work', [['What an audit covers', '#scope'], ['FOX platform', '#fox'], ['Instruments', '#instruments'], ['On the plant floor', '#field']]],
  ['People', [['Team', '#team'], ['Apply for an audit', '#apply'], ['Contact', '#contact']]],
];

export function KFooter({ session }: { session: Session | null }) {
  return (
    <footer style={{ marginTop: 72, position: 'relative', overflow: 'hidden', isolation: 'isolate', color: '#DDDAE6', background: '#0E0B20' }}>
      <img src="/campus/night-stadium.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28, zIndex: -1 }} />
      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}><img src="/brand/kisem.png" alt="KISEM" width={38} height={38} style={{ borderRadius: 10, background: '#FFFFFF', objectFit: 'contain' }} /><img src="/brand/iitgn.png" alt="IIT Gandhinagar" width={38} height={38} style={{ objectFit: 'contain', background: '#FFFFFF', borderRadius: 10 }} /></span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>KISEM · IIT Gandhinagar</span>
            <span style={{ fontSize: 13, lineHeight: 1.6 }}>Energy audits for MSMEs in Gujarat, Rajasthan and Daman, funded under Kotak Mahindra Bank's CSR programme.</span>
          </div>
          {FOOT.map(([t, links]) => (
            <nav key={t} aria-label={t} style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 150 }}><span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#8E88A8' }}>{t.toUpperCase()}</span>{links.map(([l, h]) => <a key={h} href={h} style={{ fontSize: 14, color: '#DDDAE6', textDecoration: 'none' }}>{l}</a>)}{t === 'People' && session && <a href="#/companies" style={{ fontSize: 14, color: '#DDDAE6', textDecoration: 'none' }}>Companies (team)</a>}</nav>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.12)', fontSize: 12, color: '#8E88A8' }}><span>Figures are totals across all KISEM audits, from the master data sheet as of {AS_OF}.</span><span>Campus photographs: IIT Gandhinagar</span></div>
      </div>
    </footer>
  );
}
