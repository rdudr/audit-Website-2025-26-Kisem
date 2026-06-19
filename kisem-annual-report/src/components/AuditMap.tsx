import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import ReactMapGL, { Marker, NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl/maplibre';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, TrendingUp, Zap, Leaf, DollarSign, Building, MapPin } from 'lucide-react';
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
          background: '#ffffff',
          borderLeft: '1px solid rgba(15, 23, 42, 0.08)',
          zIndex: 500,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
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
                background: 'rgba(15, 23, 42, 0.05)',
                border: 'none',
                borderRadius: 8,
                padding: '0.4rem',
                cursor: 'pointer',
                color: '#0f172a',
                display: 'flex',
              }}
            >
              <X size={18} />
            </button>
          </div>
          <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', lineHeight: 1.3 }}>
            {project.companyName}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
            📍 {project.district} · {project.fy} · Audit #{project.auditNumber}
          </p>
        </div>

        {/* Impact Stats */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(15, 23, 42, 0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { icon: <DollarSign size={14} />, label: 'Annual Savings', value: formatCrore(project.annualSavingsInr), color: '#00c887' },
              { icon: <Leaf size={14} />, label: 'CO₂ Reduction', value: formatTonne(project.annualCo2ReductionTonnes), color: '#16a34a' },
              { icon: <TrendingUp size={14} />, label: 'ROI', value: formatRoi(project.roiMonths), color: '#2563eb' },
              { icon: <Zap size={14} />, label: 'Investment', value: formatCrore(project.investmentInr), color: '#d97706' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(15, 23, 42, 0.02)',
                borderRadius: 12,
                padding: '1rem',
                border: '1px solid rgba(15, 23, 42, 0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: stat.color, marginBottom: '0.4rem' }}>
                  {stat.icon}
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Implementation progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
              <span style={{ color: '#475569' }}>ECM Implementation</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{project.ecmImplemented}/{project.ecmRecommended} ({implPct}%)</span>
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
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem' }}>
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
              <span className="label" style={{ color: '#64748b' }}>{row.label}</span>
              <span className="value" style={{ textAlign: 'right', maxWidth: 200, color: '#0f172a' }}>{row.value}</span>
            </div>
          ))}

          {project.utilities && (
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Utilities Assessed
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
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
  const filteredAudits = useMemo(() => {
    return allAudits.filter(a => {
      const sectorMatch = selectedSector === 'All' || a.sector === selectedSector;
      const fyMatch = selectedFy === 'All' || a.fy === selectedFy;
      return sectorMatch && fyMatch;
    });
  }, [allAudits, selectedSector, selectedFy]);

  const uniqueSectors = ['All', ...new Set(allAudits.map(a => a.sector))].sort();
  const fyOptions = useMemo(() => {
    return ['All', ...Array.from(new Set(allAudits.map(a => a.fy))).sort()];
  }, [allAudits]);

  const mapStats = {
    audits: filteredAudits.length,
    savings: filteredAudits.reduce((s, a) => s + a.annualSavingsInr, 0),
    co2: filteredAudits.reduce((s, a) => s + a.annualCo2ReductionTonnes, 0),
  };

  // Group and count audits by district from filteredAudits
  const { sortedDistricts, maxCount, districtAudits } = useMemo(() => {
    const gujaratAudits = filteredAudits;

    const distAudits = gujaratAudits.reduce<Record<string, AuditProject[]>>((acc, audit) => {
      const district = audit.district ? audit.district.trim() : 'Unknown';
      if (!acc[district]) {
        acc[district] = [];
      }
      acc[district].push(audit);
      return acc;
    }, {});

    const sorted = Object.entries(distAudits)
      .map(([district, audits]) => ({
        name: district,
        count: audits.length,
        audits: audits
      }))
      .sort((a, b) => b.count - a.count);

    const max = Math.max(...sorted.map(d => d.count), 1);

    return { sortedDistricts: sorted, maxCount: max, districtAudits: distAudits };
  }, [filteredAudits]);

  const [activeDistrict, setActiveDistrict] = useState<string>('');

  useEffect(() => {
    if (sortedDistricts.length > 0) {
      const exists = sortedDistricts.some(d => d.name === activeDistrict);
      if (!exists) {
        setActiveDistrict(sortedDistricts[0].name);
      }
    } else {
      setActiveDistrict('');
    }
  }, [sortedDistricts, activeDistrict]);

  const activeDistrictAudits = activeDistrict ? (districtAudits[activeDistrict] || []) : [];
  const sortedDistrictCompanies = useMemo(() => {
    return [...activeDistrictAudits].sort((a, b) => 
      a.companyName.localeCompare(b.companyName)
    );
  }, [activeDistrictAudits]);

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
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)', fontWeight: 600, letterSpacing: '0.04em' }}>
              FY:
            </span>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)', fontWeight: 600, letterSpacing: '0.04em' }}>
              SECTOR:
            </span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="sector-select"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 100,
                  color: 'rgba(240, 244, 255, 0.8)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  padding: '0.4rem 2.2rem 0.4rem 1rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba%28240%2C244%2C255%2C0.6%29' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '0.85rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {uniqueSectors.map(sector => (
                  <option
                    key={sector}
                    value={sector}
                    style={{
                      background: '#020818',
                      color: 'rgba(240, 244, 255, 0.8)',
                    }}
                  >
                    {sector === 'All' ? 'All Sectors' : `${SECTOR_ICON[sector] || '🏭'} ${sector}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            reuseMaps
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-right" />
            
            {/* Gujarat Boundaries Layer */}
            <Source id="india-states-source" type="geojson" data="/india_states.geojson">
              <Layer
                id="gujarat-fill-layer"
                type="fill"
                filter={['==', ['get', 'ST_NM'], 'Gujarat']}
                paint={{
                  'fill-color': '#00e5a0',
                  'fill-opacity': 0.08,
                }}
              />
              <Layer
                id="gujarat-line-layer"
                type="line"
                filter={['==', ['get', 'ST_NM'], 'Gujarat']}
                paint={{
                  'line-color': '#00e5a0',
                  'line-width': 2.5,
                  'line-opacity': 0.8,
                }}
              />
            </Source>

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

        {/* Divider */}
        <div className="divider" style={{ margin: '4rem 0' }} />

        {/* City Audits Chart Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-label">Audit Distribution</div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Audits by <span className="gradient-text">City & District</span>
          </h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Interactive distribution of audits across Gujarat. Click any city bar to view the audited companies in that city, sorted alphabetically.
          </p>
        </div>

        {/* Cities/Districts Audit Counts Grid */}
        <div className="chart-container" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {sortedDistricts.map(dist => {
              const isSelected = activeDistrict === dist.name;
              const barWidth = `${(dist.count / maxCount) * 100}%`;
              return (
                <div
                  key={dist.name}
                  onClick={() => setActiveDistrict(dist.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1rem',
                    background: isSelected 
                      ? 'rgba(0, 229, 160, 0.08)' 
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected 
                      ? '1px solid rgba(0, 229, 160, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <motion.div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: '0.75rem',
                    }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* City Name */}
                    <div style={{
                      width: '95px',
                      minWidth: '95px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 750 : 600,
                      color: isSelected ? 'var(--color-text)' : 'var(--color-text-2)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {dist.name}
                    </div>

                    {/* Progress Bar Track */}
                    <div style={{
                      flexGrow: 1,
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '100px',
                      overflow: 'hidden',
                    }}>
                      {/* Visual Bar Fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barWidth }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          borderRadius: '100px',
                          background: isSelected
                            ? 'linear-gradient(90deg, var(--color-blue), var(--color-green))'
                            : 'rgba(255, 255, 255, 0.15)',
                        }}
                      />
                    </div>

                    {/* Count badge */}
                    <div style={{
                      minWidth: '28px',
                      textAlign: 'right',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: isSelected ? 'var(--color-green)' : 'var(--color-text-2)',
                    }}>
                      {dist.count}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company List for Selected City */}
        {activeDistrict && (
          <div className="chart-container" style={{ padding: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'rgba(0, 229, 160, 0.1)',
                  color: 'var(--color-green)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  display: 'flex',
                }}>
                  <Building size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {activeDistrict} Audited Companies
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-3)' }}>
                    {sortedDistrictCompanies.length} {sortedDistrictCompanies.length === 1 ? 'facility' : 'facilities'} audited in this district
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-2)',
                fontWeight: 600,
              }}>
                Sorted Alphabetically A-Z
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginTop: '1.5rem',
            }}>
              {sortedDistrictCompanies.map(project => {
                const color = getSectorColor(project.sector);
                return (
                  <motion.div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    whileHover={{ y: -4, borderColor: 'rgba(0, 229, 160, 0.3)' }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.25s, background-color 0.25s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '140px',
                    }}
                  >
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}>
                        <span style={{
                          fontSize: '0.7rem',
                          color: 'var(--color-text-3)',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}>
                          #{project.auditNumber}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem',
                          padding: '0.2rem 0.6rem',
                          background: `${color}15`,
                          color: color,
                          border: `1px solid ${color}35`,
                          borderRadius: '100px',
                          fontWeight: 600,
                        }}>
                          {project.sector}
                        </span>
                      </div>
                      <h5 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: '1.4',
                        marginBottom: '0.5rem',
                      }}>
                        {project.companyName}
                      </h5>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-2)',
                      marginTop: '0.5rem',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '0.75rem',
                    }}>
                      <span>🌱 {formatTonne(project.annualCo2ReductionTonnes)} CO₂</span>
                      <span style={{
                        color: 'var(--color-green)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.1rem',
                        transition: 'transform 0.2s',
                      }} className="details-link">
                        Details <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
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
