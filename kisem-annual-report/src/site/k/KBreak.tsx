// A page breaker between the main parts of the page: a soft tinted band with steps of one colour
// shade, light to deep and back to light. No words on it, only the shades.
const STEPS = [12, 22, 34, 48, 64, 82, 100, 82, 64, 48, 34, 22, 12];

export function KBreak({ color }: { n?: string; label?: string; color: string }) {
  return (
    <div className="kbreak" role="separator" aria-hidden="true" style={{ background: `radial-gradient(60% 120% at 50% 50%, color-mix(in srgb, ${color} 10%, transparent), transparent 70%)` }}>
      <div className="wrap">
        <span className="kbreak-bar">
          {STEPS.map((p, k) => <span key={k} style={{ background: `color-mix(in srgb, ${color} ${p}%, #FFFFFF)` }} />)}
        </span>
      </div>
    </div>
  );
}
