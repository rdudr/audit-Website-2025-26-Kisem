// A page breaker between the main parts of the page: a soft tinted band with steps of one colour
// shade, light to deep, on each side of the chapter label.
const STEPS = [12, 22, 34, 48, 64, 82, 100];

export function KBreak({ n, label, color }: { n: string; label: string; color: string }) {
  const bar = (rev: boolean) => (
    <span aria-hidden="true" className="kbreak-bar" style={{ flexDirection: rev ? 'row-reverse' : 'row' }}>
      {STEPS.map(p => <span key={p} style={{ background: `color-mix(in srgb, ${color} ${p}%, #FFFFFF)` }} />)}
    </span>
  );
  return (
    <div className="kbreak" role="separator" aria-label={label} style={{ background: `radial-gradient(60% 120% at 50% 50%, color-mix(in srgb, ${color} 10%, transparent), transparent 70%)` }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {bar(false)}
        <span className="kbreak-label" style={{ color: `color-mix(in srgb, ${color} 85%, #0B0A14)`, borderColor: `color-mix(in srgb, ${color} 30%, #FFFFFF)` }}>
          <span className="n" style={{ background: color }}>{n}</span>{label}
        </span>
        {bar(true)}
      </div>
    </div>
  );
}
