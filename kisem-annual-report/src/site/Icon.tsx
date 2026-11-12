export function Icon({ d, size = 16, stroke = 'currentColor', width = 2, label }: { d: string; size?: number; stroke?: string; width?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width}
      strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <path d={d} />
    </svg>
  );
}
