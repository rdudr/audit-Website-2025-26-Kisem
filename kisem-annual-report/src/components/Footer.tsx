import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#020818',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 0 2rem',
    }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 8 }} />
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff' }}>KISEM</div>
                <div style={{ fontSize: '0.625rem', color: 'rgba(240,244,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Kotak IIT Madras Save Energy Mission</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.5)', lineHeight: 1.7, maxWidth: 340 }}>
              Executed by IIT Gandhinagar in collaboration with IIT Madras / IEAC. 
              A CSR initiative of Kotak Mahindra Bank dedicated to transforming MSME energy efficiency across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(240,244,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Navigate
            </h4>
            {[
              { label: 'Impact Numbers', href: '#kpi' },
              { label: 'Audit Map', href: '#map' },
              { label: 'Four Year Journey', href: '#journey' },
              { label: 'Energy Analysis', href: '#analysis' },
              { label: 'Top Projects', href: '#projects' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(240,244,255,0.6)', marginBottom: '0.625rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00e5a0'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.6)'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(240,244,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              More
            </h4>
            {[
              { label: 'Scope of Assessment', href: '#scope' },
              { label: 'Industry Sectors', href: '#sectors' },
              { label: 'Instruments', href: '#instruments' },
              { label: 'Partners', href: '#partners' },
              { label: 'Contact', href: '#contact' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(240,244,255,0.6)', marginBottom: '0.625rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00e5a0'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.6)'}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Institutions */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(240,244,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Institutions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <img src="/iitgn_Logo.png" alt="IIT Gandhinagar" style={{ height: 28, objectFit: 'contain', objectPosition: 'left' }} />
              <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM IIT Madras" style={{ height: 28, objectFit: 'contain', objectPosition: 'left', borderRadius: 4 }} />
              <img src="/download.png" alt="Kotak" style={{ height: 22, objectFit: 'contain', objectPosition: 'left' }} />
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '2rem' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.35)' }}>
            © {currentYear} KISEM – IIT Gandhinagar. All rights reserved. | Annual Report FY 2025-26
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use', 'RTI'].map(link => (
              <a
                key={link}
                href="#"
                style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.35)', textDecoration: 'none' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.7)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.35)'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
