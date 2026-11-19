// Every audit, by number. Company names show only when a team member is signed in (titleOf).
import { useState } from 'react';
import { FYS, STATUSES, energyShare, titleOf, type Row } from '../../data';
import { NO_FILTERS, checkOk, type Check, type Filters } from '../filters';
import { SC, lakh, mon, pctS } from './kutil';

const LOCK = 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', OPEN = 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2';
const fyL = (fy: string) => 'FY ' + fy.replace('-', '–');
const COLS = '96px minmax(0, 1.6fr) minmax(0, 1fr) 110px minmax(0, 1.2fr) 170px';

export function KAudits({ rows, signed, filters, setFilters, onOpen, onSign, open }: {
  rows: Row[]; signed: boolean; filters: Filters; setFilters: (f: Filters) => void; onOpen: (c: string) => void; onSign: () => void; open: string | null;
}) {
  const [all, setAll] = useState(false);
  const F = filters;
  const set = (p: Partial<Filters>) => { setFilters({ ...F, ...p }); setAll(false); };
  const q = F.q.trim().toLowerCase();
  let L = rows.filter(r =>
    (F.sector === 'All sectors' || r.s === F.sector) && (F.status === 'All' || r.st === F.status) && (F.fy === 'All' || r.fy === F.fy) &&
    checkOk(F.vr, r.vr) && checkOk(F.pa, r.pa) &&
    (!q || [r.c, r.s, r.p, r.ci, r.stt, signed ? r.n : ''].join(' ').toLowerCase().includes(q)));
  const ip = (r: Row) => (r.rn ? (r.in || 0) / r.rn : 0);
  const SORT = { code: () => 0, save: (a: Row, b: Row) => (b.ri || 0) - (a.ri || 0), impl: (a: Row, b: Row) => ip(b) - ip(a), co2: (a: Row, b: Row) => (b.rc || 0) - (a.rc || 0) };
  L = [...L].sort(SORT[F.sort]);
  const shown = all ? L : L.slice(0, 12);
  const sectors = [...new Set(rows.map(r => r.s))].sort();
  const checkLabel = (k: 'vr' | 'pa', v: Check) => v === 'All' ? '' : (k === 'vr' ? 'Implementation ' : 'Post assessment ') + (v === 'done' ? 'done' : 'not yet');
  const parts = [F.fy !== 'All' ? fyL(F.fy) : '', F.sector !== 'All sectors' ? F.sector : '', F.status !== 'All' ? F.status : '', checkLabel('vr', F.vr), checkLabel('pa', F.pa), F.q ? '“' + F.q + '”' : ''].filter(Boolean);
  const clear = () => { setFilters({ ...NO_FILTERS, sort: F.sort }); setAll(false); };
  const follow: [string, Partial<Filters>, boolean][] = [
    ['Any follow-up', { vr: 'All', pa: 'All' }, F.vr === 'All' && F.pa === 'All'],
    ['Implementation verified', { vr: 'done', pa: 'All' }, F.vr === 'done' && F.pa === 'All'],
    ['Post assessment done', { vr: 'All', pa: 'done' }, F.vr === 'All' && F.pa === 'done'],
    ['Post assessment not yet', { vr: 'All', pa: 'pending' }, F.vr === 'All' && F.pa === 'pending'],
  ];
  const sel = { height: 44, border: 0, borderRadius: 12, background: 'rgba(118,118,128,.12)', padding: '0 12px', font: 'inherit', fontSize: 14, color: 'var(--ink)' } as const;
  return (
    <section id="audits" className="sec">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
            <span className="eyebrow">Audits</span>
            <h2 className="h2">Every audit, by number</h2>
            <p className="lede">Plants are shown by audit number and sector. Company names stay private to the team. Open any audit for its baseline, recommendations and what the plant carried out.</p>
          </div>
          <button type="button" className="pill" onClick={onSign} style={{ background: signed ? '#E1F0E8' : '#0B0A14', color: signed ? '#0B7A45' : '#FFFFFF' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={signed ? OPEN : LOCK} /></svg>{signed ? 'Team view on · sign out' : 'Sign in to see names'}
          </button>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--line)', background: '#FCFBFE' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ position: 'relative', flex: '1 1 260px', display: 'flex', alignItems: 'center' }}>
                <span className="sr-only">Search audits</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86838F" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ position: 'absolute', left: 14 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input type="search" value={F.q} onChange={e => set({ q: e.target.value })} placeholder={signed ? 'Audit number, company, sector, product or city' : 'Audit number, sector, product or city'} style={{ width: '100%', height: 44, padding: '0 14px 0 40px', border: 0, borderRadius: 12, background: 'rgba(118,118,128,.12)', font: 'inherit', fontSize: 15, outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--sub)' }}>Sector
                <select value={F.sector} onChange={e => set({ sector: e.target.value })} style={sel}>
                  <option value="All sectors">All {sectors.length} sectors</option>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--sub)' }}>Sort
                <select value={F.sort} onChange={e => setFilters({ ...F, sort: e.target.value as Filters['sort'] })} style={sel}>
                  <option value="code">Audit number</option><option value="save">Savings recommended</option><option value="impl">Implementation %</option><option value="co2">CO₂ reduction</option>
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="seg" role="group" aria-label="Financial year" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                {[['All', 'All years', rows.length] as const, ...FYS.map(f => [f, fyL(f), rows.filter(r => r.fy === f).length] as const)].map(([v, l, n]) => (
                  <button key={v} type="button" onClick={() => set({ fy: v })} aria-pressed={F.fy === v}>{l} <span className="n" style={{ opacity: 0.55 }}>{n}</span></button>
                ))}
              </div>
              <div className="seg" role="group" aria-label="Status" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                {(['All', ...STATUSES] as const).map(s => <button key={s} type="button" onClick={() => set({ status: s })} aria-pressed={F.status === s}>{s === 'All' ? 'Any status' : s}</button>)}
              </div>
              <div className="seg" role="group" aria-label="Follow-up checks" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                {follow.map(([l, p, on]) => <button key={l} type="button" onClick={() => set(p)} aria-pressed={on}>{l}</button>)}
              </div>
            </div>
            {parts.length > 0 && (
              <div role="status" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13, color: 'var(--sub)' }}><span className="n"><strong style={{ color: 'var(--ink)' }}>{L.length}</strong> of {rows.length} audits · {parts.join(' · ')}</span><button type="button" onClick={clear} style={{ height: 30, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line)', background: '#FFFFFF', font: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Clear</button></div>
            )}
          </div>
          <div className="arow hide-sm" style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, padding: '10px 20px', fontSize: 12, fontWeight: 600, color: 'var(--mute)', borderBottom: '1px solid var(--line)' }}>
            <span>Audit</span><span>Plant</span><span className="acol">Location</span><span className="acol">ECMs done</span><span className="acol">Savings, ₹ lakh / yr</span><span>Status</span>
          </div>
          {shown.map(r => {
            const share = energyShare(r);
            const ipct = pctS(r.in || 0, r.rn || 0);
            return (
              <button key={r.c} type="button" className="row arow" onClick={() => onOpen(r.c)} aria-label={`Audit ${r.c}, ${titleOf(r, signed)}. Open details.`}
                style={{ width: '100%', display: 'grid', gridTemplateColumns: COLS, gap: 14, alignItems: 'center', padding: '14px 20px', border: 0, borderBottom: '1px solid var(--line)', background: open === r.c ? '#F4F2FC' : '#FFFFFF', font: 'inherit', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                <span className="n" style={{ fontSize: 14, fontWeight: 700, color: '#6D5BD0' }}>{r.c}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}><span style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{titleOf(r, signed)}</span><span style={{ fontSize: 13, color: 'var(--sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.p}</span></span>
                <span className="acol" style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 }}><span>{r.ci}, {r.stt}</span><span className="n" style={{ color: 'var(--mute)' }}>{mon(r.dt)}</span></span>
                <span className="acol n" style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13 }}><span><strong>{r.in ?? 0}</strong> of {r.rn ?? 0}</span><span aria-hidden="true" style={{ height: 5, borderRadius: 999, background: '#E6E3F0', overflow: 'hidden', display: 'flex' }}><span style={{ width: ipct, background: '#0B7A45' }} /></span></span>
                <span className="acol n" style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 }}><span><strong style={{ color: 'var(--ok)' }}>{lakh(r.ii || 0)}</strong> / {lakh(r.ri || 0)}</span><span style={{ color: 'var(--mute)' }}>Recommended: {share != null ? share + '%' : '—'} of energy use</span></span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}><span style={{ minHeight: 26, padding: '3px 10px', boxSizing: 'border-box', borderRadius: 999, background: SC[r.st][0], color: SC[r.st][1], fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: SC[r.st][1], flexShrink: 0 }} />{r.st}</span><span className="hide-sm" style={{ fontSize: 11.5, color: 'var(--mute)' }}>Implementation {r.vr === 1 ? 'done' : 'not yet'} · Post assessment {r.pa === 1 ? 'done' : 'not yet'}</span></span>
              </button>
            );
          })}
          {L.length === 0 && <p style={{ margin: 0, padding: '40px 20px', textAlign: 'center', fontSize: 15, color: 'var(--sub)' }}>No audits match. <button type="button" onClick={clear} style={{ border: 0, background: 'transparent', font: 'inherit', color: '#6D5BD0', fontWeight: 600, cursor: 'pointer' }}>Clear filters</button></p>}
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 14, color: 'var(--sub)' }}>
            <span className="n">Showing {shown.length} of {L.length} audits</span>
            {!all && L.length > 12 && <button type="button" className="pill pdark" onClick={() => setAll(true)} style={{ height: 40, fontSize: 14 }}>Show all {L.length}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
