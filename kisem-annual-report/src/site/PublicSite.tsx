import { useState } from 'react';
import type { SiteState } from '../App';
import Audits from './Audits';
import { NO_FILTERS, type Filters } from './filters';
import { APPLY_URL } from './content';
import { Icon } from './Icon';
import { PATHS } from './icons';
import { AddCompany, AuditDrawer, ChangeLog, SignIn } from './Overlays';
import { Logo } from './Logo';
import { useMasterExcel } from './useMasterExcel';
import { Contact, Footer, Hero, Impact, Instruments, Journey, Scope, Sectors, Team } from './Sections';

const LINKS: [string, string][] = [['Impact', '#impact'], ['Year by year', '#journey'], ['All audits', '#audits'], ['Sectors', '#sectors'], ['Scope', '#scope'], ['Instruments', '#instruments'], ['Team', '#team'], ['Contact', '#contact']];

export default function PublicSite({ state, loginOpen, setLoginOpen, signingIn }: { state: SiteState; loginOpen: boolean; setLoginOpen: (v: boolean) => void; signingIn: boolean }) {
  const { rows, session } = state;
  const signed = !!session;
  const [menu, setMenu] = useState(false);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [open, setOpen] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const excel = useMasterExcel(state);
  const row = rows.find(r => r.c === open) || null;
  const signButton = () => (signed ? state.signOutNow() : setLoginOpen(true));

  const pickSector = (s: string) => {
    setFilters({ ...NO_FILTERS, sort: filters.sort, sector: s });
    document.getElementById('audits')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <a href="#impact" className="sr-only">Skip to content</a>
      <header className="hdr">
        <div className="hdrin">
          <Logo />
          <nav className="secnav" aria-label="Sections" style={{ display: 'flex', gap: '4px 20px', flexWrap: 'wrap', fontSize: 14, fontWeight: 500 }}>
            {LINKS.filter(([l]) => l !== 'Instruments').map(([l, h]) => <a key={h} className="navl" href={h}>{l}</a>)}
            {signed && <a className="navl" href="#/companies" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#2B2644' }}><Icon d={PATHS.building} size={14} />Companies</a>}
          </nav>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="ghost" onClick={signButton} aria-pressed={signed} disabled={signingIn}
              style={{ height: 42, padding: '0 14px', border: '1px solid #D4D4D4', borderRadius: 12, background: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <Icon d={signed ? PATHS.unlock : PATHS.lock} size={15} />{signingIn ? 'Signing in…' : signed ? 'Sign out' : <><span className="hide-xs">Team sign in</span><span className="show-xs">Sign in</span></>}
            </button>
            <a className="hide-sm btn btnp" href={APPLY_URL} target="_blank" rel="noopener" style={{ height: 42 }}>Apply for an audit</a>
            <button type="button" className="menubtn ghost" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="phone-menu" aria-label="Menu"
              style={{ width: 44, height: 44, border: '1px solid #D4D4D4', borderRadius: 12, background: '#FFFFFF', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={menu ? PATHS.close : PATHS.menu} size={18} />
            </button>
          </div>
        </div>
        {menu && (
          <nav id="phone-menu" aria-label="Sections" style={{ display: 'flex', flexDirection: 'column', padding: '4px 16px 16px', borderTop: '1px solid #EBEBEB', background: '#FFFFFF', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto' }}>
            {[...LINKS, ...(signed ? [['Companies (team)', '#/companies'] as [string, string]] : [])].map(([l, h]) => (
              <a key={h} href={h} onClick={() => setMenu(false)} style={{ minHeight: 48, display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #F0F0F0' }}>{l}</a>
            ))}
            <a href={APPLY_URL} target="_blank" rel="noopener" className="btn btnp" style={{ marginTop: 12, height: 48, fontSize: 15 }}>Apply for an audit</a>
          </nav>
        )}
        {signed && (
          <div style={{ background: '#2B2644', color: '#FFFFFF' }}>
            <div className="wrap" style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />Team view · signed in as {session!.name}</span>
              <a href="#/companies" className="btnw" style={{ height: 36, padding: '0 12px', borderRadius: 10, background: '#FFFFFF', color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Companies</a>
              <button type="button" className="btnw" onClick={() => setShowAdd(true)} style={{ height: 36, padding: '0 12px', border: 0, borderRadius: 10, background: '#FFFFFF', color: '#000000', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add company</button>
              <button type="button" className="btno" onClick={() => setShowLog(true)} style={{ height: 36, padding: '0 12px', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, background: 'transparent', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Change log · {state.changes.length}</button>
              <button type="button" className="btno" onClick={excel.download} disabled={excel.busy} style={{ height: 36, padding: '0 12px', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, background: 'transparent', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon d={PATHS.download} size={14} />Master Excel</button>
            </div>
            {excel.msg && <div role="status" className="wrap" style={{ padding: '0 24px 10px', fontSize: 13, color: '#DDDAE6' }}>{excel.msg}</div>}
          </div>
        )}
        {signed && state.teamEmpty && <div role="alert" className="wrap" style={{ padding: '8px 24px', fontSize: 13, color: '#C4161C' }}>Signed in, but FOX Console has no companies yet: the master data sheet has not been imported on the server, so names cannot be shown.</div>}
        {state.teamError && !loginOpen && <div role="alert" className="wrap" style={{ padding: '8px 24px', fontSize: 13, color: '#C4161C' }}>{state.teamError}</div>}
      </header>

      <main>
        <Hero rows={rows} />
        <Impact rows={rows} />
        <Journey rows={rows} />
        <Audits rows={rows} signed={signed} filters={filters} setFilters={setFilters} onOpen={setOpen} onSignIn={() => setLoginOpen(true)} onSignOut={state.signOutNow} />
        <Sectors rows={rows} onPick={pickSector} />
        <Scope />
        <Instruments />
        <Team />
        <Contact />
      </main>
      <Footer />

      <SignIn open={loginOpen && !signed} onClose={() => setLoginOpen(false)} onDone={state.signedIn} notice={state.teamError} />
      <AuditDrawer row={row} session={session} changes={state.changes} onClose={() => setOpen(null)} onSaved={state.applySaved} />
      <AddCompany open={showAdd && signed} session={session} rows={rows} onClose={() => setShowAdd(false)} onSaved={(r, c) => { state.applySaved(r, c); setOpen(r.c); }} />
      <ChangeLog open={showLog && signed} changes={state.changes} onClose={() => setShowLog(false)} />
    </div>
  );
}
