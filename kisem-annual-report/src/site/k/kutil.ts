// Shared numbers and formats for the November 2026 redesign. Every figure is worked out from the
// live audit rows (bundled master sheet + FOX Console), never copied from the design export.
import { n0, data, type Row, type Status } from '../../data';
import { WORKSHOPS_CONDUCTED } from '../content';

export const COUNTS = {
  walkthrough: data.counts.walkthrough,
  clusters: data.counts.clusters,
  iga: data.counts.iga,
  sessions: WORKSHOPS_CONDUCTED,
};

/** "18 Nov 2026" from the sheet's date. */
export const AS_OF = (() => {
  const d = new Date(data.asOf);
  return isNaN(+d) ? data.asOf : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
})();

// Status colours of the redesign: [badge background, badge text, bar].
export const SC: Record<Status, [string, string, string]> = {
  'Implementation verified': ['#E1F0E8', '#0B7A45', '#0B7A45'],
  'Post assessment done': ['#ECEAF8', '#4C3FB0', '#6D5BD0'],
  'Post-audit pending': ['#FDF0DC', '#9A5200', '#D67800'],
  'Report under process': ['#EFEFF2', '#3C3A45', '#A3A1AB'],
};

export const sumK = (k: keyof Row, L: Row[]) => L.reduce((a, r) => a + n0(r[k]), 0);
export const indN = (v: number) => Math.round(v).toLocaleString('en-IN');
export const cr = (v: number) => '₹ ' + (n0(v) / 1e7).toFixed(2) + ' Cr';
export const lakh = (v: number) => (n0(v) / 1e5).toFixed(1);
export const pctS = (a: number, b: number) => (b ? Math.round((100 * a) / b) + '%' : '0%');
export const mon = (d: string | null) => {
  if (!d) return '';
  const x = new Date(d);
  return isNaN(+x) ? '' : x.toLocaleString('en-GB', { month: 'short' }) + ' ' + x.getFullYear();
};

export function totals(R: Row[]) {
  const K = ['rn', 'in', 'ri', 'ii', 'rc', 'ic', 'rk', 'ik', 'e', 'cost', 'rv', 'iv'] as const;
  const T = {} as Record<(typeof K)[number], number>;
  for (const k of K) T[k] = sumK(k, R);
  return T;
}

/** Scroll to a section by id, for buttons that also change a filter. */
export const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** The small arrow dot of the dark pill buttons. */
export const DOT_PATH = 'M4.5 2.5 8 6l-3.5 3.5';
