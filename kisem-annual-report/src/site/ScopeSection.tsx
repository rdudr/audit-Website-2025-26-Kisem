import { useMemo, useRef, useState } from 'react';
import { sum, type Row } from '../data';
import { APPLY_URL } from './content';
import PlantTour from './PlantTour';
import { useDevice } from './useDevice';

// "What an audit covers" (canvas "Component · What an audit covers"): the key numbers, the plant
// tour, the diagnostics, energy in → audit → cleaner output, how an audit runs, and the 17 areas
// by kind of system with a filter. Figures come from the audit data, so they follow the master sheet.

const I = {
  bolt: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 2 1.5 3 2.5 3.3z',
  snow: 'M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5',
  air: 'M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2',
  sun: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  drop: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.7 12 3c-.5 2.7-2 5-4 6.5S5 13 5 15a7 7 0 0 0 7 7z',
  heat: 'M4 4h16v6H4zM6 14h12v6H6zM10 10v4M14 10v4',
  hvac: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 12v9M3 12h3M18 12h3',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  pulse: 'M22 12h-4l-3 9L9 3l-3 9H2',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  flue: 'M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2',
  pipe: 'M2 9h20M2 15h20M6 9v6M18 9v6',
  sound: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  drive: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 2v2M12 14v8M5 21h14M19 4l-2.5 2.5M5 4l2.5 2.5',
  recycle: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.4 5.2-6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
};
const INS = {
  pqa: { img: '/scope/inst-pqa.webp', name: 'Power quality analyser', models: 'Hioki PQ3198 · Krykard ALM' },
  thermal: { img: '/scope/inst-thermal.webp', name: 'Thermal imaging camera', models: 'Testo T-883/T-872 · Fluke' },
  flue: { img: '/scope/inst-flue.webp', name: 'Flue gas analyser', models: 'Kane K988 · K958' },
  acoustic: { img: '/scope/inst-acoustic.webp', name: 'Acoustic leak and flow', models: 'Testo LD Pro · VP Flow' },
  flow: { img: '/scope/inst-flow.webp', name: 'Ultrasonic flow meter', models: 'Endress+Hauser, clamp-on' },
  solar: { img: '/scope/inst-solar.webp', name: 'Solar PV analysis', models: 'DC analyser · irradiance meter' },
};
type Fam = 'elec' | 'heat' | 'air' | 'flow' | 'green';
const FAM: Record<Fam, { label: string; color: string; tint: string; ink: string; d: string; blurb: string; photo: string; alt: string; inst: (typeof INS)[keyof typeof INS][] }> = {
  elec: { label: 'Electrical', color: '#5B3FD6', tint: '#F0EDFC', ink: '#3E2A9E', d: I.bolt, blurb: 'From the incomer to every motor and fitting', photo: '/scope/mcc.webp', alt: 'KISEM engineer taking clamp-on readings at a motor control centre', inst: [INS.pqa, INS.thermal] },
  heat: { label: 'Heat and combustion', color: '#B3261E', tint: '#FCEEEC', ink: '#8C1D17', d: I.flame, blurb: 'Boilers, furnaces, steam and the heat that escapes', photo: '/scope/boiler-house.webp', alt: 'Boiler house at an audited plant', inst: [INS.flue, INS.thermal] },
  air: { label: 'Cooling and air', color: '#0F766E', tint: '#E6F4F2', ink: '#0B5A54', d: I.snow, blurb: 'Chillers, compressors, air handling and leaks', photo: '/scope/chiller.webp', alt: 'KISEM engineer fitting a flow meter on a chiller line', inst: [INS.acoustic, INS.thermal] },
  flow: { label: 'Water and flow', color: '#1D5BD8', tint: '#EBF1FD', ink: '#16449F', d: I.drop, blurb: 'Pumps, piping and what flows through them', photo: '/scope/pumps.webp', alt: 'KISEM team checking pumps and piping', inst: [INS.flow] },
  green: { label: 'Clean energy and carbon', color: '#15803D', tint: '#E8F5EC', ink: '#0F5F2D', d: I.leaf, blurb: 'Solar generation and the carbon inventory', photo: '/scope/solar-roof.webp', alt: 'KISEM engineer measuring on a rooftop solar plant', inst: [INS.solar] },
};
const AREAS: { n: string; name: string; what: string; fam: Fam; d: string }[] = ([
  ['01', 'Electrical systems', 'Transformers, motors, power factor, DG sets', 'elec', I.bolt],
  ['02', 'Thermal systems', 'Boilers, thermic fluid heaters, furnaces', 'heat', I.flame],
  ['03', 'Refrigeration', 'Ammonia and freon systems, chillers, cold storage', 'air', I.snow],
  ['04', 'Compressed air', 'Compressors, leakage, pressure optimisation', 'air', I.air],
  ['05', 'Solar PV', 'Generation, performance ratio, shading', 'green', I.sun],
  ['06', 'Pumping systems', 'Pump efficiency, piping losses, flow', 'flow', I.drop],
  ['07', 'Process heat', 'Steam systems, insulation, heat exchangers', 'heat', I.heat],
  ['08', 'HVAC and ventilation', 'AHUs, cooling towers, fans', 'air', I.hvac],
  ['09', 'Lighting', 'LED retrofit, daylight, controls', 'elec', I.bulb],
  ['10', 'Power quality', 'Harmonics, power factor, voltage stability', 'elec', I.pulse],
  ['11', 'Thermal imaging', 'Hot spots, insulation gaps, electrical faults', 'heat', I.scan],
  ['12', 'Flue gas analysis', 'Combustion efficiency, excess air, stack losses', 'heat', I.flue],
  ['13', 'Flow measurement', 'Air, water, steam and fuel flow', 'flow', I.pipe],
  ['14', 'Acoustic imaging', 'Compressed air leaks, ultrasonic detection', 'air', I.sound],
  ['15', 'GHG accounting', 'Scope 1, 2 and 3 emissions inventory', 'green', I.globe],
  ['16', 'Variable speed drives', 'Drive opportunities, motor sizing, load profiles', 'elec', I.drive],
  ['17', 'Waste heat recovery', 'Heat exchangers, ORC, economisers', 'heat', I.recycle],
] as const).map(([n, name, what, fam, d]) => ({ n, name, what, fam, d }));
// The plant tour stops (frame numbers) that cover each area, and the short name of each stop.
const STOPS: Record<string, number[]> = {
  '01': [1, 11], '02': [4, 11], '03': [8], '04': [7], '05': [3], '06': [9], '07': [4, 5], '08': [8], '09': [10],
  '10': [2], '11': [4, 5, 11], '12': [6], '13': [9], '14': [7], '15': [6], '16': [1], '17': [5, 6],
};
const STOP_NAME = ['', 'Power in', 'Power quality', 'Solar PV', 'Heat', 'Furnace', 'Stack', 'Air', 'Cooling', 'Pumps', 'Production', 'Thermal'];
const KEYS: Fam[] = ['elec', 'heat', 'air', 'flow', 'green'];
const DIAG = [
  { n: '10', name: 'Power quality', what: 'Harmonics, dips, swells and power factor at the incomer and major panels.', img: INS.pqa.img, alt: 'Power quality analysers', color: FAM.elec.color },
  { n: '11', name: 'Thermal imaging', what: 'Hot spots in panels, steam lines, insulation and motors.', img: INS.thermal.img, alt: 'Thermal imaging cameras', color: FAM.heat.color },
  { n: '13', name: 'Flow measurement', what: 'Clamp-on flow for air, water, steam and fuel, without cutting the pipe.', img: INS.flow.img, alt: 'Clamp-on ultrasonic flow meter', color: FAM.flow.color },
  { n: '14', name: 'Acoustic imaging', what: 'Ultrasonic detection of compressed air and refrigerant leaks.', img: INS.acoustic.img, alt: 'Acoustic leak detector', color: FAM.air.color },
];
const STEPS = [
  { title: 'Walkthrough audit', text: 'A first visit to the plant to map the utilities, the major loads and the energy bills, and to find the quick wins.', d: 'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM6 6h12v15H6zM9 11h6M9 15h4' },
  { title: 'Detailed energy audit', text: 'Days on the plant floor: logging the supply, imaging panels and steam lines, testing compressors, pumps, chillers and solar.', d: I.pulse },
  { title: 'Energy audit report submission', text: 'Each finding becomes an energy conservation measure with its saving in ₹, energy and CO₂ a year, the investment and the payback, submitted to the plant as the audit report.', d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4' },
  { title: 'Implementation and follow-up', text: 'A separate team verifies what the plant implemented about 3 months after the report, and a post assessment follows about 6 months after it.', d: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14l-3-3' },
];

const cr = (v: number) => '₹ ' + (v / 1e7).toFixed(2) + ' Cr';
const Svg = ({ d, size = 18, stroke = '#FFFFFF', w = 2.2 }: { d: string; size?: number; stroke?: string; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d={d} /></svg>
);

export default function ScopeSection({ rows }: { rows: Row[] }) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const [active, setActive] = useState<'all' | Fam>('all');
  const [jump, setJump] = useState({ k: 0, n: 0 });
  const tourRef = useRef<HTMLDivElement>(null);
  const toStop = (k: number) => { setJump(j => ({ k, n: j.n + 1 })); tourRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const fig = useMemo(() => {
    const ri = sum(rows, 'ri'), months = ri ? (12 * sum(rows, 'rv')) / ri : 0;
    return {
      audits: rows.length, cost: cr(sum(rows, 'cost')), ecms: Math.round(sum(rows, 'rn')).toLocaleString('en-IN'),
      rec: cr(ri), ach: cr(sum(rows, 'ii')), co2: Math.round(sum(rows, 'rc')).toLocaleString('en-IN') + ' t',
      kwh: (sum(rows, 'rk') / 1e5).toFixed(1) + ' lakh', payback: Math.max(1, Math.round(months)) + ' months',
    };
  }, [rows]);

  const L = {
    pad: D ? '96px 40px 104px' : T ? '72px 32px 88px' : '56px 16px 72px', gap: D ? 48 : T ? 40 : 32,
    h2: D ? 52 : T ? 42 : 34, lede: D ? 18 : 16, headCols: D ? 'minmax(0, 1.25fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
    kpi: D ? 40 : T ? 36 : 30, kpiPad: D ? '22px' : T ? '20px' : '16px 14px',
    diagCols: D ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
    ioCols: D ? 'minmax(0, 1fr) 40px minmax(0, 1fr) 40px minmax(0, 1.1fr)' : 'minmax(0, 1fr)', ioRot: D ? '0deg' : '90deg',
    stepsCols: D ? 'repeat(4, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', stepGap: D ? 28 : 14,
    pillWrap: (D || T ? 'wrap' : 'nowrap') as 'wrap' | 'nowrap', famCols: D ? 'repeat(6, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
    ctaPad: D ? '28px 32px' : '22px 20px',
  };
  const pills: { k: 'all' | Fam; label: string; count: number; dot: string; d: string }[] = [
    { k: 'all', label: 'All areas', count: AREAS.length, dot: '#2B2644', d: I.scan },
    ...KEYS.map(k => ({ k, label: FAM[k].label, count: AREAS.filter(a => a.fam === k).length, dot: FAM[k].color, d: FAM[k].d })),
  ];
  const chip = (c: string, label: string) => (
    <span style={{ height: 32, padding: '0 12px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E1DEEA', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{label}</span>
  );
  const gain = (v: string, l: string) => (
    <span style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', borderRadius: 12, background: '#FFFFFF' }}><b style={{ fontSize: 17, color: '#0F5F2D' }}>{v}</b><span style={{ fontSize: 11, color: '#3F5F4A' }}>{l}</span></span>
  );
  const ioArrow = (bg: string) => (
    <span aria-hidden="true" style={{ alignSelf: 'center', justifySelf: 'center', width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${L.ioRot})` }}><Svg d={I.arrow} w={2.4} /></span>
  );
  const h3 = (title: string, note: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h3>
      <span style={{ fontSize: 13, color: '#6B6880' }}>{note}</span>
    </div>
  );

  return (
    <section id="scope" className="rd" style={{ background: '#FFFFFF', scrollMarginTop: 72 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: L.gap }}>
        {/* heading and key numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: L.headCols, gap: 32, alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <span className="rd-eyebrow">Scope</span>
            <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>What an audit covers</h2>
            <p style={{ margin: 0, maxWidth: 560, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>Seventeen areas, covering every major energy-using system and utility in the plant — from the grid incomer to the top of the stack.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', border: '1px solid #E7E5EE', borderRadius: 20, overflow: 'hidden', background: '#FAFAFC' }}>
            {[['17', 'Areas covered'], ['12', 'Stops on the plant tour'], ['6', 'Instrument classes']].map(([v, l], k) => (
              <div key={l} style={{ padding: L.kpiPad, display: 'flex', flexDirection: 'column', gap: 4, borderRight: k < 2 ? '1px solid #E7E5EE' : 0 }}>
                <span style={{ fontSize: L.kpi, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: '#2B2644' }}>{v}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#55526A' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* plant tour */}
        <div ref={tourRef} style={{ scrollMarginTop: 96 }}><PlantTour dev={dev} jump={jump} totals={{ audits: fig.audits, recommended: fig.rec, achieved: fig.ach, co2: fig.co2, payback: fig.payback }} /></div>

        {/* diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {h3('Diagnostics run at every stop', 'Four checks the team carries to every part of the plant')}
          <div style={{ display: 'grid', gridTemplateColumns: L.diagCols, gap: 14 }}>
            {DIAG.map(d => (
              <article key={d.n} className="rd-lift" style={{ border: '1px solid #E7E5EE', borderRadius: 18, overflow: 'hidden', background: '#FFFFFF', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ height: 132, background: '#FFFFFF', borderBottom: '1px solid #F0EFF4', position: 'relative' }}>
                  <img src={d.img} alt={d.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10, boxSizing: 'border-box', display: 'block' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, height: 24, padding: '0 8px', borderRadius: 7, background: d.color, color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>{d.n}</span>
                </div>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <b style={{ fontSize: 15 }}>{d.name}</b>
                  <span style={{ fontSize: 13, lineHeight: 1.45, color: '#55526A' }}>{d.what}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* energy in -> audit -> cleaner output */}
        <div style={{ display: 'grid', gridTemplateColumns: L.ioCols, gap: 14, alignItems: 'stretch' }}>
          <div style={{ padding: 22, borderRadius: 22, background: '#F4F3F8', border: '1px solid #E7E5EE', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6880' }}>Energy in</span>
            <b style={{ fontSize: 20, letterSpacing: '-0.02em' }}>What the plant buys</b>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{chip('#EAB308', 'Grid power')}{chip('#D6A35C', 'Fuel')}{chip('#38BDF8', 'Water')}</div>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: '#55526A' }}>{fig.cost} a year of electricity and fuel assessed across {fig.audits} plants.</span>
          </div>
          {ioArrow('#2B2644')}
          <div style={{ padding: 22, borderRadius: 22, background: '#2B2644', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4B8FF' }}>The audit</span>
            <b style={{ fontSize: 20, letterSpacing: '-0.02em' }}>17 areas measured on site</b>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: '#DDDAE6' }}>Calibrated instruments on every utility, then each finding costed as an energy conservation measure with its payback.</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{fig.ecms} measures recommended so far</span>
          </div>
          {ioArrow('#15803D')}
          <div style={{ padding: 22, borderRadius: 22, background: '#E8F5EC', border: '1px solid #BFE3CB', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#0F5F2D' }}>Cleaner output</span>
            <b style={{ fontSize: 20, letterSpacing: '-0.02em', color: '#0F5F2D' }}>What the plant gains</b>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {gain(fig.rec, 'savings a year identified')}{gain(fig.co2, 'CO₂ a year, potential cut')}{gain(fig.kwh, 'kWh a year to save')}{gain(fig.payback, 'average payback')}
            </div>
          </div>
        </div>

        {/* how an audit runs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {h3('How an audit runs', 'Four stages, one team, one report')}
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: L.stepsCols, gap: L.stepGap }}>
            {STEPS.map((s, k) => (
              <li key={s.title} className="rd-step" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: 22, borderRadius: 18, background: '#FFFFFF', border: '1px solid #E7E5EE', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Svg d={s.d} size={22} w={1.9} /></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#8E88A8' }}>Stage {String(k + 1).padStart(2, '0')}</span>
                </div>
                <b style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{s.title}</b>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: '#55526A' }}>{s.text}</span>
                {D && k < STEPS.length - 1 && (
                  <span aria-hidden="true" style={{ position: 'absolute', top: '50%', right: -21, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E7E5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 4px 10px -4px rgba(43,38,68,.25)' }}><Svg d={I.arrow} size={16} stroke="#2B2644" /></span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* the 17 areas, by kind of system: family tiles filter the area cards; each card names the
            plant tour stops that cover it, and a stop button plays that stop in the tour above */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {h3('The 17 areas, by kind of system', 'Pick a family; tap a stop to see it on the tour')}
          <div role="group" aria-label="Filter by kind of system" style={{ display: 'grid', gridTemplateColumns: D ? 'repeat(6, minmax(0, 1fr))' : T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {pills.map(p => {
              const on = active === p.k, fam = p.k === 'all' ? null : FAM[p.k];
              return (
                <button key={p.k} type="button" aria-pressed={on} onClick={() => setActive(on && p.k !== 'all' ? 'all' : p.k)}
                  style={{ position: 'relative', height: D ? 116 : 100, borderRadius: 18, overflow: 'hidden', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: p.k === 'all' ? 'linear-gradient(145deg, #2B2644, #0F0D1A)' : '#1E1A33', border: `2px solid ${on ? p.dot : 'transparent'}`, boxShadow: on ? `0 16px 32px -18px ${p.dot}` : 'none', outlineOffset: 2 }}>
                  {fam && <img src={fam.photo} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: on || active === 'all' ? 1 : 0.5, transition: 'opacity .3s ease' }} />}
                  <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,13,26,.05) 0%, rgba(15,13,26,.88) 100%)' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, width: 28, height: 28, borderRadius: 9, background: p.dot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Svg d={p.d} size={15} /></span>
                  <span style={{ position: 'absolute', left: 12, right: 12, bottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8, color: '#FFFFFF' }}>
                    <b style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{p.label}</b><span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{p.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {active !== 'all' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px', padding: '14px 16px', borderRadius: 16, background: FAM[active].tint, border: `1px solid ${FAM[active].color}33` }}>
              <b style={{ flex: '1 1 260px', fontSize: 16, color: FAM[active].ink }}>{FAM[active].blurb}</b>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6880' }}>Measured with</span>
              {FAM[active].inst.map(x => (
                <span key={x.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', borderRadius: 12, background: '#FFFFFF' }}>
                  <img src={x.img} alt="" loading="lazy" style={{ width: 40, height: 32, objectFit: 'contain' }} />
                  <span style={{ display: 'flex', flexDirection: 'column' }}><b style={{ fontSize: 12.5 }}>{x.name}</b><span style={{ fontSize: 11.5, color: '#5E5B70' }}>{x.models}</span></span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: D ? 'repeat(4, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', gap: 12 }}>
          {AREAS.filter(a => active === 'all' || a.fam === active).map(a => {
            const f = FAM[a.fam];
            return (
              <article key={a.n} className="rd-card" style={{ borderRadius: 18, background: '#FFFFFF', border: '1px solid #E7E5EE', borderTop: `4px solid ${f.color}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, background: f.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Svg d={a.d} size={20} stroke={f.color} w={1.9} /></span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: f.ink }}>{f.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: f.ink, background: f.tint, borderRadius: 8, padding: '4px 8px' }}>{a.n}</span>
                </div>
                <b style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{a.name}</b>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: '#5E5B70' }}>{a.what}</span>
                <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #EEECF3', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6B6880', marginRight: 2 }}>On the tour</span>
                  {STOPS[a.n].map(k => (
                    <button key={k} type="button" onClick={() => toStop(k)} aria-label={`Play stop ${k} of the plant tour: ${STOP_NAME[k]}`}
                      style={{ minHeight: 30, padding: '0 10px', borderRadius: 999, border: `1px solid ${f.color}55`, background: '#FFFFFF', color: f.ink, fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{String(k).padStart(2, '0')} · {STOP_NAME[k]}</button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* call to action */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: L.ctaPad, borderRadius: 22, background: '#F4F3F8', border: '1px solid #E7E5EE' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 320px', minWidth: 0 }}>
            <b style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Run an MSME plant in Gujarat, Rajasthan or Daman?</b>
            <span style={{ fontSize: 14, lineHeight: 1.5, color: '#55526A' }}>The KISEM team audits all seventeen areas on site and hands over a costed list of measures.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="#instruments" className="rd-ghost" style={{ height: 48, padding: '0 18px', borderRadius: 14, border: '1px solid #D4D2DE', background: '#FFFFFF', color: '#0F0D1A', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>See the instruments</a>
            <a href={APPLY_URL} target="_blank" rel="noopener" className="rd-cta" style={{ height: 48, padding: '0 20px', borderRadius: 14, background: '#2B2644', color: '#FFFFFF', textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10 }}>Apply for an audit<Svg d={I.arrow} size={16} /></a>
          </div>
        </div>
        <p style={{ margin: '-24px 0 0', fontSize: 12, lineHeight: 1.5, color: '#6B6880' }}>The tour shows a typical audited plant; losses and measures are the usual ones checked at each stop. Figures are totals across all KISEM audits. Photos from KISEM audits on site.</p>
      </div>
    </section>
  );
}
