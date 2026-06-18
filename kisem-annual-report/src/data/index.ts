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
  { name: 'Power Quality Analyzer', brand: 'Fluke/Hioki', img: '🔌', desc: 'Real-time power, harmonics, PF measurement across all phases' },
  { name: 'Thermal Camera', brand: 'FLIR Systems', img: '📷', desc: 'Infrared thermography for hotspot & insulation gap detection' },
  { name: 'Flue Gas Analyzer', brand: 'Testo/Bacharach', img: '💨', desc: 'O₂, CO, CO₂, NOx, SOx combustion efficiency analysis' },
  { name: 'Ultrasonic Flow Meter', brand: 'Endress+Hauser', img: '〰️', desc: 'Non-intrusive clamp-on flow measurement for liquids' },
  { name: 'Acoustic Imager', brand: 'FLIR Si124', img: '🔊', desc: 'Compressed air & gas leak detection using acoustic imaging' },
  { name: 'Solar Irradiance Meter', brand: 'Kipp & Zonen', img: '☀️', desc: 'GHI, DNI, DHI measurement for solar performance assessment' },
  { name: 'GHG Dashboard', brand: 'KISEM Proprietary', img: '🌍', desc: 'Real-time Scope 1-3 emissions tracking and verification tool' },
  { name: 'Lux Meter', brand: 'Extech/Sekonic', img: '💡', desc: 'Illuminance measurement for lighting retrofit analysis' },
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
