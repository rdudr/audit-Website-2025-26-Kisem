// FOX Console client for the audit website.
//
// Public visitors only ever call /site/public, which returns public fields (no names). A team
// member signs in with their FOX Console Login ID; the token lives in this tab only
// (sessionStorage) and every team call sends it. Company names, the recommendation ledger, the
// change log and the master Excel are served by FOX Console to signed-in team members only.
// Plant contact details are never sent to the website at all.
import type { Row } from '../data';

export const CONSOLE_URL = (import.meta.env.VITE_CONSOLE_URL as string | undefined)?.replace(/\/$/, '') || 'https://console.eassiitgn.page';
const KEY = 'kisem-site-session';

export interface Session { token: string; name: string; loginId: string }
export interface Change { at: string; who: string; code: string; what: string; detail: string }
export interface Ecm {
  m: string; sys: string; st: string;
  k: number | null; f: number | null; s: number | null; v: number | null; c: number | null; a: number | null; by: string;
}

export class ConsoleError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) { super(message); this.status = status; this.code = code; }
}

export function loadSession(): Session | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return s && typeof s.token === 'string' ? s : null;
  } catch { return null; }
}
function saveSession(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
    else sessionStorage.removeItem(KEY);
  } catch { /* private mode */ }
}

async function call<T>(method: string, path: string, opts: { body?: unknown; token?: string; signal?: AbortSignal } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(CONSOLE_URL + '/api/device/site' + path, {
      method,
      signal: opts.signal,
      headers: {
        ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(opts.token ? { Authorization: 'Bearer ' + opts.token } : {}),
        'X-KISEM-App': 'audit',
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ConsoleError('FOX Console could not be reached. Check the connection and try again.', 0);
  }
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new ConsoleError(out.error || 'Something went wrong.', res.status, out.code);
  return out as T;
}

// ---------------------------------------------------------------- public

/** Team edits since the master sheet import, public fields only. Fails quietly: the bundled data still shows. */
export async function fetchPublicRows(signal?: AbortSignal): Promise<{ rows: Partial<Row>[]; changedAt: string | null } | null> {
  try { return await call('GET', '/public', { signal }); } catch { return null; }
}

// ---------------------------------------------------------------- sign in

export async function signIn(loginId: string, password: string): Promise<Session> {
  let res: Response;
  try {
    res = await fetch(CONSOLE_URL + '/api/device/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-KISEM-App': 'audit' },
      body: JSON.stringify({ app: 'audit', login_id: loginId.trim(), password, device_id: 'audit-website' }),
    });
  } catch {
    throw new ConsoleError('FOX Console could not be reached. Check the connection and try again.', 0);
  }
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new ConsoleError(out.error || 'Sign in failed.', res.status, out.code);
  if (out.must_change_pw) {
    throw new ConsoleError('Please set your own password in FOX Console first, then sign in here.', 403, 'password_change_required');
  }
  const s: Session = { token: out.token, name: out.user?.name || loginId, loginId: out.user?.login_id || loginId };
  saveSession(s);
  return s;
}

export async function signOut(s: Session | null) {
  saveSession(null);
  if (!s) return;
  try {
    await fetch(CONSOLE_URL + '/api/device/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + s.token, 'X-KISEM-App': 'audit' } });
  } catch { /* signed out here either way */ }
}

// ---------------------------------------------------------------- team

export const team = {
  companies: (s: Session) => call<{ rows: Row[]; changes: Change[] }>('GET', '/companies', { token: s.token }),
  add: (s: Session, fields: Record<string, unknown>) =>
    call<{ row: Row; change: Change }>('POST', '/companies', { token: s.token, body: { fields } }),
  update: (s: Session, code: string, fields: Record<string, unknown>, what: string) =>
    call<{ row: Row; change: Change | null }>('PUT', '/companies/' + encodeURIComponent(code), { token: s.token, body: { fields, what } }),
  /** Team-only text fields (plant address, contacts, source of lead): write-only from the website. */
  privateFields: (s: Session, code: string) =>
    call<{ filled: Record<string, boolean> }>('GET', '/companies/' + encodeURIComponent(code) + '/private', { token: s.token }),
  ledger: (s: Session, code: string) => call<{ items: Ecm[] }>('GET', '/ledger/' + encodeURIComponent(code), { token: s.token }),
  saveLedger: (s: Session, code: string, items: Ecm[], what: string, detail: string) =>
    call<{ items: Ecm[]; change: Change }>('PUT', '/ledger/' + encodeURIComponent(code), { token: s.token, body: { items, what, detail } }),
  async masterExcel(s: Session): Promise<{ blob: Blob; name: string }> {
    let res: Response;
    try {
      res = await fetch(CONSOLE_URL + '/api/device/site/master.xlsx', { headers: { Authorization: 'Bearer ' + s.token, 'X-KISEM-App': 'audit' } });
    } catch {
      throw new ConsoleError('FOX Console could not be reached. Check the connection and try again.', 0);
    }
    if (!res.ok) {
      const out = await res.json().catch(() => ({}));
      throw new ConsoleError(out.error || 'The master Excel could not be made.', res.status, out.code);
    }
    const cd = res.headers.get('Content-Disposition') || '';
    const name = /filename="([^"]+)"/.exec(cd)?.[1] || 'KISEM master data sheet.xlsx';
    return { blob: await res.blob(), name };
  },
};

export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
