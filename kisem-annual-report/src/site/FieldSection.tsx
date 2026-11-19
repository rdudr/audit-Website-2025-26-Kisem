import { data } from '../data';
import { useDevice } from './useDevice';

// Instruments and field work (canvas "Component · Instruments and field"): the instruments, the
// "Out on the plant floor" mosaic, GEDA walkthroughs, and measuring on site.
// All photos are the team's own, in public/field/.

const INST = [
  { d: 'M2 12h4l3-8 4 16 3-8h6', img: '/scope/inst-pqa.webp', alt: 'Power quality analysers: Hioki, Krykard ALM and other Class A loggers', name: 'Power quality analyser', models: 'Hioki PQ3198 · Krykard ALM-45/36/31/20', what: 'Class A to IEC 61000-4-30. Harmonics, transients, dips and swells, inrush current and flicker.' },
  { d: 'M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z', img: '/scope/inst-thermal.webp', alt: 'Thermal imaging cameras: Testo, Fluke, Sonel, Metravi and Raytek', name: 'Thermal imaging camera', models: 'Testo T-883/T-872 · Fluke TC01A · Sonel KT-510 · Metravi Ti 20 · Raytek', what: '320 × 240 infrared, −30 °C to 650 °C, for panels, insulation and mechanical systems. Pyrometer for molten metal up to 2000 °C.' },
  { d: 'M8 21h8M12 21v-4M7 4h10l-1 9a4 4 0 0 1-8 0zM9 8h6', img: '/scope/inst-flue.webp', alt: 'Kane flue gas analysers with high-temperature probe', name: 'Flue gas analyser', models: 'Kane K988 with 1250 °C probe · K958', what: 'O₂, CO, CO₂, NO, NO₂, SO₂, H₂S and hydrocarbons together, for combustion efficiency.' },
  { d: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14', img: '/scope/inst-acoustic.webp', alt: 'Acoustic leak detector and compressed air flow meters', name: 'Acoustic leak and flow detection', models: 'Testo LD Pro · VP Flow PN16 · Lutron GS-5800 · Extech RD300', what: 'Finds compressed air and refrigerant leaks by ultrasound, and measures air flow, pressure and temperature on the network.' },
  { d: 'M3 10h18l-2 10H5zM12 10v10M4 15h16M12 2v3M5 5l1.5 1.5M19 5l-1.5 1.5', img: '/scope/inst-solar.webp', alt: 'Solar DC power analyser, irradiance meter and temperature logger', name: 'Solar PV analysis', models: 'Solar DC power analyser · irradiance meter · temperature and humidity logger', what: 'Module and inverter efficiency, performance ratio, and the losses from heat, shading, soiling and cabling.' },
  { d: 'M2 9h20M2 15h20M7 9v6M17 9v6M10 12h4', img: '/scope/inst-flow.webp', alt: 'Endress+Hauser clamp-on ultrasonic flow meter', name: 'Ultrasonic flow meter', models: 'Endress+Hauser', what: 'Clamp-on transit-time flow measurement, without cutting the pipe or stopping the process.' },
];
// [file, title, what, desktop span [cols, rows], tablet span]
const MOSAIC: [string, string, string, [number, number], [number, number]][] = [
  ['boiler-house', 'Boiler house', 'Fuel in, steam out, and the heat lost on the way', [2, 1], [2, 1]],
  ['pq-logging', 'Power quality logging', 'Class A analyser on the incomer, downloaded on site', [1, 2], [1, 1]],
  ['mcc', 'Motor control centre', 'Clamp-on readings on each big feeder', [1, 2], [1, 1]],
  ['pumps', 'Pumps and piping', 'Flow, head and power, read together', [1, 2], [1, 1]],
  ['clamp-on-flow', 'Clamp-on flow', 'Ultrasonic flow on a fuel line, no pipe cut', [1, 2], [1, 1]],
  ['chillers', 'Chillers', 'Chilled water flow and kW per ton of cooling', [1, 2], [1, 1]],
  ['rooftop-solar', 'Rooftop solar', 'Irradiance, module temperature and output', [1, 2], [1, 1]],
  ['cold-storage', 'Cold storage', 'Temperatures and insulation in the cold rooms', [2, 1], [2, 1]],
];
const WALKS = ['Engineer explaining a panel during a walkthrough', 'Engineer at the drive panels', 'Team discussing a chiller on site', 'Discussion with the plant team', 'Walkthrough of a process line', 'Process line with the plant team', 'Machine hall walkthrough', 'Thermal imaging check in a plant', 'Inspecting process machines', 'Furnace line during a walkthrough', 'Process hall walkthrough', 'Hot billet coming out of a furnace', 'Team photo at a plant visit', 'Distribution transformer on site', 'Cooling tower fan deck', 'Induction furnace crucible'];
// Six of the sixteen, to keep the page short (photos 01 and 12 taken out at the team's request).
// Six fill the grid evenly: three across on desktop and tablet, two across on phones.
const WALK_PICK = [3, 4, 5, 8, 10, 13];
const MEASURES: [string, string, string][] = [
  ['power-quality', 'Power quality logging', 'Analyser on the incomer, read live on a laptop'],
  ['mcc-panel', 'Panel measurements', 'Clamp-on readings at the motor control centre'],
  ['pipe-sensors', 'Pipe flow and temperature', 'Sensors clamped on a live line'],
  ['thermal-imaging', 'Thermal imaging', 'Checking a cold store for heat gain'],
  ['rooftop-check', 'Rooftop solar', 'Irradiance and module checks on the roof'],
  ['flow-meter', 'Ultrasonic flow meter', 'Clamp-on flow, no pipe cut or shutdown'],
  ['pump-house', 'Pump house', 'Flow, head and power measured together'],
];

export default function FieldSection() {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const L = {
    band: D ? '88px 40px' : T ? '72px 32px' : '56px 16px', pad: D ? '104px 40px 0' : T ? '80px 32px 0' : '64px 16px 0',
    h2: D ? 48 : T ? 40 : 32, lede: D ? 18 : 16,
    iCols: D ? 'repeat(3, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', iImg: D ? 220 : 200,
    cCols: D ? 'repeat(4, minmax(0, 1fr))' : T ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', cRow: D ? 240 : T ? 260 : 300,
    wCols: D || T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
    mCols: D ? 'repeat(7, minmax(0, 1fr))' : T ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
  };
  const chip = (dot: string, t: string) => <span style={{ height: 34, padding: '0 12px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E1DEEA', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />{t}</span>;
  const h3 = (t: string, p: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{t}</h3>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#55526A' }}>{p}</p>
    </div>
  );

  return (
    <div className="rd">
      <section id="instruments" style={{ background: '#F4F3F8', scrollMarginTop: 72, marginTop: D ? 104 : T ? 80 : 64 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: L.band, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
              <span className="rd-eyebrow">Instruments</span>
              <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>What we measure with</h2>
              <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>Calibrated, Class A where it matters, and carried to every plant. Readings are logged on site, not estimated.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{chip('#5B3FD6', `${INST.length} instrument classes`)}{chip('#15803D', 'IEC 61000-4-30 Class A')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: L.iCols, gap: 18 }}>
            {INST.map((x, i) => (
              <article key={x.name} className="rd-lift rd-card" style={{ background: '#FFFFFF', border: '1px solid #E7E5EE', borderRadius: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ position: 'relative', height: L.iImg, background: '#FFFFFF', overflow: 'hidden', borderBottom: '1px solid #F0EFF4' }}>
                  <img src={x.img} alt={x.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 14, boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', top: 14, left: 14, width: 40, height: 40, borderRadius: 12, background: '#2B2644', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={x.d} /></svg>
                  </span>
                  <span style={{ position: 'absolute', top: 18, right: 14, fontSize: 12, fontWeight: 700, color: '#8E88A8', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{x.name}</h3>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4C35B8' }}>{x.models}</span>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#55526A' }}>{x.what}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
          <span className="rd-eyebrow">How we measure</span>
          <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>Out on the plant floor</h2>
          <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>Every detailed audit means days on site: logging the supply, imaging panels and steam lines, and testing compressors, pumps, chillers and solar.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: L.cCols, gridAutoRows: L.cRow, gap: 12 }}>
          {MOSAIC.map(([f, title, what, d, t]) => {
            const s = D ? d : T ? t : [1, 1];
            return (
              <figure key={f} className="rd-card" style={{ margin: 0, position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#1E1A33', gridColumn: `span ${s[0]}`, gridRow: `span ${s[1]}` }}>
                <img src={`/field/mosaic/${f}.webp`} alt={`${title}: ${what}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,13,26,0) 45%, rgba(15,13,26,.85) 100%)' }} />
                <figcaption style={{ position: 'absolute', left: 18, right: 18, bottom: 16, display: 'flex', flexDirection: 'column', gap: 3, color: '#FFFFFF' }}>
                  <b style={{ fontSize: 16, fontWeight: 700 }}>{title}</b><span style={{ fontSize: 13, lineHeight: 1.4, color: '#DDDAE6' }}>{what}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#6B6880' }}>Photos from KISEM audits on site.</p>

        <div id="walkthroughs" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            {h3('Walkthrough audits with GEDA', 'One-day plant visits that find the quick wins: compressors, furnaces, drives, chillers and the lines that feed them.')}
            <span style={{ height: 34, padding: '0 14px', borderRadius: 999, background: '#2B2644', color: '#FFFFFF', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>{data.counts.walkthrough} walkthrough energy audits</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: L.wCols, gap: 8 }}>
            {WALK_PICK.map(n => {
              return (
              <div key={n} className="rd-card" style={{ aspectRatio: '3 / 2', borderRadius: 12, overflow: 'hidden', background: '#ECEAF2' }}><img src={`/field/walk/${String(n).padStart(2, '0')}.webp`} alt={WALKS[n - 1]} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              );
            })}
          </div>
        </div>

        <div id="on-site" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 40 }}>
          {h3('Measuring on site', 'The team logging power, flow and heat during detailed audits, with the plant running as usual.')}
          <div style={{ display: 'grid', gridTemplateColumns: L.mCols, gap: 12 }}>
            {MEASURES.map(([f, title, what]) => (
              <figure key={f} className="rd-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', borderRadius: 18, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E7E5EE' }}>
                <div style={{ aspectRatio: '3 / 4', overflow: 'hidden', background: '#ECEAF2' }}><img src={`/field/${f}.webp`} alt={`${title}: ${what}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
                <figcaption style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 14, fontWeight: 700 }}>{title}</b><span style={{ fontSize: 12.5, lineHeight: 1.45, color: '#55526A' }}>{what}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
