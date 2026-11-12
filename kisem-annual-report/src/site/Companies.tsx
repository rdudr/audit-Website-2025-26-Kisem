// Team page: company list, recommendation ledger, company details and history.
// Only reachable with a FOX Console sign-in; every save goes to FOX Console and is logged there.
import { useEffect, useState } from 'react';
import type { SiteState } from '../App';
import { FYS, ind, inr, when, n0, NUMERIC, parseNum, STATUS_TONE, statusFrom, type Row } from '../data';
import { team, type ConsoleError, type Ecm } from '../lib/console';
import { Icon } from './Icon';
import { PATHS } from './icons';
import { AddCompany, SignIn } from './Overlays';
import { Logo } from './Logo';
import { useMasterExcel } from './useMasterExcel';

const SYSTEMS = ['Electrical distribution', 'Motors and drives', 'Compressed air', 'Pumping', 'Thermal / boiler', 'Furnace', 'Refrigeration and chillers', 'HVAC and cooling tower', 'Lighting', 'Solar and renewables', 'Power quality', 'Process', 'Other'];
const ESTATUS = ['Recommended', 'Accepted', 'In progress', 'Implemented', 'Not taken up'];
const ETONE: Record<string, [string, string]> = { Recommended: ['#EFEFEF', '#3A3A3A'], Accepted: ['#ECEAF2', '#2B2644'], 'In progress': ['#F8EBDA', '#9A5200'], Implemented: ['#E1F0E8', '#0B7A45'], 'Not taken up': ['#FBE8E9', '#C4161C'] };
// CEA grid emission factor used only for the ledger's own CO2 estimate when none is typed.
const GRID_KG = 0.716;

// The master sheet's rows, in sheet order: [label, key, group, team only]. Team-only text is
// write-only here: FOX Console stores it but never sends it back to the website.
const SHEET: [string, string, number, boolean?][] = [
  ['Industry Name', 'n', 0], ['Industry Location', 'loc', 0, true], ['City / district', 'ci', 0], ['Sector Classification', 'sr', 0], ['Product/Products Manufactured', 'p', 0],
  ['Production Capacity', 'cap', 0], ['No of Employees', 'emp', 0], ['Age of the Plant', 'age', 0],
  ['Name of the Plant Contact Personnel & Designation', 'ct', 0, true], ['Contact details of Plant Personnel (Mobile & Email)', 'cd', 0, true], ['Source of Lead', 'lead', 0, true],
  ['Date of Commencement of Energy Audit', 'dt', 0], ['Total number of Audit Days', 'dy', 0], ['List of Utilities/Components Assessed', 'u', 0], ['Sanctioned Demand (kVA)', 'kva', 0],
  ['Annual Electricity Consumption in kWh', 'e', 1], ['Annual Fuel Consumption in Metric ToE', 'f', 1], ['Annual Energy Cost in INR', 'cost', 1], ['Existing Overall CO2 Emission in Tonnes', 'co2', 1],
  ['No. of ECMs Recommended', 'rn', 2], ['Annual Electricity Savings Recommended in kWh', 'rk', 2], ['Annual Fuel Savings Recommended in Metric ToE', 'rf', 2], ['Annual Energy Cost Savings Recommended in INR', 'ri', 2], ['Annual CO2 Emmision Reduction Recommended in Tonnes', 'rc', 2], ['Total Investment Proposed in INR', 'rv', 2],
  ['No.of ECMs Implemented', 'in', 3], ['Overall Actual Investment Cost in INR', 'iv', 3], ['Actual Electricity Savings Achieved in kWh', 'ik', 3], ['Actual Fuel Savings Achieved in Metric ToE', 'if', 3], ['Actual Energy Cost Savings Achieved in INR', 'ii', 3], ['Actual CO2 Emmision Reduction Achieved in Tonnes', 'ic', 3],
];
const GROUPS = ['Plant', 'Baseline energy', 'Recommended (totals)', 'Implemented (after the post-audit visit)'];
type Tab = 'Ledger' | 'Details' | 'History';

