import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { data, mergeRows, type Row } from './data';
import { ConsoleError, fetchPublicRows, loadSession, signOut, team, type Change, type Session } from './lib/console';
import PublicSite from './site/PublicSite';

const Companies = lazy(() => import('./site/Companies'));

export interface SiteState {
  rows: Row[];
  session: Session | null;
  changes: Change[];
  teamError: string;
  /** Signed in, but FOX Console holds no companies yet (the master sheet was not imported). */
  teamEmpty: boolean;
  /** Put a saved row (and its change) into the page without reloading. */
  applySaved: (row: Row, change: Change | null) => void;
  signedIn: (s: Session) => void;
  signOutNow: () => void;
  openSignIn: () => void;
}

// "#/companies" or "#/companies/26-27/3" opens the team page; anything else is the public site.
function routeOf(hash: string) {
  const m = hash.match(/^#\/companies(?:\/(.+))?$/);
  return m ? { page: 'companies' as const, code: m[1] ? decodeURIComponent(m[1]) : null } : { page: 'site' as const, code: null };
}

export default function App() {
  const [publicRows, setPublicRows] = useState<Row[]>(data.rows);
  const [teamRows, setTeamRows] = useState<Row[] | null>(null);
  const [teamEmpty, setTeamEmpty] = useState(false);
  const [changes, setChanges] = useState<Change[]>([]);
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [teamError, setTeamError] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [route, setRoute] = useState(() => routeOf(location.hash));

  useEffect(() => {
    const on = () => setRoute(routeOf(location.hash));
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);

  // Team edits made since the master sheet import (public fields only). If FOX Console cannot be
  // reached, the figures from the master sheet still show.
  useEffect(() => {
    const ac = new AbortController();
    fetchPublicRows(ac.signal).then(out => { if (out) setPublicRows(mergeRows(data.rows, out.rows)); });
    return () => ac.abort();
  }, []);

  const signOutNow = useCallback(() => {
    signOut(session);
    setSession(null); setTeamRows(null); setChanges([]); setTeamError('');
    if (routeOf(location.hash).page === 'companies') location.hash = '#audits';
  }, [session]);

  // Signed in: company names and the change log, straight from FOX Console.
  useEffect(() => {
    if (!session) return;
    let live = true;
    team.companies(session).then(out => {
      if (!live) return;
      setTeamRows(mergeRows(data.rows, out.rows)); setTeamEmpty(!out.rows?.length); setChanges(out.changes || []); setTeamError('');
    }).catch((e: ConsoleError) => {
      if (!live) return;
      if (e.status === 401 || e.status === 403) { signOut(session); setSession(null); setTeamError(e.message); setLoginOpen(true); }
      else if (e.status === 404) { signOut(session); setSession(null); setTeamError('Team features are not switched on in FOX Console yet. The public site works as normal.'); }
      else setTeamError(e.message);
    });
    return () => { live = false; };
  }, [session]);

  const applySaved = useCallback((row: Row, change: Change | null) => {
    setTeamRows(prev => mergeRows(prev || data.rows, [row]));
    const { n: _name, ...pub } = row; void _name;
    setPublicRows(prev => mergeRows(prev, [pub]));
    if (change) setChanges(prev => [change, ...prev]);
  }, []);

  const rows = session && teamRows ? teamRows : publicRows;
  const state: SiteState = useMemo(() => ({
    rows, session: teamRows ? session : null, changes, teamError, teamEmpty, applySaved,
    signedIn: (s: Session) => { setSession(s); setLoginOpen(false); setTeamError(''); },
    signOutNow,
    openSignIn: () => setLoginOpen(true),
  }), [rows, session, teamRows, changes, teamError, teamEmpty, applySaved, signOutNow]);

  if (route.page === 'companies') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontSize: 14, color: '#5E5E5E' }}>Opening companies…</div>}>
        <Companies state={state} code={route.code} pending={!!session && !teamRows && !teamError} loginOpen={loginOpen} setLoginOpen={setLoginOpen} />
      </Suspense>
    );
  }
  return <PublicSite state={state} loginOpen={loginOpen} setLoginOpen={setLoginOpen} signingIn={!!session && !teamRows && !teamError} />;
}
