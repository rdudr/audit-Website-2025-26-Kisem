import { lazy, Suspense, useMemo, useState } from 'react';
import { FOLLOW_UPS, FYS, fyLabel, n0, STATUSES, titleOf, type Row, type Status } from '../data';
import type { Check, Filters } from './filters';
import { checkOk, NO_FILTERS } from './filters';
import { useDevice } from './useDevice';

const AuditMap = lazy(() => import('./AuditMap'));

// Every audit (canvas "Component · Audits and sectors"). Same logic as before: search, filters,
// sorting, open an audit, sign in for company names, and the map.

const ST: Record<Status, [string, string]> = {
  'Implementation verified': ['#E3F3EA', '#0E6B33'],
  'Post assessment done': ['#E4EEFB', '#1D4F91'],
  'Post-audit pending': ['#EFEBFD', '#4C35B8'],
  'Report under process': ['#EFEFF2', '#3A3850'],
};
const lakh = (v: unknown) => (n0(v) / 1e5).toFixed(1);
const month = (dt: string | null) => (dt ? new Date(dt + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
const LOCK = 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4';
const UNLOCK = 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2';

/** The two follow-up checks of one audit: a tick when done, a dash when not yet. */
export function FollowUps({ r, size = 11 }: { r: Row; size?: number }) {
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
      {FOLLOW_UPS.map(f => {
        const done = r[f.key] === 1;
        return (
          <span key={f.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size, fontWeight: 600, color: done ? '#0E6B33' : '#6B6880', whiteSpace: 'nowrap' }}>
            <svg width={size + 1} height={size + 1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={done ? 'M20 6L9 17l-5-5' : 'M6 12h12'} /></svg>
            {f.short}<span className="sr-only">{done ? ': done' : ': not yet'}</span>
          </span>
        );
      })}
    </span>
  );
}
const CHECKS: [Check, string][] = [['All', 'Any'], ['done', 'Done'], ['pending', 'Not yet']];

export default function Audits({ rows, signed, filters, setFilters, onOpen, onSignIn, onSignOut }: {
  rows: Row[]; signed: boolean; filters: Filters; setFilters: (f: Filters) => void;
  onOpen: (code: string) => void; onSignIn: () => void; onSignOut: () => void;
}) {
  const dev = useDevice();
  const D = dev === 'desktop', T = dev === 'tablet';
  const [all, setAll] = useState(false);
  const set = (patch: Partial<Filters>) => { setFilters({ ...filters, ...patch }); setAll(false); };

  const list = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let out = rows.filter(r => (filters.fy === 'All' || r.fy === filters.fy)
      && (filters.sector === 'All sectors' || r.s === filters.sector)
      && (filters.status === 'All' || r.st === filters.status)
      && checkOk(filters.vr, r.vr) && checkOk(filters.pa, r.pa)
      && (!q || [r.c, r.s, r.sr, r.ci, r.p, signed ? r.n || '' : ''].join(' ').toLowerCase().includes(q)));
    const ip = (r: Row) => (r.rn ? n0(r.in) / r.rn : -1);
    if (filters.sort === 'save') out = [...out].sort((a, b) => n0(b.ri) - n0(a.ri));
    if (filters.sort === 'impl') out = [...out].sort((a, b) => ip(b) - ip(a));
    if (filters.sort === 'co2') out = [...out].sort((a, b) => n0(b.rc) - n0(a.rc));
    return out;
  }, [rows, filters, signed]);
  const shown = all ? list : list.slice(0, 12);
  const sectors = useMemo(() => [...new Set(rows.map(r => r.s))].sort(), [rows]);
  const fyCount = (fy: string) => (fy === 'All' ? rows.length : rows.filter(r => r.fy === fy).length);
  const fys = ['All', ...FYS].filter(fy => fy === 'All' || fyCount(fy) > 0);
  const filtered = filters.q || filters.sector !== 'All sectors' || filters.fy !== 'All' || filters.status !== 'All' || filters.vr !== 'All' || filters.pa !== 'All';
  const doneCount = (k: 'vr' | 'pa') => rows.filter(r => r[k] === 1).length;

  const L = {
    pad: D ? '104px 40px 0' : T ? '80px 32px 0' : '64px 16px 0', h2: D ? 48 : T ? 40 : 32, lede: D ? 18 : 16,
    fCols: D ? 'minmax(0, 1.6fr) repeat(5, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
    rCols: D ? '92px minmax(0, 1.5fr) minmax(0, 1.1fr) 100px minmax(0, 1.2fr) 210px 16px' : T ? '92px minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
    rGap: D ? 16 : 12,
  };
  const label = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: '#55526A' } as const;
  const inp = { height: 44, boxSizing: 'border-box', border: '1px solid #D9D7E3', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: '#FFFFFF', color: '#0F0D1A' } as const;

  return (
    <section id="audits" className="rd" style={{ scrollMarginTop: 72, maxWidth: 1280, margin: '0 auto', padding: L.pad, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
          <span className="rd-eyebrow">Audits</span>
          <h2 style={{ margin: 0, fontSize: L.h2, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em' }}>Every audit, by number</h2>
          <p style={{ margin: 0, fontSize: L.lede, lineHeight: 1.6, color: '#55526A' }}>
            {signed ? 'Signed in: company names are shown, and you can add companies and update implementation. Open any audit for its baseline, recommendations and what the plant carried out.'
              : 'Plants are shown by audit number and sector. Company names stay private to the team. Open any audit for its baseline, recommendations and what the plant carried out.'}
          </p>
        </div>
        <button type="button" className="rd-ghost" onClick={signed ? onSignOut : onSignIn}
          style={{ height: 44, padding: '0 16px', borderRadius: 12, border: '1px solid #D9D7E3', background: signed ? '#E3F3EA' : '#FFFFFF', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#0F0D1A', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={signed ? UNLOCK : LOCK} /></svg>
          {signed ? 'Sign out' : 'Sign in to see names'}
        </button>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 20, background: '#F7F6FB', border: '1px solid #ECEAF2' }}>
        <div style={{ display: 'grid', gridTemplateColumns: L.fCols, gap: 10 }}>
          <label style={{ ...label, gridColumn: D ? undefined : '1 / -1' }}>Search
            <span style={{ position: 'relative', display: 'block' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E88A8" strokeWidth={2} strokeLinecap="round" aria-hidden="true" style={{ position: 'absolute', left: 14, top: 14 }}><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></svg>
              <input className="rd-inp" type="search" value={filters.q} onChange={e => set({ q: e.target.value })} placeholder={signed ? 'Company, audit number, city, product…' : 'Audit number, city, product…'} style={{ ...inp, width: '100%', padding: '0 12px 0 40px', fontSize: 15 }} />
            </span>
          </label>
          <label style={label}>Sector
            <select className="rd-inp" value={filters.sector} onChange={e => set({ sector: e.target.value })} style={{ ...inp, padding: '0 10px' }}>
              {['All sectors', ...sectors].map(o => <option key={o} value={o}>{o === 'All sectors' ? `All ${sectors.length} sectors` : o}</option>)}
            </select>
          </label>
          <label style={label}>Status
            <select className="rd-inp" value={filters.status} onChange={e => set({ status: e.target.value as Filters['status'] })} style={{ ...inp, padding: '0 10px' }}>
              {(['All', ...STATUSES] as const).map(s => <option key={s} value={s}>{s === 'All' ? 'Any status' : s}</option>)}
            </select>
          </label>
          {FOLLOW_UPS.map(f => (
            <label key={f.key} style={label} title={`${f.label}: ${f.when}`}>{f.key === 'vr' ? 'Implementation verified' : 'Post assessment'}
              <select className="rd-inp" value={filters[f.key]} onChange={e => set({ [f.key]: e.target.value as Check })} style={{ ...inp, padding: '0 10px' }}>
                {CHECKS.map(([v, l]) => <option key={v} value={v}>{v === 'done' ? `${l} (${doneCount(f.key)})` : l}</option>)}
              </select>
            </label>
          ))}
          <label style={label}>Sort by
            <select className="rd-inp" value={filters.sort} onChange={e => set({ sort: e.target.value as Filters['sort'] })} style={{ ...inp, padding: '0 10px' }}>
              <option value="code">Audit number</option><option value="save">Savings recommended</option><option value="impl">Implementation %</option><option value="co2">CO₂ reduction</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div role="group" aria-label="Audit year" style={{ display: 'flex', gap: 8, flexWrap: D || T ? 'wrap' : 'nowrap', overflowX: 'auto', maxWidth: '100%' }}>
            {fys.map(fy => {
              const on = filters.fy === fy;
              return (
                <button key={fy} type="button" className="rd-pill" aria-pressed={on} onClick={() => set({ fy })}
                  style={{ height: 40, padding: '0 14px', borderRadius: 999, border: `1px solid ${on ? '#0F0D1A' : '#D9D7E3'}`, background: on ? '#0F0D1A' : '#FFFFFF', color: on ? '#FFFFFF' : '#2E2B3F', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {fy === 'All' ? 'All years' : fyLabel(fy)} <span style={{ opacity: 0.65 }}>{fyCount(fy)}</span>
                </button>
              );
            })}
          </div>
          {filtered && (
            <button type="button" onClick={() => set({ ...NO_FILTERS, sort: filters.sort })} style={{ height: 40, padding: '0 10px', border: 0, borderRadius: 10, background: 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#0F0D1A', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Clear filters</button>
          )}
        </div>
      </div>

      {/* the list */}
      <div style={{ border: '1px solid #E7E5EE', borderRadius: 22, overflow: 'hidden' }}>
        {D && (
          <div style={{ display: 'grid', gridTemplateColumns: L.rCols, gap: 16, padding: '12px 20px', background: '#FAFAFC', borderBottom: '1px solid #ECEAF2', fontSize: 12, fontWeight: 600, color: '#55526A' }}>
            <span>Audit</span><span>Plant</span><span>Location</span><span>ECMs done</span><span>Savings, ₹ lakh / yr</span><span>Status</span><span />
          </div>
        )}
        {shown.map(r => {
          const [sbg, sfg] = ST[r.st] || ST['Report under process'];
          const pc = n0(r.ri) ? Math.min(100, Math.round((100 * n0(r.ii)) / n0(r.ri))) : 0;
          const loc = `${r.ci}, ${r.stt}`;
          return (
            <button key={r.c} type="button" className="rd-arow" onClick={() => onOpen(r.c)}
              style={{ width: '100%', display: 'grid', gridTemplateColumns: L.rCols, gap: L.rGap, alignItems: 'center', padding: '16px 20px', border: 0, borderBottom: '1px solid #F0EFF4', background: '#FFFFFF', textAlign: 'left', cursor: 'pointer', color: '#0F0D1A', fontFamily: 'inherit' }}>
              <span className="rd-mono" style={{ fontSize: 12, fontWeight: 700, color: '#2B2644', background: '#ECEAF2', borderRadius: 8, padding: '5px 8px', justifySelf: 'start' }}>{r.c}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <b style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{titleOf(r, signed)}</b>
                <span style={{ fontSize: 13, color: '#55526A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{signed ? `${r.s} · ${r.p}` : r.p}</span>
                {!D && <span style={{ fontSize: 12, color: '#6B6880' }}>{loc}{r.dt ? ` · ${month(r.dt)}` : ''}</span>}
              </span>
              {D && (
                <>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, minWidth: 0 }}><span>{loc}</span><span style={{ color: '#6B6880', fontSize: 12 }}>{month(r.dt) || fyLabel(r.fy)}</span></span>
                  <span style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{r.rn ? <><b>{n0(r.in)}</b> <span style={{ color: '#6B6880' }}>of {r.rn}</span></> : '—'}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}><b style={{ color: '#0E6B33' }}>{lakh(r.ii)}</b> <span style={{ color: '#6B6880' }}>/ {lakh(r.ri)}</span></span>
                    <span aria-hidden="true" style={{ height: 6, borderRadius: 999, background: '#E4E1F1', display: 'flex', overflow: 'hidden' }}><span style={{ width: pc + '%', background: '#15803D' }} /></span>
                  </span>
                </>
              )}
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6, justifySelf: 'start', minWidth: 0 }}>
                <span style={{ height: 26, padding: '0 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start', whiteSpace: 'nowrap', background: sbg, color: sfg }}>{r.st}</span>
                <FollowUps r={r} />
              </span>
              {D && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E88A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>}
            </button>
          );
        })}
        {list.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 14, color: '#55526A' }}>No audits match these filters.</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 20px', background: '#FAFAFC' }}>
          <span aria-live="polite" style={{ fontSize: 13, color: '#55526A' }}>Showing {shown.length} of {list.length} audits{filtered ? ` (${rows.length} in all)` : ''}</span>
          {!all && list.length > shown.length && (
            <button type="button" className="rd-cta" onClick={() => setAll(true)} style={{ height: 44, padding: '0 18px', border: 0, borderRadius: 12, background: '#2B2644', color: '#FFFFFF', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Show all {list.length}</button>
          )}
        </div>
      </div>

      {/* map */}
      <div style={{ minHeight: 320, aspectRatio: D ? '21 / 9' : '16 / 10', borderRadius: 22, overflow: 'hidden', background: '#F4F3F8', border: '1px solid #E7E5EE', position: 'relative' }}>
        <Suspense fallback={<span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#55526A' }}>Loading the audit map…</span>}>
          <AuditMap rows={list} signed={signed} onOpen={onOpen} />
        </Suspense>
      </div>
    </section>
  );
}
