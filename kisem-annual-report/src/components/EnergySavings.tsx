import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { data, formatCrore, formatNumber } from '../data';

export default function EnergySavings() {
  const yearSummary = data.yearSummary;
  const years = Array.from(new Set(data.audits.map(a => a.fy))).sort();
  const labels = years.map(y => {
    const match = y.match(/FY(\d{2})-(\d{2})/);
    return match ? `FY 20${match[1]}-${match[2]}` : y;
  });

  // Calculate electrical vs thermal from audit data
  const electricalRec = years.map(y =>
    data.audits.filter(a => a.fy === y).reduce((s, a) => s + a.annualElecSavingsKwh, 0)
  );
  
  // Approximate thermal savings (energy savings TOE - electrical savings TOE)
  const totalSavingsToe = years.map(y =>
    data.audits.filter(a => a.fy === y).reduce((s, a) => s + (a.annualEnergySavingsToe ?? 0), 0)
  );

  const elecSavingsKwh = electricalRec;
  const totalSavingsInrRec = years.map(y => yearSummary[y]?.totalSavingsInr || 0);
  const totalSavingsInrAct = years.map(y => yearSummary[y]?.actualSavingsInr || 0);

  const lineChartOption = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter', color: '#0f172a' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(15,23,42,0.12)',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 13 },
    },
    legend: {
      textStyle: { color: 'rgba(15,23,42,0.7)', fontSize: 12 },
      top: 0,
    },
    grid: { left: '8%', right: '4%', bottom: '8%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(15,23,42,0.7)', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(15,23,42,0.5)', fontSize: 11 },
    },
    series: [
      {
        name: 'Recommended (₹Cr)',
        type: 'line',
        data: totalSavingsInrRec.map(v => Number((v / 1e7).toFixed(2))),
        smooth: true,
        lineStyle: { color: '#00e5a0', width: 3 },
        itemStyle: { color: '#00e5a0', borderWidth: 2, borderColor: '#ffffff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(0,229,160,0.25)' }, { offset: 1, color: 'rgba(0,229,160,0)' }],
          },
        },
        symbol: 'circle',
        symbolSize: 8,
      },
      {
        name: 'Implemented (₹Cr)',
        type: 'line',
        data: totalSavingsInrAct.map(v => Number((v / 1e7).toFixed(2))),
        smooth: true,
        lineStyle: { color: '#60a5fa', width: 2.5, type: 'dashed' },
        itemStyle: { color: '#60a5fa', borderWidth: 2, borderColor: '#ffffff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(96,165,250,0.15)' }, { offset: 1, color: 'rgba(96,165,250,0)' }],
          },
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };

  const electricalChartOption = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter', color: '#0f172a' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(15,23,42,0.12)',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 13 },
    },
    legend: {
      textStyle: { color: 'rgba(15,23,42,0.7)', fontSize: 12 },
      top: 0,
    },
    grid: { left: '8%', right: '4%', bottom: '8%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(15,23,42,0.7)', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(15,23,42,0.5)', fontSize: 11 },
    },
    series: [
      {
        name: 'Elec Savings (kWh)',
        type: 'bar',
        barMaxWidth: 52,
        data: elecSavingsKwh.map((v, i) => ({
          value: v,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: '#facc15' }, { offset: 1, color: '#facc1540' }],
            },
          },
        })),
        label: { show: true, position: 'top', color: '#0f172a', fontSize: 10, formatter: (p: { value: number }) => `${(p.value / 1e6).toFixed(1)}M` },
      },
      {
        name: 'Total Energy Savings (ToE)',
        type: 'line',
        data: totalSavingsToe,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        areaStyle: { color: 'rgba(245,158,11,0.06)' },
      },
    ],
  };

  // Summary stats
  const totalElecSavings = data.audits.reduce((s, a) => s + a.annualElecSavingsKwh, 0);
  const totalEnergySavingsToe = data.audits.reduce((s, a) => s + (a.annualEnergySavingsToe ?? 0), 0);

  return (
    <section id="analysis" className="section-padding">
      <div className="glow-orb" style={{
        width: 500,
        height: 500,
        background: 'rgba(0, 229, 160, 0.05)',
        top: '20%',
        left: '-5%',
      }} />

      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Energy Analysis</div>
          <h2 className="section-title">
            Energy Savings{' '}
            <span className="gradient-text">Deep Dive</span>
          </h2>
          <p className="section-subtitle">
            Electrical and thermal savings across all four years, showing growth trajectory
            and implementation progress.
          </p>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Electrical Savings', value: `${(totalElecSavings / 1e6).toFixed(1)} MWh`, color: '#facc15', icon: '⚡' },
            { label: 'Total Energy Savings', value: `${(totalEnergySavingsToe / 1000).toFixed(1)} KToE`, color: '#00e5a0', icon: '🔋' },
            { label: 'Savings Recommended', value: formatCrore(data.grandTotals.totalSavingsInr), color: '#60a5fa', icon: '📋' },
            { label: 'Savings Implemented', value: formatCrore(data.grandTotals.totalActualSavingsInr), color: '#34d399', icon: '✅' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="kpi-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.625rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(240,244,255,0.6)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="chart-container">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(240,244,255,0.7)', marginBottom: '1rem' }}>
              Annual Cost Savings Trend (₹ Crore)
            </h4>
            <ReactECharts option={lineChartOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} />
          </div>
          <div className="chart-container">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(240,244,255,0.7)', marginBottom: '1rem' }}>
              Electrical Savings per Year
            </h4>
            <ReactECharts option={electricalChartOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
