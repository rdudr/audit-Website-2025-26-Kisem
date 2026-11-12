import { useCallback, useState } from 'react';
import type { SiteState } from '../App';
import { saveBlob, team, type ConsoleError } from '../lib/console';

export function useMasterExcel(state: SiteState) {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const download = useCallback(async () => {
    if (!state.session || busy) return;
    setBusy(true); setMsg('Making the master Excel from the KISEM template…');
    try {
      const { blob, name } = await team.masterExcel(state.session);
      saveBlob(blob, name);
      setMsg(`Downloaded ${name}: ${state.rows.length} audits, ${state.changes.length} logged change(s) since the import.`);
    } catch (e) { setMsg((e as ConsoleError).message); }
    finally { setBusy(false); }
  }, [state.session, state.rows.length, state.changes.length, busy]);
  return { download, msg, busy };
}
