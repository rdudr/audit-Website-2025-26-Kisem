import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { data, formatCrore, formatTonne, formatRoi, getSectorColor } from '../data';

export default function RoiScatter() {
  const audits = data.audits.filter(a => a.investmentInr > 0 && a.annualSavingsInr > 0);

  const scatterOption = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter', color: '#0f172a' },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(15,23,42,0.12)',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 12 },
      formatter: (p: { data: [number, number, number, string, string, string] }) => {
        const [inv, sav, roi, company, sector, fy] = p.data;
        return `
          <div style="padding:4px 0">
            <div style="font-weight:700;margin-bottom:6px;max-width:220px;color:#0f172a">${company}</div>
            <div style="color:rgba(15,23,42,0.7);font-size:11px;margin-bottom:8px">${sector} · ${fy}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div><span style="color:rgba(15,23,42,0.6)">Investment:</span><br/><b style="color:#0f172a">₹${(inv/100000).toFixed(1)}L</b></div>
              <div><span style="color:rgba(15,23,42,0.6)">Annual Savings:</span><br/><b style="color:#00e5a0">₹${(sav/100000).toFixed(1)}L</b></div>
              <div><span style="color:rgba(15,23,42,0.6)">ROI:</span><br/><b style="color:#f59e0b">${(roi/12).toFixed(1)} yr</b></div>
            </div>
          </div>
        `;
      },
    },
    grid: { left: '8%', right: '5%', bottom: '10%', top: '8%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Investment (₹ Lakh)',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: { color: 'rgba(15,23,42,0.6)', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11, formatter: (v: number) => `${(v/100000).toFixed(0)}L` },
    },
    yAxis: {
      type: 'value',
      name: 'Annual Savings (₹ Lakh)',
      nameLocation: 'middle',
      nameGap: 55,
      nameTextStyle: { color: 'rgba(15,23,42,0.6)', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(15,23,42,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(15,23,42,0.6)', fontSize: 11, formatter: (v: number) => `${(v/100000).toFixed(0)}L` },
    },
    series: [{
      type: 'scatter',
      data: audits.map(a => [
        a.investmentInr,
        a.annualSavingsInr,
        Math.max(a.roiMonths, 1),
        a.companyName,
        a.sector,
        a.fy,
      ]),
      symbolSize: (data: [number, number, number]) => {
        // Size by ROI (smaller ROI = better = larger bubble)
        const roi = data[2];
        return Math.max(10, Math.min(50, 600 / roi));
      },
      itemStyle: {
        color: (p: { data: [number, number, number, string, string, string] }) => {
          const sector = p.data[4];
          return getSectorColor(sector) + 'cc';
        },
        borderColor: 'rgba(15,23,42,0.15)',
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          borderColor: '#0f172a',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(0,229,160,0.4)',
        },
      },
    }],
  };

  // Top investment/savings projects
  const topSavings = [...audits].sort((a, b) => b.annualSavingsInr - a.annualSavingsInr).slice(0, 5);

  return (
    <section id="roi" className="section-padding">
      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">ROI & Business Case</div>
          <h2 className="section-title">
            Investment vs Savings{' '}
            <span className="gradient-text">Analysis</span>
          </h2>
          <p className="section-subtitle">
            Every bubble represents an audited plant. Bubble size indicates ROI quality — 
            larger means faster payback.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Scatter plot */}
          <div className="chart-container">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.5)' }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#00e5a0', marginRight: 6 }} />
                Bubble Size = ROI Quality
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.5)' }}>
                Colored by sector · Click to inspect
              </div>
            </div>
            <ReactECharts
              option={scatterOption}
              style={{ height: 460 }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

          {/* Top 5 savings */}
          <div>
            <div className="chart-container">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(240,244,255,0.7)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
                🏆 Top 5 by Savings
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {topSavings.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f4ff', flex: 1, marginRight: 8 }}>
                        {project.companyName.slice(0, 28)}{project.companyName.length > 28 ? '...' : ''}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00e5a0', whiteSpace: 'nowrap' }}>
                        {formatCrore(project.annualSavingsInr, 1)}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(project.annualSavingsInr / topSavings[0].annualSavingsInr) * 100}%` }} />
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(240,244,255,0.4)', marginTop: '0.25rem' }}>
                      {project.sector} · {project.district}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary stats */}
            <div className="chart-container" style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(240,244,255,0.7)', marginBottom: '1rem' }}>
                Overall ROI Statistics
              </h4>
              {[
                { label: 'Avg. Recommended ROI', value: formatRoi(data.audits.reduce((s, a) => s + a.roiMonths, 0) / data.audits.filter(a => a.roiMonths > 0).length) },
                { label: 'Best ROI Project', value: formatRoi(Math.min(...data.audits.filter(a => a.roiMonths > 0).map(a => a.roiMonths))) },
                { label: 'Total Investment', value: formatCrore(data.grandTotals.totalInvestmentInr) },
                { label: 'Return Multiple', value: `${(data.grandTotals.totalSavingsInr / data.grandTotals.totalInvestmentInr).toFixed(1)}x/yr` },
              ].map(row => (
                <div key={row.label} className="stat-row">
                  <span className="label">{row.label}</span>
                  <span className="value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
