import { motion } from 'framer-motion';
import { data, formatCrore, formatKwh, formatTonne, formatNumber } from '../data';

export default function BaselineEnergy() {
  const gt = data.grandTotals;

  const stats = [
    {
      icon: '⚡',
      label: 'Total Electricity Assessed',
      value: formatKwh(gt.totalElecConsumptionKwh),
      subValue: `${(gt.totalElecConsumptionKwh / 1e9).toFixed(2)} GWh`,
      color: '#facc15',
      desc: 'Annual electricity consumption of all assessed plants',
    },
    {
      icon: '💰',
      label: 'Total Energy Bill',
      value: formatCrore(gt.totalEnergyCostInr),
      subValue: 'Annual energy expenditure',
      color: '#00e5a0',
      desc: 'Combined electricity and fuel costs across all plants',
    },
    {
      icon: '🌍',
      label: 'Total CO₂ Footprint',
      value: formatTonne(gt.totalExistingCo2Tonnes),
      subValue: `${(gt.totalExistingCo2Tonnes / 1000).toFixed(0)}K tonnes`,
      color: '#a78bfa',
      desc: 'Pre-audit baseline CO₂ emissions of all assessed facilities',
    },
    {
      icon: '🏭',
      label: 'Total Plants Assessed',
      value: formatNumber(gt.totalAudits),
      subValue: `+ ${gt.totalPaidAudits} paid audits`,
      color: '#60a5fa',
      desc: 'Industrial facilities across Gujarat, Rajasthan and Daman',
    },
  ];

  return (
    <section id="baseline" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Baseline Energy</div>
          <h2 className="section-title">
            Baseline Energy{' '}
            <span className="gradient-text">Footprint</span>
          </h2>
          <p className="section-subtitle">
            Understanding the pre-audit energy baseline is the foundation of every 
            KISEM intervention. Here's the scale of what we assessed.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="kpi-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ borderColor: `${stat.color}15` }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${stat.color}12`,
                border: `1px solid ${stat.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.625rem',
                marginBottom: '1.25rem',
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 800, color: stat.color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.375rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4ff', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)', lineHeight: 1.5 }}>
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
