import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { data, formatCrore, formatTonne, formatRoi, getSectorColor } from '../data';
import type { AuditProject } from '../types';

type SortKey = 'annualSavingsInr' | 'annualCo2ReductionTonnes' | 'roiMonths' | 'implementationPct';

const SORT_OPTIONS = [
  { key: 'annualSavingsInr' as SortKey, label: 'Annual Savings', icon: '💰' },
  { key: 'annualCo2ReductionTonnes' as SortKey, label: 'CO₂ Reduction', icon: '🌿' },
  { key: 'roiMonths' as SortKey, label: 'ROI (Best)', icon: '📈' },
  { key: 'implementationPct' as SortKey, label: 'Implementation %', icon: '⚙️' },
];

function ProjectCard({ project, rank, sortKey }: { project: AuditProject; rank: number; sortKey: SortKey }) {
  const color = getSectorColor(project.sector);
  const implPct = project.ecmRecommended > 0
    ? Math.round(((project.ecmImplemented ?? 0) / project.ecmRecommended) * 100)
    : 0;

  const highlightValue = () => {
    switch (sortKey) {
      case 'annualSavingsInr': return formatCrore(project.annualSavingsInr);
      case 'annualCo2ReductionTonnes': return formatTonne(project.annualCo2ReductionTonnes);
      case 'roiMonths': return formatRoi(project.roiMonths);
      case 'implementationPct': return `${implPct}%`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.05 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.125rem 1.25rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      whileHover={{
        background: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      {/* Rank */}
      <div style={{
        minWidth: 40,
        height: 40,
        borderRadius: 12,
        background: rank <= 2 ? `${color}20` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${rank <= 2 ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: rank === 0 ? '1.125rem' : '0.875rem',
        fontWeight: 800,
        color: rank <= 2 ? color : 'rgba(240,244,255,0.4)',
      }}>
        {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
      </div>

      {/* Company info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#f0f4ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.companyName}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)', marginTop: '0.125rem' }}>
          {project.district} · {project.fy}
        </div>
      </div>

      {/* Sector badge */}
      <div style={{
        padding: '0.2rem 0.625rem',
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 100,
        fontSize: '0.6875rem',
        fontWeight: 600,
        color,
        whiteSpace: 'nowrap',
        display: 'flex',
      }}>
        {project.sector}
      </div>

      {/* Highlight value */}
      <div style={{ textAlign: 'right', minWidth: 90 }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>
          {highlightValue()}
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'rgba(240,244,255,0.4)', marginTop: '0.1rem' }}>
          {SORT_OPTIONS.find(s => s.key === sortKey)?.label}
        </div>
      </div>
    </motion.div>
  );
}

export default function TopProjects() {
  const [sortKey, setSortKey] = useState<SortKey>('annualSavingsInr');
  const [showAll, setShowAll] = useState(false);

  const sorted = [...data.audits]
    .sort((a, b) => {
      if (sortKey === 'roiMonths') {
        // Lower ROI months = better
        const aRoi = a.roiMonths > 0 ? a.roiMonths : 999;
        const bRoi = b.roiMonths > 0 ? b.roiMonths : 999;
        return aRoi - bRoi;
      }
      if (sortKey === 'implementationPct') {
        const aPct = a.ecmRecommended > 0 ? ((a.ecmImplemented ?? 0) / a.ecmRecommended) : 0;
        const bPct = b.ecmRecommended > 0 ? ((b.ecmImplemented ?? 0) / b.ecmRecommended) : 0;
        return bPct - aPct;
      }
      return (b[sortKey] as number) - (a[sortKey] as number);
    });

  const displayed = showAll ? sorted : sorted.slice(0, 10);

  return (
    <section id="projects" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="section-container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Project Rankings</div>
          <h2 className="section-title">
            Top Performing{' '}
            <span className="gradient-text">Audit Projects</span>
          </h2>
          <p className="section-subtitle">
            Leaderboard of all {data.audits.length} audited plants ranked by your chosen metric.
          </p>
        </div>

        {/* Sort options */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`filter-chip ${sortKey === opt.key ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>{opt.icon}</span> {opt.label}
            </button>
          ))}
        </div>

        {/* Project list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {displayed.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              rank={i}
              sortKey={sortKey}
            />
          ))}
        </div>

        {/* Show more / Toggle button */}
        {sorted.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span>Implementation Plan</span>
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.3s ease',
                  transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
