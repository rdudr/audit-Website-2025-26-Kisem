// foxauditiitgn.com: the November 2026 redesign ("KISEM website (foxauditiitgn.com) · redesign").
// Sections live in ./k; every figure comes from the live rows (master sheet + FOX Console).
// Company names show only to signed-in team members; sign-in, the audit panel, adding companies,
// the change log and the master Excel download are the same as before.
import { useState } from 'react';
import type { SiteState } from '../App';
import { NO_FILTERS, type Filters } from './filters';
import { Icon } from './Icon';
import { PATHS } from './icons';
import { AddCompany, AuditDrawer, ChangeLog, SignIn } from './Overlays';
import { useMasterExcel } from './useMasterExcel';
import type { Status } from '../data';
import { KHero, KNav, KPartners, KStory } from './k/KTop';
import { KImpact, KJourney } from './k/KNumbers';
import { KAudits } from './k/KAudits';
import { KMap, KSectors } from './k/KMap';
import { KField, KFox, KInstruments } from './k/KWork';
// "What an audit covers" stays the previous section: plant tour with its points on each photo,
// diagnostics, energy flow, stages and the 17 areas.
import ScopeSection from './ScopeSection';
import './redesign.css';
import { KApply, KFooter, KTeam } from './k/KPeople';
import { goTo } from './k/kutil';
import './k/k.css';

export default function PublicSite({ state, loginOpen, setLoginOpen, signingIn }: { state: SiteState; loginOpen: boolean; setLoginOpen: (v: boolean) => void; signingIn: boolean }) {
  const { rows, session } = state;
  const signed = !!session;
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [open, setOpen] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const excel = useMasterExcel(state);
  const row = rows.find(r => r.c === open) || null;
  const signButton = () => (signed ? state.signOutNow() : setLoginOpen(true));
  const signLabel = signingIn ? 'Signing in…' : signed ? 'Sign out' : 'Team sign in';

  const pickSector = (s: string) => setFilters({ ...NO_FILTERS, sort: filters.sort, sector: s });
  const pickStatus = (s: Status) => { setFilters({ ...NO_FILTERS, sort: filters.sort, status: s }); goTo('audits'); };

  const btn = { height: 36, padding: '0 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', font: 'inherit' } as const;
  const teamBar = (signed || state.teamError) ? (
    <div style={{ borderRadius: 22, background: '#16132A', color: '#FFFFFF', padding: '8px 10px 8px 16px', boxShadow: '0 12px 32px -18px rgba(22,19,42,.6)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {signed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />Team view · signed in as {session!.name}</span>
          <a href="#/companies" style={{ ...btn, background: '#FFFFFF', color: '#0B0A14', border: 0 }}>Companies</a>
          <button type="button" onClick={() => setShowAdd(true)} style={{ ...btn, background: '#FFFFFF', color: '#0B0A14', border: 0 }}>Add company</button>
          <button type="button" onClick={() => setShowLog(true)} style={{ ...btn, background: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,.3)' }}>Change log · {state.changes.length}</button>
          <button type="button" onClick={excel.download} disabled={excel.busy} style={{ ...btn, background: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,.3)' }}><Icon d={PATHS.download} size={14} />Master Excel</button>
        </div>
      )}
      {excel.msg && <div role="status" style={{ fontSize: 13, color: '#DDDAE6' }}>{excel.msg}</div>}
      {signed && state.teamEmpty && <div role="alert" style={{ fontSize: 13, color: '#FCA5A5' }}>Signed in, but FOX Console has no companies yet: the master data sheet has not been imported on the server, so names cannot be shown.</div>}
      {state.teamError && !loginOpen && <div role="alert" style={{ fontSize: 13, color: '#FCA5A5' }}>{state.teamError}</div>}
    </div>
  ) : null;

  return (
    <>
      <div className="k">
        <a href="#impact" className="sr-only">Skip to content</a>
        <KNav signed={signed} signLabel={signLabel} onSign={signButton} teamBar={teamBar} />
        <main>
          <KHero rows={rows} />
          <KPartners />
          <KStory rows={rows} />
          <KImpact rows={rows} onStatus={pickStatus} />
          <KJourney rows={rows} />
          <KAudits rows={rows} signed={signed} filters={filters} setFilters={setFilters} onOpen={setOpen} onSign={signButton} open={open} />
          <KMap rows={rows} signed={signed} onOpen={setOpen} />
          <KSectors rows={rows} onPick={pickSector} />
          <ScopeSection rows={rows} fox={<KFox />} />
          <KInstruments />
          <KField />
          <KTeam />
          <KApply />
        </main>
        <KFooter session={session} />
      </div>

      <SignIn open={loginOpen && !signed} onClose={() => setLoginOpen(false)} onDone={state.signedIn} notice={state.teamError} />
      <AuditDrawer row={row} session={session} changes={state.changes} onClose={() => setOpen(null)} onSaved={state.applySaved} />
      <AddCompany open={showAdd && signed} session={session} rows={rows} onClose={() => setShowAdd(false)} onSaved={(r, c) => { state.applySaved(r, c); setOpen(r.c); }} />
      <ChangeLog open={showLog && signed} changes={state.changes} onClose={() => setShowLog(false)} />
    </>
  );
}
