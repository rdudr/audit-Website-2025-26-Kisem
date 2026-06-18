import { motion } from 'framer-motion';
import { PARTNERS } from '../data';

export default function Partnerships() {
  return (
    <section id="partners" className="section-padding">
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Partnerships</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Powered by{' '}
            <span className="gradient-text">Premier Institutions</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            KISEM brings together India's leading financial institution, technical universities, 
            and development organizations to drive industrial energy transformation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '2rem',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.07)',
                borderColor: 'rgba(255,255,255,0.15)',
                y: -4,
              }}
            >
              {/* Color accent top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${partner.color}, ${partner.color}00)`,
              }} />

              {/* Logo/Icon */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: partner.logo ? 'white' : `${partner.color}15`,
                border: partner.logo ? 'none' : `1px solid ${partner.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                overflow: 'hidden',
              }}>
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                  />
                ) : (
                  <span style={{ fontSize: '1.75rem' }}>
                    {partner.name === 'GEDA' ? '⚡' :
                     partner.name === 'WRI India' ? '🌍' :
                     partner.name === 'Ministry of MSME' ? '🏛️' : '🤝'}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{
                display: 'inline-flex',
                padding: '0.2rem 0.625rem',
                background: `${partner.color}15`,
                border: `1px solid ${partner.color}30`,
                borderRadius: 100,
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: partner.color,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                {partner.role}
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.625rem', letterSpacing: '-0.01em' }}>
                {partner.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.55)', lineHeight: 1.6 }}>
                {partner.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