export default function Companies({ state, code, pending, loginOpen, setLoginOpen }: { state: SiteState; code: string | null; pending: boolean; loginOpen: boolean; setLoginOpen: (v: boolean) => void }) {
  const { rows, session } = state;
  const excel = useMasterExcel(state);
  const [q, setQ] = useState('');
  const [fy, setFy] = useState('All');
  const [tab, setTab] = useState<Tab>('Ledger');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { document.title = 'Companies · KISEM audits (team)'; return () => { document.title = 'KISEM energy audits | IIT Gandhinagar'; }; }, []);

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <header className="hdr"><div className="hdrin"><Logo href="#top" sub="Company details and recommendation ledgers" /></div></header>
        <div className="wrap" style={{ padding: '64px 20px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <h1 className="h2">Companies are for the KISEM team</h1>
          <p className="lede" style={{ maxWidth: 560 }}>{pending ? 'Checking your sign-in with FOX Console…' : 'Sign in with your FOX Console login to see company names, the recommendation ledgers and the master data sheet.'}</p>
          {!pending && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button type="button" className="btn btnp" onClick={() => setLoginOpen(true)}>Team sign in</button><a className="btn light ghost" href="#audits">Back to the website</a></div>}
          {state.teamError && <div className="err" role="alert">{state.teamError}</div>}
        </div>
        <SignIn open={loginOpen} onClose={() => setLoginOpen(false)} onDone={state.signedIn} notice={state.teamError} />
      </div>
    );
  }

  const L = rows.filter(r => (fy === 'All' || r.fy === fy) && (!q.trim() || [r.c, r.n, r.ci, r.s].join(' ').toLowerCase().includes(q.trim().toLowerCase())));
  const r = rows.find(x => x.c === code) || L[0] || rows[0];
  const pick = (c: string) => window.location.assign('#/companies/' + encodeURIComponent(c));

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <header className="hdr">
        <div className="hdrin">
          <Logo href="#top" sub="Company details and recommendation ledgers" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <nav aria-label="Site" style={{ display: 'flex', gap: 4, fontSize: 14, fontWeight: 600 }}>
              <a href="#audits" className="ghost" style={{ padding: '8px 10px', borderRadius: 10, textDecoration: 'none' }}>Website</a>
              <span aria-current="page" className="hide-sm" style={{ padding: '8px 10px', borderRadius: 10, background: '#F5F5F5' }}>Companies</span>
              <a href="https://console.eassiitgn.page" className="ghost hide-sm" style={{ padding: '8px 10px', borderRadius: 10, textDecoration: 'none' }}>FOX Console</a>
            </nav>
            <button type="button" className="btn btnp" onClick={excel.download} disabled={excel.busy} style={{ height: 40, fontSize: 13 }}><Icon d={PATHS.download} size={15} /><span className="hide-sm">Download master Excel</span><span className="sr-only">Download master Excel</span></button>
            <button type="button" className="ghost" onClick={state.signOutNow} title="Sign out" style={{ height: 40, padding: '0 10px', border: '1px solid #D4D4D4', borderRadius: 12, background: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: '#2B2644', color: '#FFFFFF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{session.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
              <span className="hide-sm">{session.name}</span> · Sign out
            </button>
          </div>
        </div>
        {excel.msg && <div role="status" className="wrap" style={{ padding: '0 24px 10px', fontSize: 13, color: '#3A3A3A' }}>{excel.msg}</div>}
      </header>
      <nav aria-label="Breadcrumb" className="wrap" style={{ padding: '14px 20px 0', fontSize: 13, color: '#5E5E5E', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a href="#top">KISEM website</a><span aria-hidden="true">/</span><a href="#audits">All audits</a><span aria-hidden="true">/</span><span>Companies · {r?.c}</span>
      </nav>

      <div className="wrap cgrid" style={{ padding: '16px 20px 48px' }}>
        <aside className="card" style={{ overflow: 'hidden', position: 'sticky', top: 80 }}>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid #EBEBEB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Companies <span className="n" style={{ color: '#5E5E5E', fontWeight: 500 }}>{rows.length}</span></h2>
              <button type="button" className="btn sm btnp" onClick={() => setShowAdd(true)}><Icon d={PATHS.plus} size={14} />Add company</button>
            </div>
            <label className="field">Find a company<input className="inp" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Name, audit number or city" style={{ height: 40, fontSize: 14 }} /></label>
            <div role="group" aria-label="Financial year" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['All', ...FYS].map(y => <button key={y} type="button" className="pill" aria-pressed={fy === y} onClick={() => setFy(y)} style={{ height: 30, padding: '0 10px', fontSize: 12 }}>{y === 'All' ? 'All' : 'FY ' + y.slice(2)}</button>)}
            </div>
          </div>
          <div style={{ maxHeight: 'calc(100vh - 330px)', minHeight: 200, overflowY: 'auto' }}>
            {L.map(c => {
              const on = c.c === r?.c;
              return (
                <button key={c.c} type="button" className="co" aria-pressed={on} onClick={() => pick(c.c)}
                  style={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) 10px', gap: 10, alignItems: 'center', padding: '10px 16px', border: 0, borderLeft: '3px solid ' + (on ? '#000000' : 'transparent'), borderBottom: '1px solid #F0F0F0', background: on ? '#F5F5F5' : '#FFFFFF', textAlign: 'left', cursor: 'pointer' }}>
                  <span className="code n" style={{ fontSize: 11 }}>{c.c}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.n || 'Name not loaded'}</span>
                    <span style={{ fontSize: 12, color: '#5E5E5E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.s} · {c.ci}</span>
                  </span>
                  <span title={c.st} style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_TONE[c.st][2] }}><span className="sr-only">{c.st}</span></span>
                </button>
              );
            })}
            {L.length === 0 && <p style={{ padding: 16, margin: 0, fontSize: 13, color: '#5E5E5E' }}>No company matches.</p>}
          </div>
        </aside>

        {r && <Company key={r.c} r={r} tab={tab} setTab={setTab} state={state} />}
      </div>
      <AddCompany open={showAdd} session={session} rows={rows} onClose={() => setShowAdd(false)} onSaved={(row, c) => { state.applySaved(row, c); setTab('Details'); pick(row.c); }} />
    </div>
  );
}

