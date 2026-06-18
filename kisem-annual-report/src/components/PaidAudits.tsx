import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { data, formatCrore, formatTonne, getSectorColor } from '../data';

export default function PaidAudits() {
  const paidAudits = data.paidAudits;

  const totalSavings = paidAudits.reduce((s, a) => s + a.annualSavingsInr, 0);
  const totalCo2 = paidAudits.reduce((s, a) => s + a.annualCo2ReductionTonnes, 0);
  const totalInvestment = paidAudits.reduce((s, a) => s + a.investmentInr, 0);

  const comparisonOption = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter', color: '#0f172a' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(15,23,42,0.12)',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 12 },
    },
    grid: { left: '5%', right: '4%', bottom: '10%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: paidAudits.map(a => a.companyName.slice(0, 20) + '...'),
      axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 10, rotate: 20, interval: 0 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11, formatter: (v: number) => `₹${(v / 100000).toFixed(0)}L` },
    },
    series: [
      {
        name: 'Annual Savings (₹)',
        type: 'bar',
        barMaxWidth: 52,
        data: paidAudits.map(a => ({
          value: a.annualSavingsInr,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#f59e0b40' }] },
          },
        })),
        label: { show: true, position: 'top', color: '#0f172a', fontSize: 10, formatter: (p: { value: number }) => formatCrore(p.value, 1) },
      },
    ],
  };

  return (
    <section id="paid-audits" className="section-padding">
      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Paid Investment Grade Audits</div>
          <h2 className="section-title">
            Premium Paid{' '}
            <span className="gradient-text-gold">Audit Programme</span>
          </h2>
          <p className="section-subtitle">
            {paidAudits.length} investment-grade energy audits for textile units under the WRI Surat Textile 
            Benchmarking Programme, providing bankable project reports.
          </p>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { label: 'Paid Audits', value: `${paidAudits.length}`, icon: '📋', color: '#f59e0b' },
            { label: 'Combined Savings', value: formatCrore(totalSavings), icon: '💰', color: '#00e5a0' },
            { label: 'CO₂ Reduction', value: formatTonne(totalCo2), icon: '🌿', color: '#86efac' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="kpi-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(240,244,255,0.6)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Audit cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {paidAudits.map((audit, i) => (
            <motion.div
              key={audit.id}
              className="kpi-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ borderColor: 'rgba(245,185,65,0.15)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.2rem 0.625rem',
                  background: 'rgba(245,159,11,0.15)',
                  border: '1px solid rgba(245,159,11,0.3)',
                  borderRadius: 100,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#f59e0b',
                }}>
                  🧵 Textile · WRI
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)' }}>{audit.auditNumber}</span>
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {audit.companyName}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)', marginBottom: '1rem' }}>
                📍 {audit.district}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#00e5a0' }}>{formatCrore(audit.annualSavingsInr, 1)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.45)' }}>Annual Savings</div>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac' }}>{formatTonne(audit.annualCo2ReductionTonnes)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.45)' }}>CO₂ Reduction</div>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa' }}>{audit.ecmRecommended}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.45)' }}>ECMs Recommended</div>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b' }}>{audit.auditDays} days</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.45)' }}>Audit Duration</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(240,244,255,0.7)', marginBottom: '1rem' }}>
            Savings Comparison – Paid Audit Units
          </h4>
          <ReactECharts option={comparisonOption} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />
        </div>
      </div>
    </section>
  );
}
