import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { data, formatCrore, formatNumber, formatTonne } from '../data';

interface KpiItem {
  label: string;
  value: number;
  unit: string;
  format: (v: number) => string;
  icon: string;
  color: string;
  desc: string;
}

const { grandTotals } = data;

const KPI_ITEMS: KpiItem[] = [
  {
    label: 'Walkthrough Assessments',
    value: grandTotals.totalWalkthrough,
    unit: '',
    format: v => formatNumber(v),
    icon: '🔍',
    color: '#00e5a0',
    desc: 'Plants screened across 37 industrial clusters',
  },
  {
    label: 'Detailed Audits',
    value: grandTotals.totalAudits,
    unit: '',
    format: v => formatNumber(v),
    icon: '📋',
    color: '#60a5fa',
    desc: 'In-depth energy audits completed over 4 years',
  },
  {
    label: 'Industrial Clusters',
    value: grandTotals.totalClusters,
    unit: '',
    format: v => formatNumber(v),
    icon: '🏭',
    color: '#f59e0b',
    desc: 'Distinct industrial clusters covered across states',
  },
  {
    label: 'Savings Recommended',
    value: grandTotals.totalSavingsInr,
    unit: 'INR',
    format: v => formatCrore(v),
    icon: '💰',
    color: '#00e5a0',
    desc: 'Annual energy cost savings identified',
  },
  {
    label: 'Savings Implemented',
    value: grandTotals.totalActualSavingsInr,
    unit: 'INR',
    format: v => formatCrore(v),
    icon: '✅',
    color: '#34d399',
    desc: 'Actual savings achieved through implementation',
  },
  {
    label: 'CO₂ Reduction Potential',
    value: grandTotals.totalCo2ReductionTonnes,
    unit: 'T',
    format: v => formatTonne(v),
    icon: '🌿',
    color: '#a78bfa',
    desc: 'Annual CO₂ emission reduction recommended',
  },
  {
    label: 'CO₂ Achieved',
    value: grandTotals.totalActualCo2Tonnes,
    unit: 'T',
    format: v => formatTonne(v),
    icon: '🌱',
    color: '#86efac',
    desc: 'Actual CO₂ reduction from implementations',
  },
  {
    label: 'ECMs Recommended',
    value: grandTotals.totalEcmRecommended,
    unit: '',
    format: v => formatNumber(v),
    icon: '⚙️',
    color: '#fb923c',
    desc: 'Energy Conservation Measures proposed',
  },
  {
    label: 'ECMs Implemented',
    value: grandTotals.totalEcmImplemented,
    unit: '',
    format: v => formatNumber(v),
    icon: '🔧',
    color: '#fbbf24',
    desc: 'Measures actually implemented by plants',
  },
  {
    label: 'Investment Mobilized',
    value: grandTotals.totalInvestmentInr,
    unit: 'INR',
    format: v => formatCrore(v),
    icon: '📈',
    color: '#06b6d4',
    desc: 'Proposed investment for all ECMs',
  },
  {
    label: 'Energy Assessed',
    value: grandTotals.totalElecConsumptionKwh,
    unit: 'kWh',
    format: v => {
      const gwh = v / 1e9;
      return `${gwh.toFixed(2)} GWh`;
    },
    icon: '⚡',
    color: '#facc15',
    desc: 'Total annual electricity consumption assessed',
  },
  {
    label: 'Implementation Rate',
    value: grandTotals.implementationPct,
    unit: '%',
    format: v => `${v}%`,
    icon: '📊',
    color: '#f472b6',
    desc: 'ECM implementation percentage across all audits',
  },
];

function useCounter(target: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, target, duration]);

  return value;
}

function KpiCard({ item, index, started }: { item: KpiItem; index: number; started: boolean }) {
  const count = useCounter(item.value, 2000, started);
  const displayValue = started ? item.format(count) : '—';

  return (
    <motion.div
      className="kpi-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{item.icon}</span>
        <span style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: item.color,
          padding: '0.2rem 0.625rem',
          background: `${item.color}15`,
          border: `1px solid ${item.color}30`,
          borderRadius: 100,
        }}>
          {item.unit || 'COUNT'}
        </span>
      </div>

      <div style={{
        fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        color: item.color,
        lineHeight: 1,
        marginBottom: '0.5rem',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {displayValue}
      </div>

      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4ff', marginBottom: '0.375rem' }}>
        {item.label}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(240,244,255,0.45)', lineHeight: 1.5 }}>
        {item.desc}
      </div>
    </motion.div>
  );
}

export default function YearInNumbers() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="kpi" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div className="glow-orb" style={{
        width: 600,
        height: 600,
        background: 'rgba(0, 229, 160, 0.06)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
      }} />

      <div className="section-container" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Impact Numbers
          </div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            FY 2025-26{' '}
            <span className="gradient-text">Year in Numbers</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Four years of energy transformation across Gujarat's industrial landscape, 
            quantified in real impact.
          </p>
        </div>

        {/* KPI Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {KPI_ITEMS.map((item, i) => (
            <KpiCard key={item.label} item={item} index={i} started={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