// ---------------------------------------------------------------- one company

function Company({ r, tab, setTab, state }: { r: Row; tab: Tab; setTab: (t: Tab) => void; state: SiteState }) {
  const session = state.session!;
  const [items, setItems] = useState<Ecm[] | null>(null);
  const [ledgerErr, setLedgerErr] = useState('');
  const history = state.changes.filter(c => c.code === r.c);
  const [sbg, sfg] = STATUS_TONE[r.st];

  useEffect(() => {
    let live = true;
    team.ledger(session, r.c).then(o => { if (live) setItems(o.items || []); }).catch((e: ConsoleError) => { if (live) { setItems([]); setLedgerErr(e.message); } });
    return () => { live = false; };
  }, [session, r.c]);

  const tabs: [Tab, string, number][] = [['Ledger', 'Recommendation ledger', items?.length ?? 0], ['Details', 'Company details', SHEET.length], ['History', 'History', history.length]];
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      <section className="card" style={{ padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="code n">{r.c}</span><span className="badge" style={{ background: sbg, color: sfg }}>{r.st}</span></span>
            <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 600, letterSpacing: '-0.02em' }}>{r.n || 'New company'}</h1>
            <span style={{ fontSize: 14, color: '#5E5E5E' }}>{[r.p, r.ci, 'FY ' + r.fy.replace('-', '–')].filter(Boolean).join(' · ')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignSelf: 'flex-start' }}>
            {[['Measures', r.rn ? `${n0(r.in)} / ${r.rn}` : '—'], ['Saving / yr', inr(r.ri, 2)], ['Achieved', inr(r.ii, 2)]].map(([k, v]) => (
              <div key={k} style={{ padding: '10px 14px', borderRadius: 14, background: '#F5F5F5', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 104 }}><span style={{ fontSize: 11, color: '#5E5E5E' }}>{k}</span><span className="n" style={{ fontSize: 16, fontWeight: 600 }}>{v}</span></div>
            ))}
          </div>
        </div>
        <div role="tablist" aria-label="Company sections" style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(([k, l, n]) => (
            <button key={k} type="button" role="tab" aria-selected={k === tab} onClick={() => setTab(k)}
              style={{ height: 44, padding: '0 12px', border: 0, background: 'transparent', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', color: k === tab ? '#000000' : '#5E5E5E', borderBottom: '2px solid ' + (k === tab ? '#000000' : 'transparent'), display: 'flex', alignItems: 'center', gap: 6 }}>
              {l}<span className="n" style={{ fontSize: 12, padding: '1px 7px', borderRadius: 999, background: '#F0F0F0', color: '#3A3A3A' }}>{n}</span>
            </button>
          ))}
        </div>
      </section>
      {tab === 'Ledger' && <Ledger r={r} items={items} setItems={setItems} err={ledgerErr} state={state} />}
      {tab === 'Details' && <Details r={r} state={state} />}
      {tab === 'History' && (
        <section className="card" style={{ padding: '8px 22px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < history.length - 1 ? '1px solid #EBEBEB' : 0 }}>
              <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: '50%', background: '#2B2644', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{h.who.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}><span style={{ fontSize: 14 }}><strong>{h.who}</strong> {h.what}</span><span className="n" style={{ fontSize: 12, color: '#6B6B6B' }}>{when(h.at)}</span>{h.detail && <span style={{ fontSize: 12, color: '#3A3A3A', overflowWrap: 'anywhere' }}>{h.detail}</span>}</span>
            </div>
          ))}
          {history.length === 0 && <p style={{ fontSize: 14, color: '#5E5E5E' }}>No changes to this company since the master sheet was imported.</p>}
        </section>
      )}
    </main>
  );
}

