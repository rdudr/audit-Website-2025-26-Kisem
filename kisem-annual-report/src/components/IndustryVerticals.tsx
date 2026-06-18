import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { data, formatCrore, getSectorColor } from '../data';

export default function IndustryVerticals() {
  const [activeChart, setActiveChart] = useState<'count' | 'savings' | 'co2' | 'investment'>('count');

  const sectorData = data.sectorBreakdown.slice(0, 12); // top 12 sectors
  const labels = sectorData.map(s => s.sector);
  const colors = labels.map(getSectorColor);

  const getBarOption = () => {
    const valueMap = {
      count: {
        name: 'Audit Count',
        data: sectorData.map(s => s.count),
        unit: '',
        formatter: (v: number) => `${v} audits`,
      },
      savings: {
        name: 'Total Savings (₹Cr)',
        data: sectorData.map(s => Number((s.totalSavingsInr / 1e7).toFixed(2))),
        unit: '₹Cr',
        formatter: (v: number) => `₹${v.toFixed(2)} Cr`,
      },
      co2: {
        name: 'CO₂ Reduction (T)',
        data: sectorData.map(s => Math.round(s.totalCo2Reduction)),
        unit: 'T',
        formatter: (v: number) => `${v.toLocaleString()} T`,
      },
      investment: {
        name: 'Investment (₹Cr)',
        data: sectorData.map(s => Number((s.totalInvestment / 1e7).toFixed(2))),
        unit: '₹Cr',
        formatter: (v: number) => `₹${v.toFixed(2)} Cr`,
      },
    }[activeChart];

    return {
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Inter', color: '#0f172a' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: 'rgba(15,23,42,0.12)',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 13 },
        formatter: (params: Array<{ name: string; value: number }>) => {
          const p = params[0];
          return `<div style="padding:4px 0"><b>${p.name}</b><br/>${valueMap.formatter(p.value)}</div>`;
        },
      },
      grid: { left: '2%', right: '4%', bottom: '15%', top: '4%', containLabel: true },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(15,23,42,0.7)',
          fontSize: 11,
          rotate: 30,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
        axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11 },
      },
      series: [{
        type: 'bar',
        barMaxWidth: 48,
        data: valueMap.data.map((v, i) => ({
          value: v,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: colors[i] },
                { offset: 1, color: colors[i] + '30' },
              ],
            },
          },
        })),
        emphasis: {
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,229,160,0.3)' },
        },
      }],
    };
  };

  const getPieOption = () => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter', color: '#0f172a' },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(15,23,42,0.12)',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 12 },
      formatter: (p: { name: string; value: number; percent: number }) =>
        `<b>${p.name}</b><br/>${p.value} audits (${p.percent.toFixed(1)}%)`,
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      textStyle: { color: 'rgba(15, 23, 42, 0.7)', fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      data: sectorData.map((s, i) => ({
        name: s.sector,
        value: s.count,
        itemStyle: { color: colors[i], borderColor: '#ffffff', borderWidth: 2 },
      })),
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 700, color: '#0f172a' },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.15)' },
      },
    }],
  });

  const tabs = [
    { key: 'count', label: 'Audit Distribution' },
    { key: 'savings', label: 'Savings by Sector' },
    { key: 'co2', label: 'CO₂ by Sector' },
    { key: 'investment', label: 'Investment' },
  ] as const;

  return (
    <section id="sectors" className="section-padding">
      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Industry Verticals</div>
          <h2 className="section-title">
            Sector-wise{' '}
            <span className="gradient-text">Impact Analysis</span>
          </h2>
          <p className="section-subtitle">
            From cold chains to textiles, chemical plants to food processing — 
            KISEM covers the full spectrum of Gujarat's industrial economy.
          </p>
        </div>

        {/* Sector Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginBottom: '3rem',
        }}>
          {sectorData.map((sector, i) => (
            <motion.div
              key={sector.sector}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${colors[i]}20`,
                borderRadius: 16,
                padding: '1rem',
                textAlign: 'center',
                cursor: 'default',
                transition: 'all 0.3s ease',
              }}
              whileHover={{
                background: `${colors[i]}10`,
                borderColor: `${colors[i]}40`,
                y: -4,
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                {sector.sector === 'Cold Storage' ? '❄️' :
                 sector.sector === 'Textile' ? '🧵' :
                 sector.sector === 'Chemical' ? '⚗️' :
                 sector.sector === 'CETP' ? '💧' :
                 sector.sector === 'Sea Food' ? '🐟' :
                 sector.sector === 'Paper' ? '📄' :
                 sector.sector === 'Pharma' ? '💊' :
                 sector.sector === 'Engineering' ? '⚙️' :
                 sector.sector === 'Ceramic' ? '🏺' :
                 sector.sector === 'Sugar' ? '🍬' :
                 sector.sector === 'Metal' ? '🔩' :
                 sector.sector === 'Solar' ? '☀️' : '🏭'}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: colors[i], letterSpacing: '-0.03em' }}>
                {sector.count}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.6)', marginTop: '0.2rem' }}>
                {sector.sector}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,255,0.4)', marginTop: '0.2rem' }}>
                {formatCrore(sector.totalSavingsInr)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Bar chart */}
          <div className="chart-container">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChart(tab.key)}
                  className={`filter-chip ${activeChart === tab.key ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <ReactECharts
              option={getBarOption()}
              style={{ height: 340 }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

          {/* Pie chart */}
          <div className="chart-container">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(240,244,255,0.7)', marginBottom: '1rem' }}>
              Audit Distribution by Sector
            </h4>
            <ReactECharts
              option={getPieOption()}
              style={{ height: 340 }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
