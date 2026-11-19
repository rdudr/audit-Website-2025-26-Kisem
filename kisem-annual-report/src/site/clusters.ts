// Industrial clusters for the audit map and the list under it. Kept apart from AuditMap.tsx so the
// list does not pull the map library into the main bundle.
import type { Row } from '../data';

// Gujarat's industrial clusters where KISEM has audited, by the district the audits are filed under.
// [district(s), cluster name]. Only districts with audits are drawn.
export const CLUSTERS: [string[], string][] = [
  [['Morbi'], 'Morbi ceramic cluster'],
  [['Surat'], 'Surat textile and diamond cluster'],
  [['Ahmedabad'], 'Ahmedabad chemical and CETP cluster (Vatva, Naroda)'],
  [['Porbandar', 'Veraval'], 'Porbandar–Veraval seafood cluster'],
  [['Aravalli', 'Sabarkantha'], 'Modasa cold storage cluster'],
  [['Bharuch'], 'Ankleshwar–Bharuch chemical cluster'],
  [['Vapi'], 'Vapi paper and chemical cluster'],
];
const SHORT: Record<string, string> = {
  Morbi: 'Morbi · Ceramic', Surat: 'Surat · Textile', Ahmedabad: 'Ahmedabad · Chemical', Porbandar: 'Porbandar · Seafood', Veraval: 'Veraval · Seafood',
  Aravalli: 'Modasa · Cold storage', Sabarkantha: 'Sabarkantha · Cold storage', Bharuch: 'Bharuch · Chemical', Vapi: 'Vapi · Paper',
};

/** Districts of the clusters with their audits: centre (mean of the pins) and count. */
export function clusterSpots(rows: Row[]) {
  return CLUSTERS.flatMap(([districts, name]) => districts.map(ci => {
    const r = rows.filter(x => x.ci === ci && x.lat != null && x.lng != null);
    if (!r.length) return null;
    return { ci, name, label: SHORT[ci] || ci, n: r.length, lat: r.reduce((a, x) => a + x.lat!, 0) / r.length, lng: r.reduce((a, x) => a + x.lng!, 0) / r.length };
  })).filter(Boolean) as { ci: string; name: string; label: string; n: number; lat: number; lng: number }[];
}

