import { motion } from 'framer-motion';
import { data, formatCrore, formatTonne, formatNumber } from '../data';

export default function AssessmentFunnel() {
  const gt = data.grandTotals;

  const steps = [
    {
      icon: '🗺️',
      value: gt.totalClusters,
      label: 'Industrial Clusters',
      desc: 'Identified and mapped across Gujarat, Rajasthan & Daman',
      color: '#a78bfa',
      width: '100%',
    },
    {
      icon: '🔍',
      value: gt.totalWalkthrough,
      label: 'Walkthrough Assessments',
      desc: 'Rapid screening across identified clusters',
      color: '#60a5fa',
      width: '75%',
    },
    {
      icon: '📋',
      value: gt.totalAudits,
      label: 'Detailed Energy Audits',
      desc: 'In-depth technical audits with ECM recommendations',
      color: '#00e5a0',
      width: '50%',
    },
    {
      icon: '💳',
      value: gt.totalPaidAudits,
      label: 'Investment Grade Audits',
      desc: 'Paid detailed audits for bankable project reports',
      color: '#f59e0b',
      width: '25%',
    },
  ];

  return (
    <section id="funnel" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: Text */}
          <div>
            <div className="section-label">Assessment Funnel</div>
            <h2 className="section-title">
              From Cluster to{' '}
              <span className="gradient-text">Certified Audit</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              KISEM's structured three-stage methodology ensures that every rupee of CSR 
              investment reaches the most impactful industrial facilities.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${step.color}20`,
                    borderRadius: 16,
                  }}
                >
                  <div style={{
                    minWidth: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.375rem',
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.625rem', fontWeight: 800, color: step.color, letterSpacing: '-0.04em' }}>
                        {step.value}
                      </span>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4ff' }}>
                        {step.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.5)', lineHeight: 1.5 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual funnel */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            {steps.map((step, i) => (
              <div key={step.label} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6, ease: 'easeOut' }}
                  style={{
                    width: step.width,
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `1px solid ${step.color}40`,
                    borderRadius: 16,
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: step.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {step.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(240,244,255,0.6)', marginTop: '0.2rem' }}>
                      {step.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>{step.icon}</div>
                </motion.div>

                {/* Arrow */}
                {i < steps.length - 1 && (
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: `16px solid ${step.color}30`,
                    margin: '0.25rem 0',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
