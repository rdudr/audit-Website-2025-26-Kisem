import { data } from '../data';
import { CONSOLE_URL, type Session } from '../lib/console';
import { APPLY_URL, CONTACT, PARTNERS, TEAMS, WORKSHOPS_CONDUCTED } from './content';
import { ReportButton } from './Sections';
import { useDevice } from './useDevice';

// Team, awards, events, partners, contact and footer (canvas "Component · Team, contact, footer").
// Events show three photos at most (a cover and two small ones), to keep the page short.

type Ev = { key: string; n: number; tag: string; t: string; s: string; alts: string[] };
const EVENTS: Ev[] = [
  { key: 'vibrant', n: 2, tag: 'Vibrant Gujarat', t: 'Vibrant Gujarat Regional Conference', s: 'North Gujarat regional conference on industry and energy.', alts: ['Panel at the Vibrant Gujarat Regional Conference', 'Conference session'] },
  { key: 'ai-msme', n: 2, tag: 'Workshop', t: 'Future Ready MSMEs with AI', s: 'Workshop on using AI to make MSMEs future ready.', alts: ['Speaker at the workshop on future-ready MSMEs with AI', 'Workshop session'] },
  { key: 'surat', n: 2, tag: 'Surat · with WRI India', t: 'Future Ready MSMEs, Surat', s: 'Industrial decarbonisation and process optimisation, with WRI India.', alts: ['Two KISEM team members at the Future Ready MSMEs event', 'Presentation on energy assessment for MSMEs'] },
  { key: 'wri', n: 1, tag: 'With WRI India', t: 'Sustainability awareness programme', s: 'Energy assessment and sustainability studies under KISEM, presented to industry.', alts: ['Presentation on energy assessment and sustainability studies'] },
  { key: 'fdp', n: 2, tag: 'Bhavnagar · Jan 2026', t: 'Faculty development programme', s: 'Energy assessment sessions for faculty at Shantilal Shah Engineering College.', alts: ['Session at Shantilal Shah Engineering College, Bhavnagar', 'Faculty development programme hall'] },
  { key: 'geda', n: 3, tag: 'With GEDA', t: 'Energy conservation workshops in colleges', s: 'Awareness workshops for engineering students, with GEDA.', alts: ['Energy conservation awareness workshop at a college', 'Workshop audience', 'Instrument demonstration for students'] },
];
// Awards and recognition: the team's own wins.
const AWARDS = [
  { img: '/events/quiz-1.webp', alt: 'Sagar Loriya receiving the winner’s prize on stage at the Power and Energy Quiz, Mehsana', kicker: 'Mehsana · 9 Oct 2025 · Winner', t: 'Igniting Young Minds: Power and Energy Quiz — Mr. Sagar Loriya', s: 'Won the state Power and Energy Quiz, representing the KISEM energy audit team at IIT Gandhinagar.' },
  { img: '/events/award-1.webp', alt: 'Md Faizan receiving the Student of the Year award on stage', kicker: 'Individual award · Winner', t: 'Student of the Year — Mr. Md Faizan', s: 'Recognised for work with the KISEM energy audit team at IIT Gandhinagar.' },
];
const MAIL = 'M4 4h16v16H4zM4 6l8 7 8-7';
const CHECK = 'M20 6L9 17l-5-5';
const ARROW = 'M5 12h14M13 6l6 6-6 6';
const PIN = 'M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';
const PHONE = 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z';
const Svg = ({ d, size = 18, stroke = '#C4B8FF', w = 2 }: { d: string; size?: number; stroke?: string; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d={d} /></svg>
);

export default function PeopleSection({ session }: { session: Session | null }) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const L = {
    pad: D ? '104px 40px 0' : T ? '80px 32px 0' : '64px 16px 0', h2: D ? 48 : T ? 40 : 32, lede: D ? 18 : 16,
    oCols: D ? 'repeat(3, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
    awInner: D || T ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
    pCols: D ? 'repeat(5, minmax(0, 1fr))' : T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
    cPad: D ? '104px 40px' : T ? '80px 32px' : '64px 16px', cIn: D ? '56px' : T ? '40px' : '28px 20px',
    cCols: D ? 'minmax(0, 1.2fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
  };
  const cols = (n: number) => (D ? (n === 4 ? 'repeat(4, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))') : T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))');
  const sub = (t: string, right?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#2B2644' }}>{t}</h3>
      <span style={{ flex: 1, height: 1, background: '#ECEAF2' }} />
      {right && <span style={{ fontSize: 12, fontWeight: 600, color: '#6B6880' }}>{right}</span>}
    </div>
  );
  const glass = { display: 'flex', gap: 14, alignItems: 'center', padding: 14, borderRadius: 16, background: 'rgba(255,255,255,.07)', color: '#FFFFFF', textDecoration: 'none', fontSize: 15, lineHeight: 1.45 } as const;
  const ico = (d: string) => <span style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(196,184,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Svg d={d} /></span>;

  return (
    <div className="rd">
      <section id="team" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
          <span className="rd-eyebrow">Team</span>
          <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>The people behind the audits</h2>
          <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>Faculty from IIT Gandhinagar guide the programme; a field team of engineers runs every audit on site.</p>
        </div>

        {TEAMS.map(g => (
          <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sub(g.label, g.people.length + ' people')}
            <div style={{ display: 'grid', gridTemplateColumns: cols(g.people.length), gap: 14 }}>
              {g.people.map(m => (
                <article key={m.email} className="rd-lift rd-card" style={{ border: '1px solid #E7E5EE', borderRadius: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FFFFFF', minWidth: 0 }}>
                  <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: '#ECE8F0' }}>
                    <picture><source srcSet={m.photo.replace(/\.jpg$/, '.webp')} type="image/webp" /><img src={m.photo} alt={m.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></picture>
                  </div>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '14px 16px 16px', minWidth: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#5B3FD6' }}>{m.role}</span>
                    <b style={{ fontSize: 16, fontWeight: 700 }}>{m.name}</b>
                    <span style={{ fontSize: 13, color: '#55526A' }}>{m.title}</span>
                    <a href={'mailto:' + m.email} style={{ fontSize: 12, fontWeight: 500, color: '#2B2644', overflowWrap: 'anywhere', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, minHeight: 24 }}><Svg d={MAIL} size={13} stroke="currentColor" />{m.email}</a>
                  </span>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div id="awards" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 72 }}>
          {sub('Awards and recognition')}
          <div style={{ display: 'grid', gridTemplateColumns: D ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', gap: 14 }}>
            {AWARDS.map(a => (
              <article key={a.t} className="rd-lift" style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid #E7E5EE', background: '#FFFFFF', display: 'grid', gridTemplateColumns: L.awInner, minWidth: 0 }}>
                <div style={{ aspectRatio: '3 / 2', overflow: 'hidden' }}><img src={a.img} alt={a.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5B3FD6' }}>{a.kicker}</span>
                  <b style={{ fontSize: 17 }}>{a.t}</b>
                  <span style={{ fontSize: 13, lineHeight: 1.5, color: '#55526A' }}>{a.s}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div id="events" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 72 }}>
          {sub('Events and outreach', `${WORKSHOPS_CONDUCTED} awareness programmes`)}
          <div style={{ display: 'grid', gridTemplateColumns: L.oCols, gap: 16 }}>
            {EVENTS.map(o => (
              <article key={o.key} className="rd-lift rd-card" style={{ margin: 0, borderRadius: 20, overflow: 'hidden', border: '1px solid #E7E5EE', background: '#FFFFFF', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* One 3:2 frame for 1, 2 or 3 photos, so every card is the same height. */}
                <div style={{ aspectRatio: '3 / 2', overflow: 'hidden', position: 'relative', display: 'grid', gap: 3, background: '#FFFFFF',
                  gridTemplateColumns: o.n === 1 ? '1fr' : o.n === 2 ? '1fr 1fr' : '2fr 1fr', gridTemplateRows: o.n === 3 ? '1fr 1fr' : '1fr' }}>
                  {Array.from({ length: Math.min(3, o.n) }, (_, i) => (
                    <div key={i} style={{ overflow: 'hidden', minHeight: 0, gridRow: o.n === 3 && i === 0 ? 'span 2' : undefined }}>
                      <img src={`/events/${o.key}-${i + 1}.webp`} alt={o.alts[i] || o.t} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                  <span style={{ position: 'absolute', top: 12, left: 12, height: 26, padding: '0 10px', borderRadius: 8, background: 'rgba(15,13,26,.78)', color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: '.04em', display: 'inline-flex', alignItems: 'center' }}>{o.tag}</span>
                </div>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}><b style={{ fontSize: 15 }}>{o.t}</b><span style={{ fontSize: 13, lineHeight: 1.45, color: '#55526A' }}>{o.s}</span></div>
              </article>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sub('Partners')}
          <div style={{ display: 'grid', gridTemplateColumns: L.pCols, gap: 12 }}>
            {PARTNERS.map(p => (
              <div key={p.name} className="rd-lift" style={{ minHeight: 112, borderRadius: 18, border: '1px solid #E7E5EE', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, background: '#FFFFFF' }}>
                <span style={{ height: 44, display: 'flex', alignItems: 'center' }}>
                  {p.logo ? <img src={p.logo} alt="" loading="lazy" style={{ maxHeight: 44, maxWidth: 120, objectFit: 'contain', display: 'block' }} />
                    : <span style={{ width: 44, height: 44, borderRadius: 12, background: '#ECEAF2', color: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>MSME</span>}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 14 }}>{p.name}</b><span style={{ fontSize: 12, color: '#6B6880' }}>{p.role}</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.cPad, boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', overflow: 'hidden', background: '#2B2644', color: '#FFFFFF', borderRadius: 32, padding: L.cIn, display: 'grid', gridTemplateColumns: L.cCols, gap: 40 }}>
          <span aria-hidden="true" style={{ position: 'absolute', width: 520, height: 520, right: -160, top: -220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,150,255,.35) 0%, rgba(167,150,255,0) 65%)' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4B8FF' }}>Apply</span>
            <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em', textWrap: 'balance' } as import('react').CSSProperties}>Find out what your plant could save</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#DDDAE6', maxWidth: 520 }}>MSME units can apply for an energy assessment by the IIT Gandhinagar team, funded under Kotak Mahindra Bank's CSR programme.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Seventeen areas audited on site, with calibrated instruments', 'Every measure costed, with its saving and payback', 'A follow-up visit to record what was carried out'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#ECEAF2' }}><Svg d={CHECK} stroke="#86EFAC" w={2.2} />{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 6 }}>
              <a className="rd-white" href={APPLY_URL} target="_blank" rel="noopener" style={{ height: 52, padding: '0 22px', borderRadius: 14, background: '#FFFFFF', color: '#0F0D1A', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10 }}>Apply for an audit<Svg d={ARROW} size={17} stroke="currentColor" w={2.2} /></a>
              {session && <ReportButton session={session} />}
            </div>
          </div>
          <address style={{ position: 'relative', fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4B8FF' }}>Contact</span>
            <a className="rd-glass" href={CONTACT.mapUrl} target="_blank" rel="noopener" style={glass}>{ico(PIN)}{CONTACT.address}</a>
            <a className="rd-glass" href={'mailto:' + CONTACT.email} style={glass}>{ico(MAIL)}{CONTACT.email}</a>
            {CONTACT.phones.map(p => <a key={p.tel} className="rd-glass" href={'tel:' + p.tel} style={glass}>{ico(PHONE)}{p.phone}</a>)}
          </address>
        </div>
      </section>
    </div>
  );
}

export function SiteFooter({ session }: { session: Session | null }) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const asOf = new Date(data.asOf + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const link = { color: '#3A3850' };
  return (
    <footer className="rd" style={{ borderTop: '1px solid #ECEAF2', background: '#FAFAFC' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: D ? '48px 40px 32px' : T ? '40px 32px 28px' : '36px 16px 24px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: D ? 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)' : T ? 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, gridColumn: !D && !T ? 'span 2' : undefined }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM" width={34} height={34} style={{ borderRadius: 9, display: 'block', objectFit: 'contain' }} />
            <img src="/iitgn_Logo.png" alt="IIT Gandhinagar" width={34} height={34} style={{ display: 'block', objectFit: 'contain' }} />
            <b style={{ fontSize: 15, marginLeft: 4 }}>KISEM · IIT Gandhinagar</b>
          </span>
          <span style={{ fontSize: 13, lineHeight: 1.55, color: '#55526A', maxWidth: 380 }}>Energy audits for MSMEs in Gujarat, Rajasthan and Daman under the Kotak IIT Madras Save Energy Mission.</span>
        </div>
        <nav aria-label="Footer: explore" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
          <b style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6880' }}>Explore</b>
          <a className="navl" href="#impact" style={link}>Impact</a><a className="navl" href="#audits" style={link}>Audits</a><a className="navl" href="#scope" style={link}>What an audit covers</a><a className="navl" href="#instruments" style={link}>Instruments</a>
        </nav>
        <nav aria-label="Footer: programme" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
          <b style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6880' }}>Programme</b>
          <a className="navl" href="#team" style={link}>Team</a><a className="navl" href="#events" style={link}>Events</a><a className="navl" href="#contact" style={link}>Contact</a>
          <a className="navl" href={APPLY_URL} target="_blank" rel="noopener" style={link}>Apply for an audit</a>
          {session && <a className="navl" href={CONSOLE_URL} style={link}>FOX Console</a>}
          {session && <a className="navl" href={`${CONSOLE_URL}/apps/`} style={link}>Field apps</a>}
        </nav>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: D ? '18px 40px 28px' : T ? '16px 32px 24px' : '16px 16px 24px', boxSizing: 'border-box', borderTop: '1px solid #ECEAF2', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', fontSize: 13, color: '#55526A' }}>
        <span>© {new Date().getFullYear()} KISEM, IIT Gandhinagar</span>
        <span>Data as of the master data sheet, {asOf}</span>
        <a className="navl" href="#top" style={{ color: '#55526A' }}>Back to top</a>
      </div>
    </footer>
  );
}
