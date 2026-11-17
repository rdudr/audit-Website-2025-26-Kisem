import { useEffect, useMemo, useState } from 'react';
import type { Device } from './useDevice';

// The plant tour, frame by frame (canvas "Component · Plant tour player"): eleven frames from the
// incomer to the stack, auto-playing, with hotspots on the photos. All photos are the team's own,
// in public/scope/. Frames without a photo of our own show their facts on a dark panel.

const C = { elec: '#5B3FD6', heat: '#B3261E', air: '#0F766E', flow: '#1D5BD8', green: '#15803D' } as const;
const A: Record<string, [string, keyof typeof C]> = {
  '01': ['Electrical systems', 'elec'], '02': ['Thermal systems', 'heat'], '03': ['Refrigeration', 'air'], '04': ['Compressed air', 'air'],
  '05': ['Solar PV', 'green'], '06': ['Pumping systems', 'flow'], '07': ['Process heat', 'heat'], '08': ['HVAC and ventilation', 'air'],
  '09': ['Lighting', 'elec'], '10': ['Power quality', 'elec'], '11': ['Thermal imaging', 'heat'], '12': ['Flue gas analysis', 'heat'],
  '13': ['Flow measurement', 'flow'], '14': ['Acoustic imaging', 'air'], '15': ['GHG accounting', 'green'], '16': ['Variable speed drives', 'elec'], '17': ['Waste heat recovery', 'heat'],
};
// [src, width / height, fit, alt]
const IMG: Record<string, [string, number, 'contain' | 'cover', string]> = {
  panel: ['/scope/mcc.webp', 0.806, 'contain', 'KISEM engineer clamping on at a motor control centre, power quality analyser on the floor'],
  pq: ['/scope/pq-logging.webp', 0.605, 'contain', 'Class A power quality analyser logging at the incomer, with a laptop download'],
  solar: ['/scope/solar-roof.webp', 0.789, 'contain', 'KISEM engineer measuring on a rooftop solar plant'],
  boiler: ['/scope/boiler-house.webp', 1.537, 'cover', 'Boiler house at an audited plant'],
  chiller: ['/scope/chiller.webp', 0.801, 'contain', 'KISEM engineer fitting a clamp-on flow meter on a chiller line'],
  pumps: ['/scope/pumps.webp', 0.823, 'contain', 'KISEM team checking pumps and piping on site'],
  hall: ['/scope/machine-hall.webp', 1.78, 'cover', 'Production hall during a KISEM walkthrough'],
};
const INS: Record<string, [string, string, string]> = {
  pqa: ['/scope/inst-pqa.webp', 'Power quality analyser', 'Hioki PQ3198 · Krykard ALM · Class A'],
  thermal: ['/scope/inst-thermal.webp', 'Thermal imaging camera', 'Testo T-883/T-872 · Fluke TC01A'],
  acoustic: ['/scope/inst-acoustic.webp', 'Acoustic leak and flow detection', 'Testo LD Pro · VP Flow PN16'],
  flow: ['/scope/inst-flow.webp', 'Ultrasonic flow meter', 'Endress+Hauser, clamp-on'],
  solar: ['/scope/inst-solar.webp', 'Solar PV analysis kit', 'DC power analyser · irradiance meter'],
};
const STACK = 'M9 22V8l1-6h4l1 6v14M5 22h14M9 12h6M9 17h6';
const AIR = 'M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2';

