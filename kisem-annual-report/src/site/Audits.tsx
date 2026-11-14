import { lazy, Suspense, useMemo, useState } from 'react';
import { FYS, fyLabel, inr, n0, STATUS_TONE, STATUSES, titleOf, type Row } from '../data';
import { Icon } from './Icon';
import { PATHS } from './icons';

const AuditMap = lazy(() => import('./AuditMap'));

import type { Filters } from './filters';
import { NO_FILTERS } from './filters';

export default function Audits({ rows, signed, filters, setFilters, onOpen, onSignIn, onSignOut }: {
  rows: Row[]; signed: boolean; filters: Filters; setFilters: (f: Filters) => void;
  onOpen: (code: string) => void; onSignIn: () => void; onSignOut: () => void;
}) {
  const [all, setAll] = useState(false);
  const set = (patch: Partial<Filters>) => { setFilters({ ...filters, ...patch }); setAll(false); };

  const L = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let out = rows.filter(r => (filters.fy === 'All' || r.fy === filters.fy)
      && (filters.sector === 'All sectors' || r.s === filters.sector)
      && (filters.status === 'All' || r.st === filters.status)
      && (!q || [r.c, r.s, r.sr, r.ci, r.p, signed ? r.n || '' : ''].join(' ').toLowerCase().includes(q)));
    const ip = (r: Row) => (r.rn ? n0(r.in) / r.rn : -1);
    if (filters.sort === 'save') out = [...out].sort((a, b) => n0(b.ri) - n0(a.ri));
    if (filters.sort === 'impl') out = [...out].sort((a, b) => ip(b) - ip(a));
    if (filters.sort === 'co2') out = [...out].sort((a, b) => n0(b.rc) - n0(a.rc));
    return out;
  }, [rows, filters, signed]);
  const shown = all ? L : L.slice(0, 12);
  const sectors = useMemo(() => [...new Set(rows.map(r => r.s))].sort(), [rows]);

  const cc: Record<string, number> = {};
  rows.forEach(r => { cc[r.ci] = (cc[r.ci] || 0) + 1; });
  const cl = Object.entries(cc).sort((a, b) => b[1] - a[1]);
  const cmax = cl[0] ? cl[0][1] : 1;

  return (
    <section id="audits" className="sec" style={{ gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 680 }}>
        <span className="eyebrow">All audits</span>
        <h2 className="h2">Every audit, recommended and implemented</h2>
        <p className="lede">Open any audit to see its baseline, what was recommended, and what the plant has carried out.</p>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 18px', borderRadius: 16, background: signed ? '#E1F0E8' : '#FFFFFF', border: '1px solid rgba(43,38,68,.08)', flexWrap: 'wrap' }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: '#2B2644', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={signed ? PATHS.unlock : PATHS.lock} /></span>
        <span style={{ flex: '1 1 320px', fontSize: 14, lineHeight: 1.5 }}>
          {signed ? 'Signed in: company names are shown, and you can add companies and update implementation.'
            : 'Company names are kept private. Each plant is shown by its sector and KISEM audit number. Team members can sign in to see names.'}
        </span>
        <button type="button" className="btn btnp" onClick={signed ? onSignOut : onSignIn} style={{ height: 40, fontSize: 13 }}>{signed ? 'Sign out' : 'Sign in to see names'}</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
        <label className="field" style={{ flex: '2 1 260px' }}>Search
          <input className="inp" type="search" value={filters.q} onChange={e => set({ q: e.target.value })} placeholder={signed ? 'Company, audit number, sector or city' : 'Audit number, sector or city'} />
        </label>
        <label className="field" style={{ flex: '1 1 170px' }}>Sector
          <select className="inp" value={filters.sector} onChange={e => set({ sector: e.target.value })}>
            {['All sectors', ...sectors].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="field" style={{ flex: '1 1 170px' }}>Sort by
          <select className="inp" value={filters.sort} onChange={e => set({ sort: e.target.value as Filters['sort'] })}>
            <option value="code">Audit number</option><option value="save">Savings recommended</option><option value="impl">Implementation %</option><option value="co2">CO₂ reduction</option>
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'center' }}>
        <div role="group" aria-label="Financial year" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', ...FYS].map(y => <button key={y} type="button" className="pill" aria-pressed={filters.fy === y} onClick={() => set({ fy: y })}>{y === 'All' ? 'All years' : fyLabel(y)}</button>)}
        </div>
        <div role="group" aria-label="Status" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', ...STATUSES] as const).map(s => <button key={s} type="button" className="pill" aria-pressed={filters.status === s} onClick={() => set({ status: s })}>{s === 'All' ? 'Any status' : s}</button>)}
        </div>
        {(filters.q || filters.sector !== 'All sectors' || filters.fy !== 'All' || filters.status !== 'All') && (
          <button type="button" className="ghost" onClick={() => set({ ...NO_FILTERS, sort: filters.sort })} style={{ height: 34, padding: '0 10px', border: 0, borderRadius: 10, background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Clear filters</button>
        )}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="agrid" style={{ padding: '10px 20px', background: '#F5F5F5', fontSize: 12, fontWeight: 600, color: '#5E5E5E' }}>
          <span aria-live="polite">Audit · {L.length} shown</span><span className="acol">Status</span><span className="acol" style={{ textAlign: 'right' }}>Saving / yr</span><span className="acol">ECMs implemented</span><span />
        </div>
        {shown.map(r => {
          const [sbg, sfg] = STATUS_TONE[r.st];
          return (
            <button key={r.c} type="button" className="agrid arow" onClick={() => onOpen(r.c)}
              style={{ width: '100%', padding: '14px 20px', border: 0, borderTop: '1px solid #EBEBEB', background: '#FFFFFF', textAlign: 'left', cursor: 'pointer', color: '#000000' }}>
              <span style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
                <span className="code n">{r.c}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{titleOf(r, signed)}</span>
                  <span style={{ fontSize: 13, color: '#5E5E5E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{signed ? r.s + ' · ' : ''}{r.ci} · {fyLabel(r.fy)}</span>
                </span>
              </span>
              <span className="acol"><span className="badge" style={{ background: sbg, color: sfg }}>{r.st}</span></span>
              <span className="n acol" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{inr(r.ri)}</span>
              <span className="acol" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden="true" style={{ flex: 1, height: 6, borderRadius: 999, background: '#EBEBEB', display: 'flex', overflow: 'hidden' }}><span style={{ width: r.rn ? Math.min(100, Math.round((100 * n0(r.in)) / r.rn)) + '%' : '0%', background: '#0B7A45' }} /></span>
                <span className="n" style={{ fontSize: 12, color: '#3A3A3A', minWidth: 40, textAlign: 'right' }}>{r.rn ? `${n0(r.in)} / ${r.rn}` : '—'}</span>
              </span>
              <Icon d={PATHS.chevron} stroke="#6B6B6B" width={2.2} />
            </button>
          );
        })}
        {L.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 14, color: '#5E5E5E', borderTop: '1px solid #EBEBEB' }}>No audits match these filters.</div>}
        {!all && L.length > 12 && (
          <button type="button" className="ghost" onClick={() => setAll(true)} style={{ width: '100%', height: 52, border: 0, borderTop: '1px solid #EBEBEB', background: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Show all {L.length} audits</button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'stretch' }}>
        <div style={{ flex: '1.2 1 320px', minWidth: 0, minHeight: 320, aspectRatio: '16 / 10', borderRadius: 20, overflow: 'hidden', background: '#F5F5F5', border: '1px solid rgba(0,0,0,.06)', position: 'relative' }}>
          <Suspense fallback={<span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#5E5E5E' }}>Loading the audit map…</span>}>
            <AuditMap rows={L} signed={signed} onOpen={onOpen} />
          </Suspense>
        </div>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span style={{ fontSize: 14, fontWeight: 600, paddingBottom: 4 }}>Audits by city and district</span>
          {cl.slice(0, 10).map(([name, n], i) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr) 24px', gap: 10, alignItems: 'center', fontSize: 13 }}>
              <span style={{ fontWeight: i === 0 ? 700 : 500 }}>{name}</span>
              <span aria-hidden="true" style={{ height: 10, borderRadius: 999, background: '#EFEFEF', overflow: 'hidden', display: 'flex' }}><span style={{ width: Math.round((100 * n) / cmax) + '%', background: i === 0 ? '#2B2644' : '#8E88A8', borderRadius: 999 }} /></span>
              <span className="n" style={{ textAlign: 'right', fontWeight: 600 }}>{n}</span>
            </div>
          ))}
          {cl.length > 10 && <span style={{ fontSize: 12, color: '#6B6B6B', paddingTop: 4 }}>{cl.length - 10} more places with one or two audits each.</span>}
        </div>
      </div>
    </section>
  );
}
