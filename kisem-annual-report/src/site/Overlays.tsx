import { useEffect, useRef, useState } from 'react';
import { fyLabel, IMPL_KEYS, when, ind, inr, n0, parseNum, STATUS_TONE, statusFrom, titleOf, type Row } from '../data';
import { ConsoleError, signIn, team, type Change, type Session } from '../lib/console';
import { useOverlay } from '../lib/hooks';
import { Icon } from './Icon';
import { PATHS } from './icons';

// Payback in words: "under 1 month", "1 month", "14 months".
const months = (m: number) => (m < 0.5 ? 'under 1 month' : Math.round(m) === 1 ? '1 month' : Math.round(m) + ' months');
const backdrop: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const initials = (name: string) => name.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/, '').split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

function Close({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return <button type="button" className="iconbtn" onClick={onClick} aria-label={label}><Icon d={PATHS.close} /></button>;
}

// ---------------------------------------------------------------- sign in

type SignInProps = { open: boolean; onClose: () => void; onDone: (s: Session) => void; notice?: string };
export function SignIn(props: SignInProps) {
  return props.open ? <SignInForm {...props} /> : null;
}
function SignInForm({ open, onClose, onDone, notice }: SignInProps) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useOverlay(open, onClose);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !pw) { setErr('Enter your Login ID and password.'); return; }
    setBusy(true); setErr('');
    try { onDone(await signIn(id, pw)); }
    catch (x) { setErr((x as ConsoleError).message); }
    finally { setBusy(false); }
  };
  return (
    <div style={backdrop} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <form role="dialog" aria-modal="true" aria-labelledby="sitl" onSubmit={submit} style={{ width: '100%', maxWidth: 400, background: '#FFFFFF', borderRadius: 24, padding: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 id="sitl" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Team sign in</h2><span style={{ fontSize: 14, color: '#5E5E5E' }}>Use your FOX Console login.</span></div>
          <Close onClick={onClose} />
        </div>
        {notice && !err && <div className="err" role="status">{notice}</div>}
        <label className="field" style={{ fontSize: 13, color: '#000000' }}>Login ID
          <input autoFocus className="inp" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} value={id} onChange={e => setId(e.target.value)} placeholder="e.g. rishabh" />
        </label>
        <label className="field" style={{ fontSize: 13, color: '#000000' }}>Password
          <input className="inp" type="password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} />
        </label>
        {err && <div className="err" role="alert">{err}</div>}
        <button type="submit" className="btn btnp" disabled={busy} style={{ height: 48, fontSize: 15 }}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <span style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>Signed in, you see company names and can add companies, update implementation and download the master data sheet.</span>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------- audit panel

const IMPL: [typeof IMPL_KEYS[number], string, keyof Row, (v: unknown) => string][] = [
  ['in', 'ECMs implemented', 'rn', ind], ['ii', 'Actual cost savings, ₹ / yr', 'ri', inr], ['ik', 'Electricity saved, kWh / yr', 'rk', ind],
  ['if', 'Fuel saved, TOE / yr', 'rf', v => n0(v).toFixed(1)], ['ic', 'CO₂ reduced, t / yr', 'rc', ind], ['iv', 'Actual investment, ₹', 'rv', inr],
];

type DrawerProps = { session: Session | null; changes: Change[]; onClose: () => void; onSaved: (row: Row, change: Change | null) => void };
export function AuditDrawer({ row, ...rest }: DrawerProps & { row: Row | null }) {
  return row ? <Drawer key={row.c} row={row} {...rest} /> : null;
}
function Drawer({ row, session, changes, onClose, onSaved }: DrawerProps & { row: Row }) {
  const [editing, setEditing] = useState(false);
  const [impl, setImpl] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const panel = useRef<HTMLElement>(null);
  useOverlay(true, onClose);
  useEffect(() => { panel.current?.focus(); }, []);
  const r = row, signed = !!session;
  const [sbg, sfg] = STATUS_TONE[r.st];
  const cmpRow = (label: string, rec: number | null, imp: number | null, f: (v: unknown) => string) => {
    const a = n0(rec), b = n0(imp), p = a ? Math.round((100 * b) / a) : 0;
    return { label, rec: rec == null ? '—' : f(a), imp: imp == null ? '—' : f(b), pct: a ? p + '%' : '—', w: Math.min(100, p) + '%', pc: p >= 50 ? '#0B7A45' : p > 0 ? '#D67800' : '#A3A3A3' };
  };
  const cmp = [
    cmpRow('Measures (ECMs)', r.rn, r.in, ind), cmpRow('Cost savings / yr', r.ri, r.ii, inr), cmpRow('Electricity, kWh / yr', r.rk, r.ik, ind),
    cmpRow('Fuel, TOE / yr', r.rf, r.if, v => n0(v).toFixed(1)), cmpRow('CO₂, t / yr', r.rc, r.ic, ind), cmpRow('Investment', r.rv, r.iv, inr),
  ];
  // Thermal share: electricity savings in TOE (1 kWh = 0.000086 TOE) against fuel savings in TOE.
  const eT = n0(r.rk) * 0.000086, fT = n0(r.rf), tT = eT + fT;
  const share = (x: number) => (tT ? Math.round((100 * x) / tT) + '%' : '0%');
  const base = [
    { k: 'Electricity a year', v: r.e ? ind(r.e) + ' kWh' : '—' }, { k: 'Fuel a year', v: r.f ? n0(r.f).toFixed(0) + ' TOE' : '—' },
    { k: 'Energy cost a year', v: inr(r.cost) }, { k: 'CO₂ emissions a year', v: r.co2 ? ind(r.co2) + ' t' : '—' },
    { k: 'Sanctioned demand', v: r.kva ? ind(r.kva) + ' kVA' : '—' },
    { k: 'Audit started', v: (r.dt ? new Date(r.dt + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—') + (r.dy ? ' · ' + r.dy + ' days' : '') },
  ];
  const utils = (r.u || '').split(/[,&.]/).map(s => s.trim()).filter(Boolean).slice(0, 14);
  const history = changes.filter(c => c.code === r.c);
  const startEdit = () => {
    setErr('');
    setEditing(!editing);
    setImpl(Object.fromEntries(IMPL.map(([k]) => [k, r[k] == null ? '' : String(r[k])])));
  };
  const save = async () => {
    if (!session) return;
    const upd: Record<string, number | null> = {};
    for (const [k] of IMPL) upd[k] = parseNum(impl[k]);
    if (upd.in != null && r.rn != null && upd.in > r.rn) { setErr(`ECMs implemented (${upd.in}) cannot be more than recommended (${r.rn}).`); return; }
    const changed = IMPL.some(([k]) => (upd[k] ?? null) !== (r[k] ?? null));
    if (!changed) { setEditing(false); return; }
    setBusy(true); setErr('');
    try {
      const out = await team.update(session, r.c, { ...upd, st: statusFrom({ ...r, ...upd }, r.st) }, 'updated implementation');
      onSaved(out.row, out.change); setEditing(false);
    } catch (x) { setErr((x as ConsoleError).message); }
    finally { setBusy(false); }
  };
  const note = r.st === 'Implementation verified' ? 'Implemented figures are from the post-audit implementation report.'
    : r.st === 'Post-audit pending' ? 'Implementation is recorded at the post-audit visit, 3–5 months after the audit. That visit has not happened yet.'
      : 'The audit report is still being prepared.';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,.35)', display: 'flex', justifyContent: 'flex-end' }}>
      <button type="button" onClick={onClose} aria-label="Close audit" tabIndex={-1} style={{ flex: 1, border: 0, background: 'transparent', cursor: 'pointer' }} />
      <aside ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Audit ${r.c} details`} style={{ width: 'min(600px, 100%)', height: '100%', overflowY: 'auto', background: '#FFFFFF', boxShadow: '-20px 0 50px -20px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', outline: 'none' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: '#FFFFFF', borderBottom: '1px solid #EBEBEB', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="code n">{r.c}</span><span className="badge" style={{ background: sbg, color: sfg }}>{r.st}</span></span>
            <Close onClick={onClose} />
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
            {titleOf(r, signed)}{!signed && <Icon d={PATHS.lock} size={15} stroke="#6B6B6B" width={2.2} label="Name hidden until team sign-in" />}
          </h2>
          <span style={{ fontSize: 14, color: '#5E5E5E' }}>{signed ? r.s + ' · ' : ''}{r.p ? r.p + ' · ' : ''}{r.ci}, {r.stt} · {fyLabel(r.fy)}</span>
        </div>

        <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            <div style={{ padding: 14, borderRadius: 16, background: '#2B2644', color: '#FFFFFF' }}><span style={{ display: 'block', fontSize: 11, color: '#C9C5D6' }}>Saving recommended</span><span className="n" style={{ fontSize: 18, fontWeight: 600 }}>{inr(r.ri)}</span><span style={{ display: 'block', fontSize: 11, color: '#C9C5D6' }}>a year</span></div>
            <div style={{ padding: 14, borderRadius: 16, background: '#E1F0E8', color: '#0B7A45' }}><span style={{ display: 'block', fontSize: 11 }}>Saving achieved</span><span className="n" style={{ fontSize: 18, fontWeight: 600 }}>{inr(r.ii)}</span><span style={{ display: 'block', fontSize: 11 }}>a year</span></div>
            <div style={{ padding: 14, borderRadius: 16, background: '#F5F5F5' }}><span style={{ display: 'block', fontSize: 11, color: '#5E5E5E' }}>Payback</span><span className="n" style={{ fontSize: 18, fontWeight: 600 }}>{r.ri ? months((12 * n0(r.rv)) / r.ri) : '—'}</span><span style={{ display: 'block', fontSize: 11, color: '#5E5E5E' }}>{r.ii ? 'Actual ' + months((12 * n0(r.iv)) / r.ii) : 'Recommended'}</span></div>
          </div>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recommended vs implemented</h3>
              {signed && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' }}>
                  <a href={'#/companies/' + encodeURIComponent(r.c)} style={{ fontSize: 13, fontWeight: 600 }}>Open recommendation ledger →</a>
                  <button type="button" className="btn sm btnp" onClick={startEdit}>{editing ? 'Close editor' : 'Update implementation'}</button>
                </span>
              )}
            </div>
            {!editing ? (
              <>
                <div style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) 1fr 1fr 64px', gap: 10, padding: '9px 14px', background: '#F5F5F5', fontSize: 11, fontWeight: 600, color: '#5E5E5E' }}><span>Measure</span><span style={{ textAlign: 'right' }}>Recommended</span><span style={{ textAlign: 'right' }}>Implemented</span><span style={{ textAlign: 'right' }}>Share</span></div>
                  {cmp.map(c => (
                    <div key={c.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) 1fr 1fr 64px', gap: 10, padding: '11px 14px', borderTop: '1px solid #EBEBEB', alignItems: 'center', fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{c.label}</span>
                      <span className="n" style={{ textAlign: 'right' }}>{c.rec}</span>
                      <span className="n" style={{ textAlign: 'right', fontWeight: 600 }}>{c.imp}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}><span className="n" style={{ fontSize: 12, fontWeight: 600, color: c.pc === '#A3A3A3' ? '#6B6B6B' : c.pc }}>{c.pct}</span><span aria-hidden="true" style={{ width: '100%', height: 5, borderRadius: 999, background: '#EBEBEB', display: 'flex', overflow: 'hidden' }}><span style={{ width: c.w, background: c.pc }} /></span></span>
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>{note}</span>
              </>
            ) : (
              <div style={{ border: '1px solid #000000', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#5E5E5E' }}>Enter what the plant has carried out, from the post-audit visit or implementation report.</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 10 }}>
                  {IMPL.map(([k, label, rk, f]) => (
                    <label key={k} className="field" style={{ color: '#3A3A3A', gap: 4 }}>{label}
                      <input className="inp n" type="text" inputMode="decimal" value={impl[k] ?? ''} onChange={e => setImpl({ ...impl, [k]: e.target.value })} style={{ height: 42, fontSize: 14 }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#6B6B6B' }}>Recommended: {r[rk] == null ? '—' : f(r[rk])}</span>
                    </label>
                  ))}
                </div>
                {err && <div className="err" role="alert">{err}</div>}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn light sm ghost" onClick={() => setEditing(false)} style={{ height: 40 }}>Cancel</button>
                  <button type="button" className="btn sm btnp" onClick={save} disabled={busy} style={{ height: 40 }}>{busy ? 'Saving…' : 'Save and log change'}</button>
                </div>
              </div>
            )}
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Where the savings come from</h3>
            <div aria-hidden="true" style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', background: '#EBEBEB' }}><span style={{ width: share(eT), background: '#2B2644' }} /><span style={{ width: share(fT), background: '#D67800' }} /></div>
            <div style={{ display: 'flex', gap: '8px 20px', flexWrap: 'wrap', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#2B2644' }} />Electrical <strong className="n">{share(eT)}</strong> <span style={{ color: '#5E5E5E' }}>· {r.rk ? ind(r.rk) + ' kWh' : 'none'}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#D67800' }} />Thermal (fuel) <strong className="n">{share(fT)}</strong> <span style={{ color: '#5E5E5E' }}>· {r.rf ? n0(r.rf).toFixed(1) + ' TOE' : 'none'}</span></span>
            </div>
            <span style={{ fontSize: 13, color: '#3A3A3A' }}>Recommended savings are <strong className="n">{r.cost && r.ri ? Math.round((100 * r.ri) / r.cost) + '%' : '—'}</strong> of the plant's annual energy cost.</span>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Plant baseline</h3>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {base.map(b => <div key={b.k} style={{ padding: '12px 14px', borderRadius: 14, background: '#F5F5F5' }}><dt style={{ fontSize: 11, color: '#5E5E5E' }}>{b.k}</dt><dd className="n" style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{b.v}</dd></div>)}
            </dl>
          </section>

          {utils.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Systems assessed</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {utils.map(u => <span key={u} style={{ minHeight: 28, padding: '4px 10px', borderRadius: 999, border: '1px solid #D4D4D4', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>{u}</span>)}
              </div>
            </section>
          )}

          {signed && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Change history</h3>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, fontSize: 13, padding: '10px 0', borderTop: '1px solid #EBEBEB' }}>
                  <span className="n" style={{ color: '#6B6B6B', whiteSpace: 'nowrap', minWidth: 112 }}>{when(h.at)}</span>
                  <span><strong>{h.who}</strong> · {h.what}{h.detail ? ': ' + h.detail : ''}</span>
                </div>
              ))}
              {history.length === 0 && <span style={{ fontSize: 13, color: '#6B6B6B' }}>No changes since the master data sheet import.</span>}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------- add company

type AddField = [key: string, label: string, placeholder: string, hint: string];
const ADD: AddField[][] = [
  [['n', 'Industry name', 'e.g. Shree Ganesh Textiles Pvt. Ltd.', 'Required'], ['sr', 'Sector', 'e.g. Textile', 'Required'], ['p', 'Products manufactured', 'e.g. Saree', ''], ['ci', 'City / district', 'e.g. Surat', 'Required'],
    ['loc', 'Industry location', 'Plot, estate, taluka', 'Team only, never shown on the website'], ['dt', 'Audit start date', 'YYYY-MM-DD', ''], ['dy', 'Audit days', 'e.g. 4', ''], ['u', 'Utilities assessed', 'Comma separated', ''],
    ['kva', 'Sanctioned demand, kVA', 'e.g. 750', ''], ['ct', 'Plant contact & designation', '', 'Team only, never shown on the website'], ['cd', 'Plant contact mobile & email', '', 'Team only, never shown on the website']],
  [['e', 'Annual electricity, kWh', '', ''], ['f', 'Annual fuel, TOE', '', ''], ['cost', 'Annual energy cost, ₹', '', ''], ['co2', 'Existing CO₂, t', '', '']],
  [['rn', 'ECMs recommended', '', ''], ['rk', 'Electricity savings, kWh / yr', '', ''], ['rf', 'Fuel savings, TOE / yr', '', ''], ['ri', 'Cost savings, ₹ / yr', '', ''], ['rc', 'CO₂ reduction, t / yr', '', ''], ['rv', 'Investment proposed, ₹', '', '']],
  [['in', 'ECMs implemented', '', 'Fill after the post-audit visit'], ['ii', 'Actual cost savings, ₹ / yr', '', ''], ['ik', 'Electricity saved, kWh / yr', '', ''], ['if', 'Fuel saved, TOE / yr', '', ''], ['ic', 'CO₂ reduced, t / yr', '', ''], ['iv', 'Actual investment, ₹', '', '']],
];
const TABS = ['1 · Plant', '2 · Baseline', '3 · Recommended', '4 · Implemented'];
const TEXT_FIELDS = new Set(['n', 'sr', 'p', 'ci', 'loc', 'dt', 'u', 'ct', 'cd']);

type AddProps = { open: boolean; session: Session | null; rows: Row[]; onClose: () => void; onSaved: (row: Row, change: Change | null) => void };
export function AddCompany(props: AddProps) {
  return props.open && props.session ? <AddForm {...props} session={props.session} /> : null;
}
function AddForm({ session, rows, onClose, onSaved }: AddProps & { session: Session }) {
  const [tab, setTab] = useState(0);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useOverlay(true, onClose);
  // The number the server will give: the next one in the current financial year.
  const fy = rows.map(r => r.fy).sort().pop() || '2026-27';
  const nextCode = fy.slice(2, 4) + '-' + fy.slice(5, 7) + '/' + (Math.max(0, ...rows.filter(r => r.fy === fy).map(r => Number(r.c.split('/')[1]) || 0)) + 1);
  const ok = !!(draft.n?.trim() && draft.sr?.trim() && draft.ci?.trim());
  const save = async () => {
    if (!ok) { setTab(0); setErr('Industry name, sector and city are needed to save.'); return; }
    if (draft.dt && !/^\d{4}-\d{2}-\d{2}$/.test(draft.dt.trim())) { setTab(0); setErr('Write the audit start date as YYYY-MM-DD, for example 2026-11-12.'); return; }
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(draft)) fields[k] = TEXT_FIELDS.has(k) ? v.trim() : parseNum(v);
    setBusy(true); setErr('');
    try {
      const out = await team.add(session, fields);
      setDraft({}); onSaved(out.row, out.change); onClose();
    } catch (x) { setErr((x as ConsoleError).message); }
    finally { setBusy(false); }
  };
  return (
    <div style={backdrop}>
      <form role="dialog" aria-modal="true" aria-labelledby="addt" onSubmit={e => { e.preventDefault(); save(); }} style={{ width: '100%', maxWidth: 720, maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', borderRadius: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, background: '#FFFFFF', padding: '22px 26px 0', display: 'flex', flexDirection: 'column', gap: 14, borderBottom: '1px solid #EBEBEB', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 id="addt" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Add company</h2><span style={{ fontSize: 13, color: '#5E5E5E' }}>Same fields as the master data sheet. You can save after Plant and fill the rest later.</span></div>
            <Close onClick={onClose} />
          </div>
          <div role="tablist" style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {TABS.map((l, i) => (
              <button key={l} type="button" role="tab" aria-selected={i === tab} onClick={() => setTab(i)} style={{ height: 42, padding: '0 12px', border: 0, background: 'transparent', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', color: i === tab ? '#000000' : '#5E5E5E', borderBottom: '2px solid ' + (i === tab ? '#000000' : 'transparent') }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px 26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 14 }}>
          {ADD[tab].map(([k, label, ph, hint]) => (
            <label key={k} className="field" style={{ color: '#3A3A3A', gap: 5 }}>{label}
              <input className="inp" type="text" inputMode={TEXT_FIELDS.has(k) ? undefined : 'decimal'} value={draft[k] ?? ''} placeholder={ph} onChange={e => setDraft({ ...draft, [k]: e.target.value })} style={{ fontSize: 14 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: hint === 'Required' && !draft[k]?.trim() ? '#9A5200' : '#6B6B6B', minHeight: 14 }}>{hint}</span>
            </label>
          ))}
        </div>
        {err && <div className="err" role="alert" style={{ margin: '0 26px 12px' }}>{err}</div>}
        <div style={{ position: 'sticky', bottom: 0, background: '#FFFFFF', padding: '16px 26px 22px', borderTop: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#6B6B6B' }}>Saved as audit <strong className="n">{nextCode}</strong> · logged under your name</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn light ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btnp" disabled={busy} style={{ background: ok ? '#000000' : '#A3A3A3' }}>{busy ? 'Saving…' : 'Save company'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------- change log

export function ChangeLog({ open, changes, onClose }: { open: boolean; changes: Change[]; onClose: () => void }) {
  useOverlay(open, onClose);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(0,0,0,.35)', display: 'flex', justifyContent: 'flex-end' }}>
      <button type="button" onClick={onClose} aria-label="Close change log" tabIndex={-1} style={{ flex: 1, border: 0, background: 'transparent', cursor: 'pointer' }} />
      <aside role="dialog" aria-modal="true" aria-labelledby="logt" style={{ width: 'min(520px, 100%)', height: '100%', overflowY: 'auto', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 id="logt" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Change log</h2><span style={{ fontSize: 13, color: '#5E5E5E' }}>Every add and edit, with who made it. Newest first.</span></div>
          <Close onClick={onClose} />
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: '8px 24px 24px' }}>
          {changes.map((l, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #EBEBEB' }}>
              <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: '50%', background: '#2B2644', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials(l.who)}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <span style={{ fontSize: 14 }}><strong>{l.who}</strong> {l.what}</span>
                <span style={{ fontSize: 12, color: '#6B6B6B' }}><span className="n">{when(l.at)}</span>{l.code ? <> · audit <a className="n" href={'#/companies/' + encodeURIComponent(l.code)}>{l.code}</a></> : null}</span>
                {l.detail && <span style={{ fontSize: 12, color: '#3A3A3A', overflowWrap: 'anywhere' }}>{l.detail}</span>}
              </span>
            </li>
          ))}
          {changes.length === 0 && <li style={{ padding: '20px 0', fontSize: 14, color: '#5E5E5E' }}>No changes yet since the master data sheet was imported.</li>}
        </ol>
      </aside>
    </div>
  );
}