type HS = [number, number, string, string, ('L' | 'R')?, number?];
type Kind = 'overview' | 'photo' | 'info' | 'output';
// [kind, img, kicker, title, short, tag, story, areas, look, rec, inst, hotspots, info icon]
type Frame = [Kind, string | null, string, string, string, string, string, string[], string, string, string | null, HS[], string?];
const F: Frame[] = [
  ['overview', null, 'INTRODUCTION', 'One plant, every utility', 'The route', '', 'An audit follows energy the way the plant uses it: in at the incomer, through the power quality of the supply, boilers, compressors, chillers and pumps, into the machines, and out at the stack. Nine stops, seventeen areas.', [], '', '', null, []],
  ['photo', 'panel', 'STOP 01 · POWER IN', 'The main panel and motor feeders', 'Power in', 'MCC-01 · MOTOR CONTROL CENTRE', 'Every unit the plant buys passes through its panels. Our engineers clamp on at the incomer and the big motor feeders, so loading, losses and drive opportunities are measured, not assumed.', ['01', '16'], 'Transformer losses at low load, motors running part-loaded at fixed speed, costly DG units.', 'Load balancing, VFDs, IE3 or IE4 motors, right-sizing, DG optimisation.', 'pqa',
    [[52, 40, 'Clamp-on at the feeders', 'Current, kW and load of each big motor'], [40, 74, 'Analyser on the floor', 'Logging through the production cycle'], [42, 16, 'Drives and starters', 'Where VFDs can pay back']]],
  ['photo', 'pq', 'STOP 02 · POWER QUALITY', 'Power quality at the incomer', 'Power quality', 'PQA · CLASS A, IEC 61000-4-30', 'A Class A analyser sits on the incomer for a full production cycle. It records voltage, current, power factor and harmonics on every phase, and captures each dip, swell and transient as it happens.', ['10'], 'Low power factor, harmonics from drives, voltage dips that trip machines, phase unbalance.', 'APFC panels, harmonic filters, soft starters or VFDs on large motors, load rebalancing.', 'pqa',
    [[82, 56, 'Class A analyser', 'V, I, kW, kVA, PF and THD on L1–L3'], [36, 52, 'Voltage and current leads', 'On the incoming busbar and cables'], [58, 78, 'Laptop download', 'Trends, harmonics and the event log']]],
  ['photo', 'solar', 'STOP 03 · GENERATION', 'Solar on the roof', 'Solar PV', 'SPV-01 · ROOFTOP ARRAY', 'Where a plant generates its own power, we check how much of the sunlight becomes useful electricity and where the rest is lost.', ['05'], 'Low performance ratio, soiling, shading, string mismatch and inverter losses.', 'Cleaning schedule, re-stringing, new capacity where the roof allows.', 'solar',
    [[33, 45, 'Irradiance and module temperature', 'Logged alongside the output'], [72, 72, 'Module rows', 'Soiling, shading, module health'], [60, 52, 'Roof layout', 'Space for new capacity']]],
  ['photo', 'boiler', 'STOP 04 · HEAT', 'Boilers, steam and process heat', 'Heat', 'BL-01 · BOILER HOUSE', 'Fuel becomes steam or hot oil here, and travels to the process. We measure what goes in, what comes out, and what escapes from surfaces, traps and lines.', ['02', '07', '11'], 'Low combustion efficiency, bare steam lines, failed traps, poor condensate return.', 'Combustion tuning, insulation, trap replacement, condensate recovery.', 'thermal',
    [[54, 52, 'Boiler and steam drum', 'Fuel in, steam out, efficiency'], [60, 26, 'Flue ducting', 'Heat leaving towards the stack'], [24, 66, 'Fuel handling', 'Fuel flow and specific consumption']]],
  ['info', 'boiler', 'STOP 05 · THE STACK', 'What leaves through the chimney', 'Stack', 'ST-01 · STACK AND FLUE GAS', 'Hot flue gas is fuel that was paid for and not used. A probe in the stack shows how well the burner mixes air and fuel, and how much heat could be recovered.', ['12', '17', '15'], 'Excess air, high stack temperature, no record of the plant’s emissions.', 'Air–fuel ratio control, economisers and air preheaters, an emissions baseline.', null,
    [[0, 0, 'O₂ · CO · CO₂', 'How well the burner mixes air and fuel'], [0, 0, 'Stack temperature', 'Heat leaving that could be recovered'], [0, 0, 'Scope 1 and 2 emissions', 'A baseline for the plant’s carbon']], STACK],
  ['info', null, 'STOP 06 · COMPRESSED AIR', 'The compressor house', 'Air', 'AC-01 · AIR COMPRESSORS', 'Compressed air is one of the costliest utilities in a plant, and much of it is lost to leaks. We test the compressor and listen to the network with ultrasound.', ['04', '14'], 'Leaks, a pressure set-point higher than the process needs, long unload running.', 'Leak sealing, pressure reduction, a VFD or right-sized compressor.', 'acoustic',
    [[0, 0, 'Free air delivery', 'What the compressor really delivers, load and unload'], [0, 0, 'Leaks, by ultrasound', 'Heard and tagged along the network'], [0, 0, 'Pressure set-point', 'Each 1 bar lower saves about 7 % of power']], AIR],
  ['photo', 'chiller', 'STOP 07 · COOLING', 'Chillers and cold rooms', 'Cooling', 'CH-01 · AIR-COOLED CHILLER', 'Chilled water keeps the process, the cold rooms and the people at temperature. We clamp flow meters on the lines and work out what each ton of cooling costs in power.', ['03', '08'], 'High kW per ton, fouled condensers, poor set-points, no flow balancing.', 'Set-point optimisation, condenser cleaning, efficient fans and pumps.', 'flow',
    [[50, 60, 'Clamp-on flow meter', 'Chilled water flow, no pipe cut'], [24, 16, 'Air-cooled condenser', 'Approach and fan power'], [86, 64, 'Strainer and pump line', 'Pressure drop and pumping']]],
  ['photo', 'pumps', 'STOP 08 · WATER', 'Pumps and piping', 'Pumps', 'PU-01 · PUMP HOUSE', 'Pumps run for long hours and are often far larger than the duty needs. We measure flow, head and power together to find the pump’s real efficiency.', ['06', '13'], 'Oversized pumps, throttled valves, piping losses.', 'Impeller trimming, efficient pumps, VFDs.', 'flow',
    [[88, 26, 'Pump motor', 'Power and loading'], [55, 44, 'Readings on site', 'Flow, head and power together'], [22, 30, 'Valves and piping', 'Throttling and friction losses']]],
  ['photo', 'hall', 'STOP 09 · END USE', 'The production floor', 'Production', 'MD-01 · PRODUCTION HALL', 'This is where the energy finally does work. We log the large motors over a production cycle and check the lighting and ventilation of the hall.', ['09'], 'Old light fittings, lights on in daylight, fans running without control.', 'LED retrofit, daylight use, sensors and timers, controls on ventilation.', 'pqa',
    [[22, 62, 'Process machines', 'Load profile over the shift'], [74, 60, 'Drives and motors', 'Running hours and load'], [50, 14, 'Roof lights and daylight', 'Lux, connected load, hours']]],
  ['output', null, 'THE OUTPUT', 'A costed list of measures', 'Report', '', 'Every finding becomes an energy conservation measure, with its saving in rupees, kWh and CO₂, the investment and the payback. Three to five months later we go back and record what the plant carried out.', [], '', '', null, []],
];
const DUR = 8000;
const PHOTO_KEYS = Object.keys(IMG);

