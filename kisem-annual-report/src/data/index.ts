// The website's audit data. `audits.json` is written by scripts/parse-excel.cjs from the master
// data sheet and holds no company names, plant addresses or plant contacts. Names come from
// FOX Console, and only after a team member signs in (src/lib/console.ts).
import bundled from './audits.json';

export type Status = 'Implementation verified' | 'Post-audit pending' | 'Report under process';

/** One audit. Short keys, the same ones FOX Console and the master Excel use. */
export interface Row {
  c: string;          // audit number, e.g. 26-27/3
  fy: string;         // 2026-27
  s: string;          // sector group (cleaned)
  sr: string;         // sector as written in the master sheet
  p: string;          // products
  ci: string;         // city / district
  stt: string;        // state
  dt: string | null;  // audit start date, YYYY-MM-DD
  dy: number | null;  // audit days
  u: string;          // utilities assessed
  kva: number | null;
  e: number | null; f: number | null; cost: number | null; co2: number | null;          // baseline
  rn: number | null; rk: number | null; rf: number | null; ri: number | null; rc: number | null; rv: number | null; // recommended
  in: number | null; iv: number | null; ik: number | null; if: number | null; ii: number | null; ic: number | null; // implemented
  st: Status;
  lat: number | null; lng: number | null;
  n?: string;         // company name: only present when signed in
}

export interface SiteData {
  generated: string;
  asOf: string;
  source: string;
  counts: { walkthrough: number; clusters: number; iga: number };
  rows: Row[];
}

export const data = bundled as SiteData;

export const FYS = ['2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];
export const STATUSES: Status[] = ['Implementation verified', 'Post-audit pending', 'Report under process'];
// [badge background, badge text, bar colour]
export const STATUS_TONE: Record<Status, [string, string, string]> = {
  'Implementation verified': ['#E1F0E8', '#0B7A45', '#0B7A45'],
  'Post-audit pending': ['#F8EBDA', '#9A5200', '#D67800'],
  'Report under process': ['#EFEFEF', '#3A3A3A', '#A3A3A3'],
};

// The fields a team member can change from the website, and which of them are numbers.
export const NUMERIC = new Set(['dy', 'kva', 'e', 'f', 'cost', 'co2', 'rn', 'rk', 'rf', 'ri', 'rc', 'rv', 'in', 'iv', 'ik', 'if', 'ii', 'ic', 'emp', 'age']);
export const IMPL_KEYS = ['in', 'ii', 'ik', 'if', 'ic', 'iv'] as const;

// ---------------------------------------------------------------- formatting

export const n0 = (v: unknown): number => (typeof v === 'number' && isFinite(v) ? v : 0);
export const ind = (v: unknown) => Math.round(n0(v)).toLocaleString('en-IN');
export function inr(v: unknown, lakhDigits = 1): string {
  const x = n0(v);
  if (x >= 1e7) return '₹ ' + (x / 1e7).toFixed(2) + ' Cr';
  if (x >= 1e5) return '₹ ' + (x / 1e5).toFixed(lakhDigits) + ' L';
  return x ? '₹ ' + ind(x) : '—';
}
export const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) + '%' : '0%');
export const fyLabel = (fy: string) => 'FY ' + fy.replace('-', '–');
export const sum = (rows: Row[], k: keyof Row) => rows.reduce((a, r) => a + n0(r[k]), 0);

/** A number typed by a person: "1,20,000" -> 120000; empty -> null. */
export function parseNum(v: unknown): number | null {
  if (v === '' || v == null) return null;
  const s = String(v).replace(/[^0-9.-]/g, '');
  if (!s || isNaN(Number(s))) return null;
  return Number(s);
}

/** The plant's public title: its name when signed in, else sector + "plant". */
export const titleOf = (r: Row, signed: boolean) => (signed && r.n ? r.n : r.s + ' plant');

/** Status from the figures, used when a team member saves a change. */
export function statusFrom(r: Partial<Row>, previous?: Status): Status {
  if (n0(r.in) > 0) return 'Implementation verified';
  if (previous === 'Implementation verified') return previous;
  if (n0(r.rn) > 0) return 'Post-audit pending';
  return 'Report under process';
}

/** Rows from FOX Console replace the bundled ones with the same audit number; new ones are added. */
export function mergeRows(base: Row[], over: Partial<Row>[] | null | undefined): Row[] {
  if (!over || !over.length) return base;
  const byCode = new Map(base.map(r => [r.c, r]));
  for (const o of over) {
    if (!o || typeof o.c !== 'string') continue;
    byCode.set(o.c, { ...(byCode.get(o.c) || ({} as Row)), ...o } as Row);
  }
  return [...byCode.values()].sort(byCode_);
}
function byCode_(a: Row, b: Row) {
  return a.fy === b.fy ? Number(a.c.split('/')[1]) - Number(b.c.split('/')[1]) : a.fy < b.fy ? -1 : 1;
}

/** A change-log time, e.g. 12 Nov 2026, 04:40 pm. */
export const when = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
