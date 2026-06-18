import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, TrendingUp, Zap, Leaf, DollarSign } from 'lucide-react';
import { data, formatCrore, formatNumber, formatTonne, formatRoi, getSectorColor, ALL_SECTORS } from '../data';
import type { AuditProject } from '../types';
import 'maplibre-gl/dist/maplibre-gl.css';


const SECTOR_ICON: Record<string, string> = {
  'Cold Storage': '❄️',
  'Textile': '🧵',
  'Chemical': '⚗️',
  'CETP': '💧',
  'Sea Food': '🐟',
  'Paper': '📄',
  'Pharma': '💊',
  'Engineering': '⚙️',
  'Ceramic': '🏺',
  'Sugar': '🍬',
  'Metal': '🔩',
  'Solar': '☀️',
  'Plastic': '♻️',
  'Food': '🌾',
  'Timber': '🌲',
  'Diamond': '💎',
  'Other': '🏭',
};

function ProjectDrawer({ project, onClose }: { project: AuditProject; onClose: () => void }) {
  const color = getSectorColor(project.sector);
  const implPct = project.ecmRecommended > 0
    ? Math.round(((project.ecmImplemented ?? 0) / project.ecmRecommended) * 100)
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: 'min(480px, 100vw)',
          background: '#030e1e',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          zIndex: 500,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky',
          top: 0,
          background: '#030e1e',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: `${color}15`,
              border: `1px solid ${color}30`,
              borderRadius: 100,
              fontSize: '0.75rem',
              fontWeight: 600,
              color,
            }}>
              {SECTOR_ICON[project.sector] || '🏭'} {project.sector}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: 8,
                padding: '0.4rem',
                cursor: 'pointer',
                color: '#f0f4ff',
                display: 'flex',
              }}
            >
              <X size={18} />
            </button>
          </div>
          <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.25rem', lineHeight: 1.3 }}>
            {project.companyName}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.5)' }}>
            📍 {project.district} · {project.fy} · Audit #{project.auditNumber}
          </p>
        </div>

        {/* Impact Stats */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { icon: <DollarSign size={14} />, label: 'Annual Savings', value: formatCrore(project.annualSavingsInr), color: '#00e5a0' },
              { icon: <Leaf size={14} />, label: 'CO₂ Reduction', value: formatTonne(project.annualCo2ReductionTonnes), color: '#86efac' },
              { icon: <TrendingUp size={14} />, label: 'ROI', value: formatRoi(project.roiMonths), color: '#60a5fa' },
              { icon: <Zap size={14} />, label: 'Investment', value: formatCrore(project.investmentInr), color: '#fbbf24' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: stat.color, marginBottom: '0.4rem' }}>
                  {stat.icon}
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f4ff', letterSpacing: '-0.03em' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Implementation progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
              <span style={{ color: 'rgba(240,244,255,0.6)' }}>ECM Implementation</span>
              <span style={{ fontWeight: 600, color: '#f0f4ff' }}>{project.ecmImplemented}/{project.ecmRecommended} ({implPct}%)</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${implPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '1.5rem', flexGrow: 1 }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.4)', marginBottom: '1rem' }}>
            Company Overview
          </h4>
          {[
            { label: 'Location', value: project.location || project.district },
            { label: 'Sector', value: project.sector },
            { label: 'Product', value: project.product },
            { label: 'Audit Date', value: project.auditDate || 'N/A' },
            { label: 'Audit Duration', value: `${project.auditDays} days` },
            { label: 'Sanctioned Demand', value: project.sanctionedDemand ? `${project.sanctionedDemand} kVA` : 'N/A' },
            { label: 'Annual Elec. Consumption', value: `${formatNumber(project.annualElecConsumptionKwh)} kWh` },
            { label: 'Annual Energy Cost', value: formatCrore(project.annualEnergyCostInr) },
            { label: 'Existing CO₂ Emissions', value: formatTonne(project.existingCo2Tonnes) },
            { label: 'Actual Savings Achieved', value: formatCrore(project.actualEnergyCostSavingsInr ?? 0) },
            { label: 'Actual CO₂ Reduced', value: formatTonne(project.actualCo2ReductionTonnes ?? 0) },
          ].map(row => (
            <div key={row.label} className="stat-row">
              <span className="label">{row.label}</span>
              <span className="value" style={{ textAlign: 'right', maxWidth: 200 }}>{row.value}</span>
            </div>
          ))}

          {project.utilities && (
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(240,244,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Utilities Assessed
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.7)', lineHeight: 1.6 }}>
                {project.utilities}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function MarkerPin({ project, onClick, isSelected }: {
  project: AuditProject;
  onClick: () => void;
  isSelected: boolean;
}) {
  const color = getSectorColor(project.sector);
  const size = isSelected ? 44 : 36;

  return (
    <Marker
      longitude={project.coordinates.lng}
      latitude={project.coordinates.lat}
      anchor="bottom"
    >
      <div
        onClick={onClick}
        title={project.companyName}
        style={{
          width: size,
          height: size,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          background: isSelected ? color : `${color}cc`,
          border: `2px solid ${isSelected ? '#fff' : `${color}66`}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? `0 4px 20px ${color}60` : `0 2px 8px ${color}30`,
        }}
      >
        <span style={{
          transform: 'rotate(45deg)',
          fontSize: isSelected ? 16 : 13,
          lineHeight: 1,
        }}>
          {SECTOR_ICON[project.sector] || '🏭'}
        </span>
      </div>
    </Marker>
  );
}

export default function AuditMap() {
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedProject, setSelectedProject] = useState<AuditProject | null>(null);
  const [selectedFy, setSelectedFy] = useState('All');

  const allAudits = data.audits;
  const filteredAudits = allAudits.filter(a => {
    const sectorMatch = selectedSector === 'All' || a.sector === selectedSector;
    const fyMatch = selectedFy === 'All' || a.fy === selectedFy;
    return sectorMatch && fyMatch;
  });

  const uniqueSectors = ['All', ...new Set(allAudits.map(a => a.sector))].sort();
  const fyOptions = ['All', 'FY22-23', 'FY23-24', 'FY24-25', 'FY25-26'];

  const mapStats = {
    audits: filteredAudits.length,
    savings: filteredAudits.reduce((s, a) => s + a.annualSavingsInr, 0),
    co2: filteredAudits.reduce((s, a) => s + a.annualCo2ReductionTonnes, 0),
  };

  return (
    <section id="map" className="section-padding" style={{ position: 'relative' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Interactive Map</div>
          <h2 className="section-title">
            Gujarat's Energy{' '}
            <span className="gradient-text">Audit Network</span>
          </h2>
          <p className="section-subtitle">
            Explore all {allAudits.length} audited plants across Gujarat, Rajasthan and Daman. 
            Click any marker to view detailed project insights.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)', fontWeight: 600, letterSpacing: '0.04em' }}>
            FILTER:
          </span>
          {fyOptions.map(fy => (
            <button
              key={fy}
              onClick={() => setSelectedFy(fy)}
              className={`filter-chip ${selectedFy === fy ? 'active' : ''}`}
            >
              {fy}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {uniqueSectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`filter-chip ${selectedSector === sector ? 'active' : ''}`}
              style={{
                borderColor: selectedSector === sector && sector !== 'All'
                  ? getSectorColor(sector) + '80'
                  : undefined,
                color: selectedSector === sector && sector !== 'All'
                  ? getSectorColor(sector)
                  : undefined,
                background: selectedSector === sector && sector !== 'All'
                  ? getSectorColor(sector) + '15'
                  : undefined,
              }}
            >
              {sector !== 'All' && SECTOR_ICON[sector]} {sector}
            </button>
          ))}
        </div>

        {/* Map stats bar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '0.875rem 1.25rem',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Showing Audits', value: mapStats.audits },
            { label: 'Combined Savings', value: formatCrore(mapStats.savings) },
            { label: 'CO₂ Reduction', value: formatTonne(mapStats.co2) },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: '#00e5a0', fontSize: '1.0625rem' }}>{s.value}</span>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(240,244,255,0.4)' }}>{s.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.1)', padding: '0 0.5rem' }}>·</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="map-container">
          <ReactMapGL
            initialViewState={{
              longitude: 72.0,
              latitude: 22.5,
              zoom: 6.2,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            reuseMaps
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-right" />
            {filteredAudits.map(project => (
              <MarkerPin
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </ReactMapGL>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
        }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)', fontWeight: 600, alignSelf: 'center' }}>LEGEND:</span>
          {uniqueSectors.filter(s => s !== 'All').slice(0, 8).map(sector => (
            <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: getSectorColor(sector) }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.6)' }}>{sector}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer overlay */}
      {selectedProject && (
        <>
          <div
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 499,
              backdropFilter: 'blur(4px)',
            }}
          />
          <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
        </>
      )}
    </section>
  );
}
