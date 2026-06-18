import { useState } from 'react';
import { motion } from 'framer-motion';
import { SCOPE_ITEMS } from '../data';

export default function ScopeOfAssessment() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="scope" className="section-padding">
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Scope of Assessment</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            17 Areas of{' '}
            <span className="gradient-text">Energy Excellence</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Every KISEM audit covers all major energy consuming systems and utilities 
            within the industrial plant.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {SCOPE_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? 'rgba(0,229,160,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${hovered === i ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16,
                padding: '1.25rem',
                cursor: 'default',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '1.875rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4ff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(240,244,255,0.5)',
                lineHeight: 1.5,
                maxHeight: hovered === i ? 100 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, opacity 0.3s ease',
                opacity: hovered === i ? 1 : 0,
              }}>
                {item.desc}
              </div>

              {/* Number badge */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(0,229,160,0.1)',
                border: '1px solid rgba(0,229,160,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#00e5a0',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
