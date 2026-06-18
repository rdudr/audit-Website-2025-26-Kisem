import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { data, formatCrore, formatNumber, formatTonne } from '../data';

const FY_ITEMS = [
  { key: 'FY22-23', label: 'FY 2022–23', color: '#60a5fa', index: 0 },
  { key: 'FY23-24', label: 'FY 2023–24', color: '#a78bfa', index: 1 },
  { key: 'FY24-25', label: 'FY 2024–25', color: '#00e5a0', index: 2 },
  { key: 'FY25-26', label: 'FY 2025–26', color: '#f59e0b', index: 3 },
];

const CHART_COLORS = ['#60a5fa', '#a78bfa', '#00e5a0', '#f59e0b'];

export default function FourYearJourney() {
  const [activeTab, setActiveTab] = useState<'audits' | 'savings' | 'co2' | 'ecm'>('audits');

  const yearSummary = data.yearSummary;
  const years = FY_ITEMS.map(f => f.key);
  const labels = FY_ITEMS.map(f => f.label);

  const getChartOption = () => {
    const baseOption = {
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Inter', color: '#0f172a' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: 'rgba(15,23,42,0.12)',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 13 },
        axisPointer: { type: 'cross', crossStyle: { color: 'rgba(15,23,42,0.1)' } },
      },
      legend: {
        textStyle: { color: 'rgba(15,23,42,0.7)', fontSize: 12 },
        top: 0,
      },
      grid: { left: '8%', right: '4%', bottom: '8%', top: '12%', containLabel: true },
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
        axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11 },
      },
    };

    if (activeTab === 'audits') {
      return {
        ...baseOption,
        legend: { ...baseOption.legend, data: ['Detailed Audits', 'ECMs Recommended'] },
        series: [
          {
            name: 'Detailed Audits',
            type: 'bar',
            barMaxWidth: 50,
            data: years.map(y => yearSummary[y]?.auditCount || 0),
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#00e5a0' },
                  { offset: 1, color: '#0066ff40' },
                ],
              },
            },
            emphasis: { focus: 'series' },
            label: { show: true, position: 'top', color: '#0f172a', fontSize: 12, fontWeight: 700 },
          },
          {
            name: 'ECMs Recommended',
            type: 'line',
            data: years.map(y => yearSummary[y]?.totalEcmRecommended || 0),
            smooth: true,
            lineStyle: { color: '#f59e0b', width: 2 },
            itemStyle: { color: '#f59e0b' },
            areaStyle: { color: 'rgba(245,158,11,0.08)' },
            yAxisIndex: 0,
          },
        ],
      };
    }

    if (activeTab === 'savings') {
      const recs = years.map(y => Number(((yearSummary[y]?.totalSavingsInr || 0) / 1e7).toFixed(2)));
      const acts = years.map(y => Number(((yearSummary[y]?.actualSavingsInr || 0) / 1e7).toFixed(2)));
      let cumulative = 0;
      const cum = recs.map(v => {
        cumulative += v;
        return Number(cumulative.toFixed(2));
      });

      return {
        ...baseOption,
        legend: { ...baseOption.legend, data: ['Recommended (Cr)', 'Implemented (Cr)', 'Cumulative (Cr)'] },
        series: [
          {
            name: 'Recommended (Cr)',
            type: 'bar',
            barMaxWidth: 50,
            data: recs,
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#00e5a0' }, { offset: 1, color: '#00e5a040' }] },
            },
          },
          {
            name: 'Implemented (Cr)',
            type: 'bar',
            barMaxWidth: 50,
            data: acts,
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#60a5fa40' }] },
            },
          },
          {
            name: 'Cumulative (Cr)',
            type: 'line',
            data: cum,
            smooth: true,
            lineStyle: { color: '#f5b941', width: 2.5 },
            itemStyle: { color: '#f5b941' },
            areaStyle: { color: 'rgba(245,185,65,0.07)' },
          },
        ],
      };
    }

    if (activeTab === 'co2') {
      return {
        ...baseOption,
        legend: { ...baseOption.legend, data: ['CO₂ Reduction (T)', 'Actual Achieved (T)'] },
        series: [
          {
            name: 'CO₂ Reduction (T)',
            type: 'bar',
            barMaxWidth: 50,
            data: years.map(y => Math.round(yearSummary[y]?.totalCo2ReductionTonnes || 0)),
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#86efac' }, { offset: 1, color: '#86efac40' }] },
            },
            label: { show: true, position: 'top', color: '#0f172a', fontSize: 11, formatter: (p: { value: number }) => `${(p.value / 1000).toFixed(1)}K` },
          },
          {
            name: 'Actual Achieved (T)',
            type: 'bar',
            barMaxWidth: 50,
            data: years.map(y => Math.round(yearSummary[y]?.actualCo2Tonnes || 0)),
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#34d399' }, { offset: 1, color: '#34d39940' }] },
            },
          },
        ],
      };
    }

    // ECM implementation
    return {
      ...baseOption,
      legend: { ...baseOption.legend, data: ['ECMs Recommended', 'ECMs Implemented', 'Implementation %'] },
      yAxis: [
        { type: 'value', splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } }, axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11 } },
        { type: 'value', max: 100, axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11, formatter: '{value}%' }, splitLine: { show: false } },
      ],
      series: [
        {
          name: 'ECMs Recommended',
          type: 'bar',
          barMaxWidth: 50,
          data: years.map(y => yearSummary[y]?.totalEcmRecommended || 0),
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#a78bfa' }, { offset: 1, color: '#a78bfa40' }] },
          },
        },
        {
          name: 'ECMs Implemented',
          type: 'bar',
          barMaxWidth: 50,
          data: years.map(y => yearSummary[y]?.totalEcmImplemented || 0),
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#f59e0b40' }] },
          },
        },
        {
          name: 'Implementation %',
          type: 'line',
          yAxisIndex: 1,
          data: years.map(y => yearSummary[y]?.implementationPct || 0),
          smooth: true,
          lineStyle: { color: '#00e5a0', width: 2.5 },
          itemStyle: { color: '#00e5a0', borderWidth: 2 },
          areaStyle: { color: 'rgba(0,229,160,0.06)' },
        },
      ],
    };
  };

  const tabs = [
    { key: 'audits', label: 'Audits & ECMs' },
    { key: 'savings', label: 'Energy Savings' },
    { key: 'co2', label: 'CO₂ Reduction' },
    { key: 'ecm', label: 'Implementation' },
  ] as const;

  return (
    <section id="journey" className="section-padding" style={{ position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
      <div className="glow-orb" style={{
        width: 500,
        height: 500,
        background: 'rgba(0, 102, 255, 0.06)',
        top: '30%',
        right: '-10%',
      }} />

      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Four Year Journey</div>
          <h2 className="section-title">
            A Decade of Impact,{' '}
            <span className="gradient-text">Year by Year</span>
          </h2>
          <p className="section-subtitle">
            Tracking KISEM's evolution from 6 pilot audits in FY22-23 to 60 comprehensive 
            assessments, with growing impact across all metrics.
          </p>
        </div>

        {/* Year cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {FY_ITEMS.map((fy, i) => {
            const ys = yearSummary[fy.key];
            return (
              <motion.div
                key={fy.key}
                className="kpi-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ borderColor: `${fy.color}20` }}
              >
                <div style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: fy.color,
                  marginBottom: '0.75rem',
                }}>
                  {fy.label}
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: fy.color, letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                  {ys?.auditCount || 0}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.6)', marginBottom: '1rem' }}>Detailed Audits</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f4ff' }}>
                  {formatCrore(ys?.totalSavingsInr || 0)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)' }}>Savings Recommended</div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart section */}
        <div className="chart-container">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`filter-chip ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <ReactECharts
            option={getChartOption()}
            style={{ height: 380 }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </section>
  );
}
