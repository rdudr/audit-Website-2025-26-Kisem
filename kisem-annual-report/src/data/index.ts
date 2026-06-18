import kisemData from './kisem-data.json';
import type { KisemData } from '../types';

export const data = kisemData as KisemData;

// Formatting utilities
export function formatCrore(n: number, decimals = 2): string {
  const crore = n / 1e7;
  return `₹${crore.toFixed(decimals)} Cr`;
}

export function formatLakh(n: number, decimals = 1): string {
  const lakh = n / 1e5;
  return `₹${lakh.toFixed(decimals)}L`;
}

export function formatNumber(n: number, compact = false): string {
  if (compact) {
    if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
    if (n >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

export function formatPercent(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function formatTonne(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M T`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K T`;
  return `${Math.round(n)} T`;
}

export function formatKwh(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GWh`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} MWh`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} kWh`;
  return `${Math.round(n)} kWh`;
}

export function formatRoi(months: number): string {
  if (months <= 0) return 'N/A';
  if (months < 12) return `${months.toFixed(1)} mo`;
  return `${(months / 12).toFixed(1)} yr`;
}

// Sector colors
export const SECTOR_COLORS: Record<string, string> = {
  'Cold Storage': '#60a5fa',
  'Textile': '#f59e0b',
  'Chemical': '#a78bfa',
  'CETP': '#34d399',
  'Sea Food': '#06b6d4',
  'Paper': '#fb923c',
  'Pharma': '#ec4899',
  'Engineering': '#8b5cf6',
  'Ceramic': '#f97316',
  'Sugar': '#fbbf24',
  'Metal': '#94a3b8',
  'Solar': '#facc15',
  'Plastic': '#22d3ee',
  'Food': '#84cc16',
  'Timber': '#a3e635',
  'Diamond': '#c084fc',
  'Packaging': '#fb7185',
  'Other': '#64748b',
};

export function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || SECTOR_COLORS['Other'];
}

// All unique sectors from data
export const ALL_SECTORS = ['All', ...new Set(data.audits.map(a => a.sector))].sort();

// FY labels
export const FY_LABELS = ['FY22-23', 'FY23-24', 'FY24-25', 'FY25-26'];

// Industrial clusters (derived from data)
export const CLUSTERS = [
  { name: 'Ahmedabad Industrial Cluster', district: 'Ahmedabad', sectors: ['CETP', 'Chemical', 'Textile'], count: 12 },
  { name: 'Gandhinagar MSME Cluster', district: 'Gandhinagar', sectors: ['Engineering', 'Food', 'Plastic'], count: 8 },
  { name: 'Surat Textile Cluster', district: 'Surat', sectors: ['Textile', 'Diamond'], count: 6 },
  { name: 'Bharuch Chemical Cluster', district: 'Bharuch', sectors: ['Chemical', 'CETP', 'Sugar'], count: 5 },
  { name: 'Aravalli Cold Chain Cluster', district: 'Aravalli', sectors: ['Cold Storage'], count: 3 },
  { name: 'Porbandar Seafood Cluster', district: 'Porbandar', sectors: ['Sea Food', 'Food'], count: 4 },
  { name: 'Vapi Industrial Cluster', district: 'Vapi', sectors: ['Chemical', 'Pharma'], count: 3 },
  { name: 'Mehsana Industrial Cluster', district: 'Mehsana', sectors: ['Engineering', 'Plastic'], count: 4 },
  { name: 'Morbi Ceramic Cluster', district: 'Morbi', sectors: ['Ceramic'], count: 1 },
  { name: 'Rajkot Engineering Cluster', district: 'Rajkot', sectors: ['Engineering', 'Metal'], count: 2 },
];

// Scope of assessment items
export const SCOPE_ITEMS = [
  { icon: '⚡', title: 'Electrical Systems', desc: 'Transformers, motors, power factor analysis, DG sets' },
  { icon: '🔥', title: 'Thermal Systems', desc: 'Boilers, thermic fluid heaters, furnaces, heat recovery' },
  { icon: '❄️', title: 'Refrigeration', desc: 'Ammonia/freon systems, chillers, cold storage' },
  { icon: '💨', title: 'Compressed Air', desc: 'Compressors, leakage audit, pressure optimization' },
  { icon: '☀️', title: 'Solar PV', desc: 'Solar generation analysis, performance ratio, shading' },
  { icon: '💧', title: 'Pumping Systems', desc: 'Pump efficiency, piping losses, flow optimization' },
  { icon: '🌡️', title: 'Process Heat', desc: 'Steam systems, insulation, heat exchangers' },
  { icon: '🏭', title: 'HVAC & Ventilation', desc: 'AHUs, cooling towers, ventilation fans' },
  { icon: '💡', title: 'Lighting', desc: 'LED retrofit, daylight harvesting, controls' },
  { icon: '📊', title: 'Power Quality', desc: 'Harmonics, power factor, voltage stability' },
  { icon: '🌡', title: 'Thermal Imaging', desc: 'Hot spots, insulation gaps, electrical faults' },
  { icon: '🔬', title: 'Flue Gas Analysis', desc: 'Combustion efficiency, excess air, stack losses' },
  { icon: '📏', title: 'Flow Measurement', desc: 'Air, water, steam, fuel flow metering' },
  { icon: '🔊', title: 'Acoustic Imaging', desc: 'Compressed air leaks, ultrasonic detection' },
  { icon: '🌍', title: 'GHG Accounting', desc: 'Scope 1, 2, 3 emissions inventory and verification' },
  { icon: '⚙️', title: 'Variable Speed Drives', desc: 'VFD opportunities, motor sizing, load profiling' },
  { icon: '♻️', title: 'Waste Heat Recovery', desc: 'Heat exchangers, ORC, economizers' },
];

// Instruments & capabilities
export const INSTRUMENTS = [
  {
    name: 'Power Quality Analyzer',
    brand: 'Hioki PQ3198, Krykard ALM-45/36/31/20',
    img: '/instruments/Power Quality Study.png',
    desc: [
      'Class A, IEC 61000-4-30 standard compliance',
      'Inter-harmonics measurement from 0.5th to 49.5 order',
      'Super-harmonics detection from 2 kHz to 80 kHz',
      'Captures transient voltage, current waveform peaks, and 1/2 RMS values',
      'Swell, dip, interruption, and instantaneous flicker value monitoring',
      'Inrush current, current RMS, and multi-interval frequency logging',
      'Two-circuit measurement capability for inverter efficiency',
      'High accuracy (DC: ±0.5% rdg. ±0.5% f.s. + sensor accuracy)'
    ]
  },
  {
    name: 'Thermal Imaging Camera',
    brand: 'Testo T-883/T-872, Raytek RAYR3IPLUS, Fluke TC01A, HTC MTX2, IRX68',
    img: '/instruments/Thermal Imager.png',
    desc: [
      'High-resolution infrared camera (320 × 240 pixels)',
      'Non-contact measurement range from -30 °C to 650 °C',
      'Professional reporting using Testo IR Soft analysis software',
      'Laser marker and manual focus for pinpoint hot-spot targeting',
      'Ideal for electrical panels, insulation checks, and mechanical systems',
      'Perfect for quick diagnostics in MSME industries',
      'Rugged, industrial-grade design & mobile phone compatible',
      'Molten metal pyrometer up to 2000 °C with recording capabilities'
    ]
  },
  {
    name: 'Flue Gas Analyzer',
    brand: 'Kane K988 (with 1250°C probe), K958',
    img: '/instruments/Flue Gas Analysis.png',
    desc: [
      'Multi-Gas: Simultaneous detection of O₂, CO, CO₂, NO, NO₂, SO₂, H₂S, and HC gases',
      'High-temperature stack measurement up to 1250 °C',
      'Measures flue gas temperature, draft, and differential pressure',
      'Computes combustion efficiency, excess air, and CO₂ percentage instantly',
      'Data logging and real-time reporting for industrial boilers'
    ]
  },
  {
    name: 'Acoustic Leakage & Flow Detection',
    brand: 'Testo LD Pro, VP Flow PN16, Lutron GS-5800, Wise 4, Extech RD300',
    img: '/instruments/Acoustic Leakage Detection.png',
    desc: [
      'In-line demand & supply side compressed air and technical gas flow measurement',
      'Shared air compressor flow measurements and diagnosis',
      'Sensors for flow, pressure, and temperature (0 to 60 °C) with logging',
      'Acoustic Imaging services for real-time compressed air leak rate detection',
      'Complete system diagnosis of compressed air networks',
      'Refrigerant Leakage: R-22, R-134a, R-404a, R-410a, and all CFCs, HCFCs, HFCs',
      'LED selector display with high sensitivity of 0.25/0.50/0.99 oz per year'
    ]
  },
  {
    name: 'Detailed Solar PV Analysis',
    brand: 'Solar DC Power Analyzer, Ambient Temp/Humidity Logger, Irradiance Meter',
    img: '/instruments/Detailed Solar PV Analysis.png',
    desc: [
      'Module efficiency, Inverter efficiency, and Performance Ratio (PR)',
      'Assessment of temperature losses, shading losses, and soiling losses (dust/dirt)',
      'Mismatch, cable, and inverter efficiency loss evaluation',
      'Tilt and orientation optimization for maximum solar utilization',
      'Irradiance utilization efficiency and distribution/metering losses',
      'Thermographic hot-spot assessment of solar modules',
      'Inverter overloading performance and complete PV system troubleshooting'
    ]
  },
  {
    name: 'Ultrasonic Flow Meter',
    brand: 'Endress+Hauser',
    img: '/instruments/Fluid Flow Measurment.png',
    desc: [
      'Non-intrusive clamp-on flow measurement for liquids',
      'Supports wide range of pipe sizes and materials without system shutdown',
      'High-accuracy transit-time ultrasonic sensors with data logging'
    ]
  },
  {
    name: 'GHG Dashboard',
    brand: 'KISEM Proprietary',
    img: '🌍',
    desc: 'Real-time Scope 1-3 emissions tracking and verification tool'
  },
  {
    name: 'Lux Meter',
    brand: 'Extech/Sekonic',
    img: '💡',
    desc: 'Illuminance measurement for lighting retrofit analysis'
  }
];

// Partners
export const PARTNERS = [
  {
    name: 'Kotak Mahindra Bank',
    role: 'CSR Funder',
    logo: '/download.png',
    desc: "Kotak Mahindra Bank's CSR initiative empowering industrial energy efficiency across India",
    color: '#FF0000',
  },
  {
    name: 'IIT Gandhinagar',
    role: 'Executing Agency',
    logo: '/iitgn_Logo.png',
    desc: 'Premier technical institution of India executing the KISEM programme with world-class expertise',
    color: '#003087',
  },
  {
    name: 'IIT Madras / IEAC',
    role: 'Knowledge Partner',
    logo: '/kotak_iit_madras_save_energy_mission_logo.jpg',
    desc: 'The Industrial Energy Acceleration Centre (IEAC) at IIT Madras provides technical oversight and methodology',
    color: '#8B0000',
  },
  {
    name: 'GEDA',
    role: 'Gujarat State Partner',
    logo: null,
    desc: 'Gujarat Energy Development Agency providing state-level support and MSME ecosystem access',
    color: '#E87722',
  },
  {
    name: 'WRI India',
    role: 'Research Partner',
    logo: null,
    desc: 'World Resources Institute supporting textile benchmarking and sustainability research',
    color: '#00B49A',
  },
  {
    name: 'Ministry of MSME',
    role: 'Central Government',
    logo: null,
    desc: 'Ministry of Micro, Small & Medium Enterprises providing policy framework and outreach support',
    color: '#003087',
  },
];

// Outreach events (sample derived from report context)
export const OUTREACH_EVENTS = [
  { fy: 'FY22-23', type: 'Awareness Program', title: 'MSME Energy Awareness Drive', location: 'Ahmedabad', count: 1 },
  { fy: 'FY23-24', type: 'Workshop', title: 'Energy Audit Methodology Workshop', location: 'Gandhinagar', count: 3 },
  { fy: 'FY23-24', type: 'Conference', title: 'Gujarat Energy Summit', location: 'Ahmedabad', count: 1 },
  { fy: 'FY24-25', type: 'College Visit', title: 'Engineering College Outreach', location: 'Multiple', count: 5 },
  { fy: 'FY24-25', type: 'Industry Meet', title: 'Cold Chain Industry Meet', location: 'Aravalli', count: 2 },
  { fy: 'FY24-25', type: 'Workshop', title: 'Textile Energy Benchmarking Workshop', location: 'Surat', count: 1 },
  { fy: 'FY25-26', type: 'Summit', title: 'KISEM Impact Summit', location: 'IIT Gandhinagar', count: 1 },
  { fy: 'FY25-26', type: 'Awareness Program', title: 'WRI Textile Industry Meet', location: 'Surat', count: 2 },
];
