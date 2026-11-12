import { useEffect, useRef, useState } from 'react';

const reduced = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

/**
 * Counts from 0 to 1 (ease-out) the first time the element scrolls into view, then stays at 1.
 * Multiply a figure by the returned value to count it up. Reduced motion: 1 straight away.
 */
export function useCountUp<T extends Element>(duration = 1600): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(() => (reduced() ? 1 : 0));
  useEffect(() => {
    if (p === 1) return;
    const el = ref.current;
    let raf = 0, timer = 0;
    const run = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        const x = Math.min(1, (t - t0) / duration);
        setP(1 - Math.pow(1 - x, 3));
        if (x < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      // A hidden tab does not run animation frames: never leave a figure stuck part-way.
      timer = window.setTimeout(() => setP(1), duration + 1200);
    };
    if (!el || typeof IntersectionObserver === 'undefined') { run(); return () => { cancelAnimationFrame(raf); clearTimeout(timer); }; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); run(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, p];
}

/** Closes an overlay with Escape and keeps page scroll from moving underneath it. */
export function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = prev; };
  }, [open, onClose]);
}