// ---------------------------------------------------------------- ledger

const blankEcm = (): Record<string, string> => ({ m: '', sys: SYSTEMS[0], st: 'Recommended' });

function Ledger({ r, items, setItems, err, state }: { r: Row; items: Ecm[] | null; setItems: (i: Ecm[]) => void; err: string; state: SiteState }) {
  const session = state.session!;
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [editNo, setEditNo] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const list = items || [];

  const sumL = (k: keyof Ecm, only?: (e: Ecm) => boolean) => list.filter(only || (() => true)).reduce((a, e) => a + n0(e[k]), 0);
  const tk = sumL('k'), tf = sumL('f'), ts = sumL('s'), tv = sumL('v'), tc = sumL('c');
  const isImpl = (e: Ecm) => e.st === 'Implemented';
  const ta = sumL('a', isImpl), impl = list.filter(isImpl).length;
  // The ledger's measures checked against the company's totals from the master sheet.
  const rec = (() => {
    if (!list.length) return { bg: '#F5F5F5', dot: '#A3A3A3', text: `Master sheet totals for this company: ${r.rn ? `${r.rn} measures, ${inr(r.ri, 2)} a year, ${inr(r.rv, 2)} investment.` : 'none yet.'} Enter the measures one by one to check them against these totals.`, apply: false };
    const dN = list.length - n0(r.rn), match = dN === 0 && Math.abs(ts - n0(r.ri)) < 1;
    return match ? { bg: '#E1F0E8', dot: '#0B7A45', text: `The ledger matches the master sheet: ${list.length} measures, ${inr(ts, 2)} a year.`, apply: false }
      : { bg: '#F8EBDA', dot: '#D67800', text: `Ledger: ${list.length} measures, ${inr(ts, 2)} a year. Master sheet: ${n0(r.rn)} measures, ${inr(r.ri, 2)}. ${dN < 0 ? `${-dN} measure(s) still to enter.` : dN > 0 ? 'The ledger has more measures than the sheet.' : 'The savings differ.'}`, apply: true };
  })();

  const persist = async (next: Ecm[], what: string, detail: string) => {
    setBusy(true); setSaveErr('');
    try { const out = await team.saveLedger(session, r.c, next, what, detail); setItems(out.items); if (out.change) state.applySaved(r, out.change); return true; }
    catch (e) { setSaveErr((e as ConsoleError).message); return false; }
    finally { setBusy(false); }
  };

  const E = form || {};
  const autoC = parseNum(E.k) ? Math.round(((parseNum(E.k) as number) * GRID_KG) / 1000 * 10) / 10 : 0;
  const ok = !!(E.m?.trim() && parseNum(E.s));
  const calc = parseNum(E.s)
    ? `Payback ${parseNum(E.v) ? Math.round((12 * (parseNum(E.v) as number)) / (parseNum(E.s) as number) * 10) / 10 + ' months' : 'immediate (no cost)'} · CO₂ ${parseNum(E.c) ?? autoC} t / yr${parseNum(E.c) == null && autoC ? ` (from kWh at ${GRID_KG} kg/kWh)` : ''}`
    : 'Enter the cost saving to see the payback.';
  const saveEcm = async () => {
    if (!ok) { setSaveErr('A measure needs a name and its cost saving.'); return; }
    const e: Ecm = { m: E.m.trim(), sys: E.sys || SYSTEMS[0], st: E.st || 'Recommended', k: parseNum(E.k), f: parseNum(E.f), s: parseNum(E.s), v: parseNum(E.v) ?? 0, c: parseNum(E.c) ?? autoC, a: parseNum(E.a), by: (E.by || '').trim() };
    const next = editNo == null ? [...list, e] : list.map((x, j) => (j === editNo ? e : x));
    const what = editNo == null ? 'added a measure' : `edited measure #${editNo + 1}`;
    if (await persist(next, what, `${e.m} · ${inr(e.s)} / yr · ${e.st}`)) { setForm(null); setEditNo(null); }
  };
  const remove = async (i: number) => {
    const e = list[i];
    if (!confirm(`Remove measure #${i + 1} "${e.m}" from the ledger? It stays in the change log.`)) return;
    await persist(list.filter((_, j) => j !== i), 'removed a measure', `#${i + 1} ${e.m}`);
  };
  const applyTotals = async () => {
    const upd = { rn: list.length, rk: tk, rf: tf, ri: ts, rv: tv, rc: tc, in: impl, ii: ta };
    setBusy(true); setSaveErr('');
    try {
      const out = await team.update(session, r.c, { ...upd, st: statusFrom({ ...r, ...upd }, r.st === 'Report under process' && list.length ? 'Post-audit pending' : r.st) }, 'updated company totals from the ledger');
      state.applySaved(out.row, out.change);
    } catch (e) { setSaveErr((e as ConsoleError).message); }
    finally { setBusy(false); }
  };
  const nums: [string, string, string][] = [['k', 'Electricity saving, kWh / yr', '0'], ['f', 'Fuel saving, TOE / yr', '0'], ['s', 'Cost saving, ₹ / yr', 'Required'], ['v', 'Investment, ₹', '0 if no cost'], ['c', 'CO₂ reduction, t / yr', 'Auto from kWh if empty'], ['a', 'Achieved saving, ₹ / yr', 'When implemented'], ['by', 'Verified by', 'Name']];

  return (
    <section className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 620 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Recommendation ledger</h2>
          <span style={{ fontSize: 13, color: '#5E5E5E' }}>One row per energy conservation measure. Totals here feed the company's figures and the master sheet.</span>
        </div>
        <button type="button" className="btn sm btnp" onClick={() => { setForm(form ? null : blankEcm()); setEditNo(null); setSaveErr(''); }}>{form ? 'Close' : 'Add measure'}</button>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 14, background: rec.bg, flexWrap: 'wrap' }}>
        <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: rec.dot }} />
        <span style={{ flex: '1 1 300px', fontSize: 13, lineHeight: 1.5 }}>{items == null ? 'Loading the ledger…' : rec.text}</span>
        {rec.apply && <button type="button" className="btn light sm ghost" onClick={applyTotals} disabled={busy}>Use ledger totals for the company</button>}
      </div>
      {err && <div className="err" role="alert">{err}</div>}

      {form && (
        <div style={{ border: '1px solid #000000', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{editNo == null ? `New measure #${list.length + 1}` : `Edit measure #${editNo + 1}`}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 10 }}>
            <label className="field" style={{ gridColumn: '1 / -1', color: '#3A3A3A' }}>Measure<input className="inp" value={E.m || ''} onChange={e => setForm({ ...E, m: e.target.value })} placeholder="e.g. Arrest compressed air leaks in the weaving section" style={{ height: 40, fontSize: 14 }} /></label>
            <label className="field" style={{ color: '#3A3A3A' }}>System<select className="inp" value={E.sys} onChange={e => setForm({ ...E, sys: e.target.value })} style={{ height: 40 }}>{SYSTEMS.map(o => <option key={o}>{o}</option>)}</select></label>
            <label className="field" style={{ color: '#3A3A3A' }}>Status<select className="inp" value={E.st} onChange={e => setForm({ ...E, st: e.target.value })} style={{ height: 40 }}>{ESTATUS.map(o => <option key={o}>{o}</option>)}</select></label>
            {nums.map(([k, label, ph]) => (
              <label key={k} className="field" style={{ color: '#3A3A3A' }}>{label}<input className="inp n" inputMode={k === 'by' ? undefined : 'decimal'} value={E[k] || ''} placeholder={ph} onChange={e => setForm({ ...E, [k]: e.target.value })} style={{ height: 40, fontSize: 14 }} /></label>
            ))}
          </div>
          <span className="n" style={{ fontSize: 13, color: '#3A3A3A' }}>{calc}</span>
          {saveErr && <div className="err" role="alert">{saveErr}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn light sm ghost" onClick={() => { setForm(null); setEditNo(null); }}>Cancel</button>
            <button type="button" className="btn sm btnp" onClick={saveEcm} disabled={busy} style={{ background: ok ? '#000000' : '#A3A3A3' }}>{busy ? 'Saving…' : 'Save measure'}</button>
          </div>
        </div>
      )}
      {!form && saveErr && <div className="err" role="alert">{saveErr}</div>}

      {list.length > 0 ? (
        <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14 }}>
          <table className="tbl" style={{ minWidth: 1040 }}>
            <thead><tr><th>#</th><th>Measure</th><th>System</th><th className="r">kWh / yr</th><th className="r">Fuel TOE / yr</th><th className="r">Saving ₹ / yr</th><th className="r">Investment ₹</th><th className="r">Payback</th><th className="r">CO₂ t / yr</th><th>Status</th><th className="r">Achieved ₹ / yr</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {list.map((e, i) => (
                <tr key={i} className="lrow">
                  <td className="n">{i + 1}</td>
                  <td style={{ minWidth: 220 }}>{e.m}{e.by && <span style={{ display: 'block', fontSize: 11, color: '#6B6B6B' }}>Verified by {e.by}</span>}</td>
                  <td>{e.sys}</td>
                  <td className="n r">{e.k ? ind(e.k) : '—'}</td>
                  <td className="n r">{e.f ? n0(e.f).toFixed(1) : '—'}</td>
                  <td className="n r">{inr(e.s, 2)}</td>
                  <td className="n r">{inr(e.v, 2)}</td>
                  <td className="n r">{e.s ? (e.v ? Math.round((12 * n0(e.v)) / n0(e.s) * 10) / 10 + ' mo' : 'No cost') : '—'}</td>
                  <td className="n r">{e.c ? ind(e.c) : '—'}</td>
                  <td><span className="badge" style={{ background: (ETONE[e.st] || ETONE.Recommended)[0], color: (ETONE[e.st] || ETONE.Recommended)[1] }}>{e.st}</span></td>
                  <td className="n r">{isImpl(e) ? inr(e.a, 2) : '—'}</td>
                  <td className="r"><span style={{ display: 'inline-flex', gap: 2 }}>
                    <button type="button" className="ghost" onClick={() => { setForm(Object.fromEntries(Object.entries(e).map(([k, v]) => [k, v == null ? '' : String(v)]))); setEditNo(i); setSaveErr(''); }} aria-label={`Edit measure ${i + 1}`} style={{ width: 34, height: 34, border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={PATHS.edit} size={15} /></button>
                    <button type="button" className="ghost" onClick={() => remove(i)} disabled={busy} aria-label={`Remove measure ${i + 1}`} style={{ width: 34, height: 34, border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4161C' }}><Icon d={PATHS.trash} size={15} /></button>
                  </span></td>
                </tr>
              ))}
              <tr style={{ fontWeight: 600, background: '#FAFAFA' }}>
                <td /><td colSpan={2}>Total · {list.length} measures · {impl} implemented</td>
                <td className="n r">{ind(tk)}</td><td className="n r">{tf.toFixed(1)}</td><td className="n r">{inr(ts, 2)}</td><td className="n r">{inr(tv, 2)}</td><td className="n r">{ts ? Math.round((12 * tv) / ts) + ' mo' : '—'}</td><td className="n r">{ind(tc)}</td><td /><td className="n r">{inr(ta, 2)}</td><td />
              </tr>
            </tbody>
          </table>
        </div>
      ) : items != null && !form && (
        <div style={{ border: '1px dashed #D4D4D4', borderRadius: 16, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>No measures entered for this company yet</span>
          <span style={{ fontSize: 13, color: '#5E5E5E', maxWidth: 460 }}>The master sheet only holds this company's totals. Add each measure from the audit report so the website can show them one by one.</span>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- details

function Details({ r, state }: { r: Row; state: SiteState }) {
  const session = state.session!;
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let live = true;
    team.privateFields(session, r.c).then(o => { if (live) setFilled(o.filled || {}); }).catch(() => {});
    return () => { live = false; };
  }, [session, r.c]);

  const valueOf = (k: string) => { const v = (r as unknown as Record<string, unknown>)[k]; return v == null ? '' : String(v); };
  const D = (k: string, team?: boolean) => (draft && k in draft ? draft[k] : team ? '' : valueOf(k));
  const changedKeys = draft ? Object.keys(draft).filter(k => {
    const teamOnly = SHEET.find(s => s[1] === k)?.[3];
    return teamOnly ? draft[k].trim() !== '' : draft[k] !== valueOf(k);
  }) : [];
  const dirty = changedKeys.length > 0;
  const save = async () => {
    if (!dirty) return;
    if (draft?.n !== undefined && !draft.n.trim()) { setErr('The industry name cannot be empty.'); return; }
    if (draft?.dt && !/^\d{4}-\d{2}-\d{2}$/.test(draft.dt.trim())) { setErr('Write the audit start date as YYYY-MM-DD, for example 2026-11-12.'); return; }
    const fields: Record<string, unknown> = {};
    for (const k of changedKeys) fields[k] = NUMERIC.has(k) ? parseNum(draft![k]) : draft![k].trim();
    const merged = { ...r, ...fields } as Row;
    fields.st = statusFrom(merged, r.st);
    setBusy(true); setErr(''); setSaved(false);
    try {
      const out = await team.update(session, r.c, fields, 'edited company details');
      state.applySaved(out.row, out.change); setDraft(null); setSaved(true);
      setFilled(f => ({ ...f, ...Object.fromEntries(changedKeys.filter(k => SHEET.find(s => s[1] === k)?.[3]).map(k => [k, true])) }));
    } catch (e) { setErr((e as ConsoleError).message); }
    finally { setBusy(false); }
  };
  return (
    <section className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 620 }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Company details</h2><span style={{ fontSize: 13, color: '#5E5E5E' }}>The same rows as the master data sheet. Fields marked "team only" are kept in FOX Console and never appear on the website, not even here: type a new value to replace what is stored.</span></div>
        <span role="status" style={{ fontSize: 13, fontWeight: 600, color: dirty ? '#9A5200' : '#0B7A45' }}>{dirty ? 'Unsaved changes' : saved ? 'Saved' : 'All saved'}</span>
      </div>
      {GROUPS.map((label, gi) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#5E5E5E', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 12 }}>
            {SHEET.filter(s => s[2] === gi).map(([lab, k, , teamOnly]) => {
              const changed = changedKeys.includes(k);
              const hint = changed ? (teamOnly ? 'Will replace the stored value' : `Changed · was ${valueOf(k) || 'empty'}`)
                : teamOnly ? (filled[k] ? 'Team only · stored in FOX Console' : 'Team only · nothing stored yet') : '';
              return (
                <label key={k} className="field" style={{ color: '#3A3A3A', gap: 5 }}>{lab}
                  <input className="inp" type={teamOnly ? 'text' : 'text'} inputMode={NUMERIC.has(k) ? 'decimal' : undefined} autoComplete="off"
                    value={D(k, teamOnly)} placeholder={teamOnly ? (filled[k] ? '•••••• (hidden)' : '') : NUMERIC.has(k) ? '0' : ''}
                    onChange={e => setDraft({ ...(draft || {}), [k]: e.target.value })}
                    style={{ fontSize: 14, background: changed ? '#FFFBF3' : '#FFFFFF' }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: changed ? '#9A5200' : '#6B6B6B', minHeight: 14 }}>{hint}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {err && <div className="err" role="alert">{err}</div>}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#FFFFFF', padding: '12px 0 0', borderTop: '1px solid #EBEBEB' }}>
        <button type="button" className="btn light ghost" onClick={() => { setDraft(null); setErr(''); }} disabled={!dirty}>Discard changes</button>
        <button type="button" className="btn btnp" onClick={save} disabled={!dirty || busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </section>
  );
}
