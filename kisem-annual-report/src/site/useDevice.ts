import { useEffect, useState } from 'react';

/** The three layouts of the redesign: desktop (1024 px and up), tablet (700 px and up), phone. */
export type Device = 'desktop' | 'tablet' | 'phone';
const pick = (w: number): Device => (w >= 1024 ? 'desktop' : w >= 700 ? 'tablet' : 'phone');

export function useDevice(): Device {
  const [d, setD] = useState<Device>(() => (typeof window === 'undefined' ? 'desktop' : pick(window.innerWidth)));
  useEffect(() => {
    const on = () => setD(pick(window.innerWidth));
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return d;
}
