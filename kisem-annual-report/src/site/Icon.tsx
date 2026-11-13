export function Icon({ d, size = 16, stroke = 'currentColor', width = 2, label }: { d: string; size?: number; stroke?: string; width?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width}
      strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <path d={d} />
    </svg>
  );
}

/** Two-tone icon: a tinted layer `d2` under the line drawing `d` (hero figures). */
export function DuoIcon({ d, d2, size = 28 }: { d: string; d2: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={d2} fill="rgba(228,222,255,.22)" stroke="#E4DEFF" strokeWidth={1.5} />
      <path d={d} stroke="#FFFFFF" strokeWidth={1.6} />
    </svg>
  );
}