export type TourTotals = { audits: number; recommended: string; achieved: string; co2: string; payback: string };

export default function PlantTour({ dev, totals }: { dev: Device; totals: TourTotals }) {
  const D = dev === 'desktop', T = dev === 'tablet';
  const total = F.length;
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(() => !(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT(x => x + 100), 100);
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => { if (t >= DUR) { setI(x => (x + 1) % total); setT(0); } }, [t, total]);
  const go = (k: number) => { setI(k); setT(0); };

  const RC = D || T ? 1.6 : 4 / 3;
  const [kind, imgKey, kicker, title, , tag, story, areas, look, rec, instKey, hs, infoIcon] = F[i];

  const hsV = useMemo(() => {
    const toC = (x: number, y: number, key: string) => {
      const [, ri, fit] = IMG[key]; let cx = x / 100, cy = y / 100;
      if (fit === 'contain') { if (ri < RC) cx = (cx - 0.5) * (ri / RC) + 0.5; else cy = (cy - 0.5) * (RC / ri) + 0.5; }
      else { if (ri < RC) cy = (cy - 0.5) * (RC / ri) + 0.5; else cx = (cx - 0.5) * (ri / RC) + 0.5; }
      return [Math.max(5, Math.min(95, cx * 100)), Math.max(10, Math.min(88, cy * 100))];
    };
    type H = { k: number; t: string; s: string; x?: string; y?: string; delay?: string; side?: string; cx?: number; cy?: number; ty?: number; lyN?: number; x1?: string; y1?: string; x2?: string; y2?: string; ly?: string; boxLeft?: string; boxRight?: string; ovS?: string; ovY?: number };
    const out: H[] = kind === 'photo' && imgKey
      ? hs.map(([x, y, ht, hsub, ovS, ovY], k) => { const [cx, cy] = toC(x, y, imgKey); return { k: k + 1, x: cx.toFixed(1) + '%', y: cy.toFixed(1) + '%', t: ht, s: hsub, delay: (0.3 + k * 0.35) + 's', cx, cy, ovS, ovY }; })
      : hs.map(([, , ht, hsub], k) => ({ k: k + 1, t: ht, s: hsub }));
    if (kind === 'photo' && (D || T)) {
      const COL = 27, GAP = 19;
      out.forEach(h => {
        const side = h.cx! < 50 ? 'L' : 'R';
        const inCol = side === 'L' ? h.cx! < COL + 6 : h.cx! > 100 - COL - 6;
        h.side = h.ovS || side; h.ty = h.ovY != null ? h.ovY : (inCol ? (h.cy! >= 32 ? h.cy! - 18 : h.cy! + 18) : h.cy!);
      });
      (['L', 'R'] as const).forEach(sd => {
        const g = out.filter(h => h.side === sd).sort((a, b) => a.ty! - b.ty!);
        let prev = -100; g.forEach(h => { h.lyN = Math.max(h.ty!, prev + GAP, 9); prev = h.lyN; });
        const over = g.length ? g[g.length - 1].lyN! - 88 : 0;
        if (over > 0) g.forEach(h => { h.lyN! -= over; });
      });
      out.forEach(h => {
        const ex = h.side === 'L' ? 2 + COL : 98 - COL;
        const x1 = ex * RC, y1 = h.lyN!, X2 = h.cx! * RC, Y2 = h.cy!;
        const dx = X2 - x1, dy = Y2 - y1, len = Math.max(0.01, Math.hypot(dx, dy)), cut = Math.min(len * 0.9, 2.6);
        Object.assign(h, { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: (X2 - dx / len * cut).toFixed(2), y2: (Y2 - dy / len * cut).toFixed(2),
          ly: h.lyN!.toFixed(1) + '%', boxLeft: h.side === 'L' ? '2%' : 'auto', boxRight: h.side === 'R' ? '2%' : 'auto' });
      });
    }
    return out;
  }, [kind, imgKey, hs, D, T, RC]);

  const inst = instKey ? INS[instKey] : null;
  const L = {
    radius: D ? '24px' : '20px', aspect: D || T ? '16 / 10' : '4 / 3', barPad: D ? '18px 24px 10px' : '14px 16px 8px',
    cols: D ? 'minmax(0, 1.5fr) minmax(0, 1fr)' : 'minmax(0, 1fr)', panelPad: D ? '26px 28px' : T ? '22px 24px' : '18px 16px',
    panelBorder: D ? '1px solid rgba(255,255,255,.08)' : '0', title: D ? 30 : T ? 26 : 22,
    twoCols: T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', legend: D || T, phoneList: !D && !T,
    infoCols: D || T ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1fr)', infoNum: D ? 20 : T ? 18 : 14,
    cap: D ? 18 : 12, ovPad: D ? 28 : T ? 22 : 14, ovRatio: D || T ? '4 / 3' : '1 / 1', ovFont: D ? 12 : T ? 11 : 8,
    outPad: D ? 16 : 10, outNum: D ? 30 : T ? 26 : 18, film: D || T, filmSide: D ? 24 : 16,
  };
  const mono = 'rd-mono';
  const outs = [
    { v: totals.recommended, l: 'annual savings identified' }, { v: totals.achieved, l: 'already achieved by plants' },
    { v: totals.co2, l: 'CO₂ a year, reduction potential' }, { v: totals.payback, l: 'average payback' },
  ];
  const next = F[(i + 1) % total][3];
  const routeFrames = F.slice(1, total - 1);

  return (
    <div className={`rd${playing ? '' : ' tour-paused'}`} style={{ color: '#FFFFFF', background: '#12101F', borderRadius: L.radius, overflow: 'hidden', border: '1px solid #2A2540', boxShadow: '0 40px 80px -48px rgba(30,26,51,.75)' }}>
      {/* top bar */}
      <div style={{ padding: L.barPad, display: 'flex', flexDirection: 'column', gap: 14, background: '#17142A', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className={mono} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#A796FF' }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#F87171' }} />Plant tour · supply to stack</span>
          <span className={mono} style={{ fontSize: 12, fontWeight: 700, color: '#C9C5D6' }}>FRAME {String(i + 1).padStart(2, '0')} / {total}</span>
        </div>
        <div role="tablist" aria-label="Frames" style={{ display: 'grid', gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`, gap: 6 }}>
          {F.map((x, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Frame ${k + 1}: ${x[3]}`} onClick={() => go(k)} style={{ height: 18, padding: '7px 0', border: 0, background: 'transparent', cursor: 'pointer', display: 'block' }}>
              <span style={{ display: 'block', height: 4, borderRadius: 999, background: 'rgba(255,255,255,.16)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: k < i ? '100%' : k === i ? (100 * t / DUR).toFixed(1) + '%' : '0%', background: '#C4B8FF', borderRadius: 999 }} /></span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: L.cols, alignItems: 'stretch' }}>
        {/* stage */}
        <div style={{ position: 'relative', width: '100%', alignSelf: 'start', aspectRatio: L.aspect, overflow: 'hidden', background: '#0B0A14', minWidth: 0 }}>
          {PHOTO_KEYS.map(k => (
            <div key={k} style={{ position: 'absolute', inset: 0, opacity: kind === 'photo' && imgKey === k ? 1 : 0, transition: 'opacity .9s ease' }}>
              <img src={IMG[k][0]} alt="" aria-hidden="true" loading="lazy" style={{ position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', display: 'block', filter: 'blur(28px) brightness(.45) saturate(1.1)' }} />
              <img src={IMG[k][0]} alt={kind === 'photo' && imgKey === k ? IMG[k][3] : ''} className="kb" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: IMG[k][2], display: 'block' }} />
            </div>
          ))}

          {kind === 'photo' && (
            <>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,20,.45) 0%, rgba(11,10,20,0) 30%, rgba(11,10,20,0) 60%, rgba(11,10,20,.75) 100%)' }} />
              <span className={mono} style={{ position: 'absolute', left: L.cap, top: L.cap - 2, display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 10px', borderRadius: 8, background: 'rgba(11,10,20,.72)', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#ECEAF2' }}>{tag}</span>
              {hsV.map(h => (
                <div key={`${i}-d${h.k}`} className="hs-in" style={{ position: 'absolute', left: h.x, top: h.y, width: 0, height: 0, animationDelay: h.delay }}>
                  <span className={`hs-dot ${mono}`} style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: '#C4B8FF', border: '3px solid #12101F', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#12101F' }}>{h.k}</span>
                </div>
              ))}
              {L.legend && (
                <>
                  <svg viewBox={`0 0 ${(RC * 100).toFixed(1)} 100`} preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                    <defs><marker id="hsArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#C4B8FF" /></marker></defs>
                    {hsV.map(h => (
                      <g key={`${i}-l${h.k}`}>
                        <line className="hs-in" x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2} stroke="#C4B8FF" strokeWidth={1.6} vectorEffect="non-scaling-stroke" markerEnd="url(#hsArrow)" style={{ animationDelay: h.delay }} />
                        <circle cx={h.x1} cy={h.y1} r={0.7} fill="#C4B8FF" />
                      </g>
                    ))}
                  </svg>
                  {hsV.map(h => (
                    <div key={`${i}-b${h.k}`} className="hs-in" style={{ position: 'absolute', left: h.boxLeft, right: h.boxRight, top: h.ly, width: '27%', transform: 'translateY(-50%)', padding: '9px 11px', boxSizing: 'border-box', borderRadius: 11, background: 'rgba(18,16,31,.88)', border: '1px solid rgba(196,184,255,.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', gap: 9, alignItems: 'flex-start', animationDelay: h.delay }}>
                      <span className={mono} style={{ width: 20, height: 20, borderRadius: '50%', background: '#C4B8FF', color: '#12101F', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{h.k}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}><b style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25 }}>{h.t}</b><span style={{ fontSize: 11, lineHeight: 1.35, color: '#DDDAE6' }}>{h.s}</span></span>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {kind === 'overview' && (
            <div style={{ position: 'absolute', inset: 0, padding: L.ovPad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, background: 'radial-gradient(circle at 80% 10%, rgba(167,150,255,.18), rgba(18,16,31,0) 55%), #12101F' }}>
              <span className={mono} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#A796FF' }}>THE ROUTE THROUGH THE PLANT</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
                {routeFrames.map((x, k) => (
                  <button key={k} type="button" onClick={() => go(k + 1)} style={{ position: 'relative', aspectRatio: L.ovRatio, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.14)', padding: 0, cursor: 'pointer', background: '#2B2644', fontFamily: 'inherit' }}>
                    {x[1] && <img src={IMG[x[1]][0]} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,20,0) 35%, rgba(11,10,20,.9) 100%)' }} />
                    <span style={{ position: 'absolute', left: 8, right: 8, bottom: 7, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, textAlign: 'left' }}>
                      <span className={mono} style={{ fontSize: 10, fontWeight: 700, color: '#C4B8FF' }}>{String(k + 2).padStart(2, '0')}</span>
                      <b style={{ fontSize: L.ovFont, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15 }}>{x[3]}</b>
                    </span>
                  </button>
                ))}
              </div>
              <div className={mono} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, color: '#C9C5D6', flexWrap: 'wrap' }}>
                {[['POWER', '#FDE68A'], ['POWER QUALITY', '#C4B8FF'], ['HEAT', '#FCA5A5'], ['STACK', '#C9C5D6'], ['AIR', '#5EEAD4'], ['COOLING', '#7DD3FC'], ['PUMPS', '#7DD3FC'], ['PRODUCTION', '#DDDAE6'], ['REPORT', '#86EFAC']].map(([w, c], k) => (
                  <span key={w} style={{ display: 'contents' }}>{k > 0 && <span>→</span>}<span style={{ color: c }}>{w}</span></span>
                ))}
              </div>
            </div>
          )}

          {kind === 'info' && (
            <div style={{ position: 'absolute', inset: 0, padding: L.ovPad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, background: 'radial-gradient(circle at 75% 10%, rgba(248,113,113,.18), rgba(18,16,31,0) 55%), #12101F' }}>
              <span className={mono} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#FCA5A5' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={infoIcon || STACK} /></svg>{tag}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: L.infoCols, gap: 10 }}>
                {hsV.map(h => (
                  <div key={h.k} style={{ padding: L.outPad, borderRadius: 14, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(248,113,113,.25)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span className={mono} style={{ width: 26, height: 26, borderRadius: '50%', background: '#FCA5A5', color: '#12101F', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.k}</span>
                    <b style={{ fontSize: L.infoNum, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#FFFFFF' }}>{h.t}</b>
                    <span style={{ fontSize: 12, lineHeight: 1.4, color: '#DDDAE6' }}>{h.s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kind === 'output' && (
            <div style={{ position: 'absolute', inset: 0, padding: L.ovPad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, background: 'radial-gradient(circle at 20% 0%, rgba(74,222,128,.22), rgba(18,16,31,0) 55%), #0E1F17' }}>
              <span className={mono} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#86EFAC' }}>ACROSS {totals.audits} DETAILED AUDITS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {outs.map(o => (
                  <div key={o.l} style={{ padding: L.outPad, borderRadius: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(134,239,172,.25)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <b style={{ fontSize: L.outNum, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: '#FFFFFF' }}>{o.v}</b>
                    <span style={{ fontSize: 12, color: '#BBF7D0' }}>{o.l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* story panel */}
        <div style={{ padding: L.panelPad, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, background: '#12101F', borderLeft: L.panelBorder }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-live="polite">
            <span className={mono} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#A796FF' }}>{kicker}</span>
            <h3 style={{ margin: 0, fontSize: L.title, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#FFFFFF' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#DDDAE6' }}>{story}</p>
          </div>
          {areas.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {areas.map(n => <span key={n} style={{ height: 28, padding: '0 10px', borderRadius: 8, background: C[A[n][1]], fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className={mono}>{n}</span>{A[n][0]}</span>)}
            </div>
          )}
          {look && (
            <div style={{ display: 'grid', gridTemplateColumns: L.twoCols, gap: 10 }}>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.3)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className={mono} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#FCA5A5' }}>LOSSES WE LOOK FOR</span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: '#ECEAF2' }}>{look}</span>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.3)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className={mono} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#86EFAC' }}>MEASURES WE RECOMMEND</span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: '#ECEAF2' }}>{rec}</span>
              </div>
            </div>
          )}
          {inst && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
              <span style={{ width: 64, height: 48, borderRadius: 8, background: '#FFFFFF', overflow: 'hidden', flexShrink: 0 }}><img src={inst[0]} alt={inst[1]} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}><span className={mono} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#C9C5D6' }}>INSTRUMENT ON SITE</span><b style={{ fontSize: 13 }}>{inst[1]}</b><span style={{ fontSize: 12, color: '#C9C5D6' }}>{inst[2]}</span></span>
            </div>
          )}
          {L.phoneList && kind === 'photo' && (
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hsV.map(h => (
                <li key={h.k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className={mono} style={{ width: 22, height: 22, borderRadius: '50%', background: '#C4B8FF', color: '#12101F', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{h.k}</span><span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}><b style={{ fontSize: 13 }}>{h.t}</b><span style={{ fontSize: 12, color: '#C9C5D6' }}>{h.s}</span></span></li>
              ))}
            </ol>
          )}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6 }}>
            <button type="button" onClick={() => go((i + total - 1) % total)} aria-label="Previous frame" style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg></button>
            <button type="button" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause the tour' : 'Play the tour'} style={{ height: 44, padding: '0 16px', borderRadius: 12, border: 0, background: '#FFFFFF', color: '#12101F', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="#12101F" aria-hidden="true"><path d={playing ? 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' : 'M8 5l11 7-11 7z'} /></svg>{playing ? 'Pause' : 'Play'}</button>
            <button type="button" onClick={() => go((i + 1) % total)} aria-label="Next frame" style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></button>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8E88A8' }}>Next: {next}</span>
          </div>
        </div>
      </div>

      {L.film && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`, gap: 8, padding: `14px ${L.filmSide}px 16px`, borderTop: '1px solid rgba(255,255,255,.08)', background: '#17142A' }}>
          {F.map((x, k) => (
            <button key={k} type="button" className="rd-film" onClick={() => go(k)} aria-label={x[3]} style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 10, overflow: 'hidden', padding: 0, cursor: 'pointer', border: `2px solid ${k === i ? '#C4B8FF' : 'rgba(255,255,255,.1)'}`, opacity: k === i ? 1 : 0.6, background: x[0] === 'output' ? '#14532D' : '#2B2644', fontFamily: 'inherit' }}>
              {x[1] && <img src={IMG[x[1]][0]} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,20,.1), rgba(11,10,20,.85))' }} />
              <span style={{ position: 'absolute', left: 7, right: 6, bottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span className="rd-mono" style={{ fontSize: 9, fontWeight: 700, color: '#C4B8FF' }}>{String(k + 1).padStart(2, '0')}</span>
                <b style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15 }}>{x[4]}</b>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
