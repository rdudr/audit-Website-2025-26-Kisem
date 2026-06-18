import { useState } from 'react';
import { motion } from 'framer-motion';
import { INSTRUMENTS } from '../data';

export default function Instruments() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="instruments" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="section-container">
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-label">Instruments & Capabilities</div>
          <h2 className="section-title">
            World-Class{' '}
            <span className="gradient-text">Measurement Arsenal</span>
          </h2>
          <p className="section-subtitle">
            KISEM deploys professional-grade instruments for accurate, bankable energy 
            audit data collection across all utility systems.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {INSTRUMENTS.map((inst, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hovered === i ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                cursor: 'default',
                transition: 'all 0.3s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === i ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(0,229,160,0.15), rgba(0,102,255,0.1))',
                border: '1px solid rgba(0,229,160,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.875rem',
                marginBottom: '1.25rem',
              }}>
                {inst.img}
              </div>

              {/* Content */}
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>
                {inst.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#00e5a0', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                {inst.brand}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.55)', lineHeight: 1.6 }}>
                {inst.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
