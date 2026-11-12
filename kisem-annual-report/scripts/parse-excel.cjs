/**
 * KISEM audit website: master data sheet import and clean-up.
 *
 *   node scripts/parse-excel.cjs [master.xlsx]
 *
 * Reads the master sheet named on the command line, or else the newest
 * "IIT Gandhinagar KISEM - Audit Master Data Sheet Latest <year>.xlsx" in the repository root.
 *
 * Writes two files, and only the first one is ever published:
 *   src/data/audits.json             PUBLIC. Bundled into the website. No company names, no plant
 *                                    addresses, no plant contacts, no source of lead.
 *   ../private/kisem-master-full.json  TEAM ONLY. Everything, names and contacts included. It is
 *                                    git-ignored and goes to FOX Console with
 *                                    `node scripts/site-import.mjs <file>` on the server. The website
 *                                    gets names from FOX Console after a team member signs in.
 *
 * Rows are found by their label in column A, not by position: rows get added or moved in the
 * master sheet from year to year. The label is compared with spaces, stars and dots removed.
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const SHEET_NAME = /^IIT Gandhinagar KISEM - Audit Master Data Sheet Latest \d{4}-\d{2}\.xlsx$/;
const EXCEL_FILE = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, fs.readdirSync(ROOT).filter(f => SHEET_NAME.test(f)).sort().pop() || '');
const PUBLIC_FILE = path.join(__dirname, '../src/data/audits.json');
const PRIVATE_FILE = path.join(ROOT, 'private/kisem-master-full.json');

if (!fs.existsSync(EXCEL_FILE)) {
  console.error('No master data sheet found. Put it in the repository root or name it on the command line.');
  process.exit(1);
}
console.log(`Reading ${path.basename(EXCEL_FILE)}`);
const wb = XLSX.readFile(EXCEL_FILE);
const rowsOf = name => XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: null });

// ---------------------------------------------------------------- helpers

const squash = v => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const text = v => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim());

// A number, or null when the cell is empty or holds a dash. Blank stays blank: a 0 would read as
// "measured, nothing saved", which is not what an empty cell means.
function numOrNull(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).replace(/,/g, '').trim();
  if (!s || /^[-–—]+$/.test(s)) return null;
  const n = Number(s);
  return isFinite(n) ? n : null;
}

function isoDate(v) {
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}` : null;
  }
  const s = text(v);
  const m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

// The master sheet's rows, in sheet order: [row label (squashed prefix), key, team only].
// The keys are the website's short names; the same keys are used by FOX Console and the
// master Excel download, so they must not change.
const SHEET_ROWS = [
  ['industryname', 'n', true],
  ['industrylocation', 'loc', true],
  ['sectorclassification', 'sr'],
  ['productproducts', 'p'],
  ['productioncapacity', 'cap'],
  ['noofemployees', 'emp'],
  ['ageoftheplant', 'age'],
  ['nameoftheplantcontact', 'ct', true],
  ['contactdetailsofplant', 'cd', true],
  ['sourceoflead', 'lead', true],
  ['dateofcommencement', 'dt'],
  ['totalnumberofauditdays', 'dy'],
  ['totalnoofmanpower', 'mp'],
  ['listofutilities', 'u'],
  ['sanctioneddemand', 'kva'],
  ['annualelectricityconsumptioninkwh', 'e'],
  ['annualfuelconsumptioninmetrictoe', 'f'],
  ['annualenergyconsumptioninmetrictoe', 'toe'],
  ['annualenergycostininr', 'cost'],
  ['annualelectricitycostininr', 'ecost'],
  ['annualfuelcostininr', 'fcost'],
  ['existingoverallco2', 'co2'],
  ['noofecmsrecommended', 'rn'],
  ['annualelectricitysavingsrecommended', 'rk'],
  ['annualfuelsavingsrecommended', 'rf'],
  ['annualenergysavingsrecommended', 'rt'],
  ['annualenergycostsavingsrecommended', 'ri'],
  ['annualco2emmisionreductionrecommended', 'rc'],
  ['totalinvestmentproposed', 'rv'],
  ['noofecmsimplemented', 'in'],
  ['overallactualinvestment', 'iv'],
  ['actualelectricitysavingsachieved', 'ik'],
  ['actualfuelsavingsachieved', 'if'],
  ['actualenergycostsavingsachieved', 'ii'],
  ['actualco2emmisionreductionachieved', 'ic'],
];
const TEXT_KEYS = new Set(['n', 'loc', 'sr', 'p', 'cap', 'ct', 'cd', 'lead', 'mp', 'u']);
const TEAM_ONLY = new Set(SHEET_ROWS.filter(r => r[2]).map(r => r[1]));
// What the public website may show. Everything else stays in the private file.
const PUBLIC_KEYS = ['c', 'fy', 's', 'sr', 'p', 'ci', 'stt', 'dt', 'dy', 'u', 'kva', 'e', 'f', 'cost', 'co2',
  'rn', 'rk', 'rf', 'ri', 'rc', 'rv', 'in', 'iv', 'ik', 'if', 'ii', 'ic', 'st', 'lat', 'lng'];

// ---------------------------------------------------------------- clean-up rules

// Sector classification as typed in the sheet -> the sector group the website filters by.
// First match wins, so the more specific words come first.
const SECTOR_GROUPS = [
  [/cetp|effluent/, 'CETP'],
  [/cold stor|cold stro|\bice\b|ice factory/, 'Cold storage & ice'],
  [/casting|foundry/, 'Foundry & casting'],
  [/steel|engineering|fabricat|galvani|switchgear|metal/, 'Steel & engineering'],
  [/chemical|pesticide|\bdyes?\b|pigment/, 'Chemical'],
  [/textile|dyeing|printing|nonwoven|fabric|silk|saree/, 'Textile'],
  [/diamond|jewel/, 'Diamond & jewellery'],
  [/ceramic|tile/, 'Ceramic'],
  [/paper|pulp/, 'Paper & pulp'],
  [/pharma/, 'Pharma'],
  [/laminat|plastic|packag/, 'Plastics & laminates'],
  [/sea ?food|fish/, 'Seafood'],
  [/sugar|food|fmcg|flour|masala|spice/, 'Food & FMCG'],
  [/solar|renewable/, 'Solar'],
  [/timber|plywood|wood/, 'Timber'],
  [/manufactur/, 'Manufacturing'],
];
function sectorGroup(raw) {
  const s = text(raw).toLowerCase();
  if (!s) return 'Other';
  for (const [re, group] of SECTOR_GROUPS) if (re.test(s)) return group;
  return text(raw).replace(/\b\w/g, c => c.toUpperCase());
}

// One spelling per district. The district row under the audit numbers is used first; when it
// is empty, the district is read from the plant's address.
const DISTRICTS = {
  ahmedabad: 'Ahmedabad', vatva: 'Ahmedabad', gandhinagar: 'Gandhinagar', gandhinaagar: 'Gandhinagar',
  surat: 'Surat', palsana: 'Surat', bharuch: 'Bharuch', vapi: 'Vapi', morbi: 'Morbi',
  aravalli: 'Aravalli', modasa: 'Aravalli', modassa: 'Aravalli',
  sabarkantha: 'Sabarkantha', sbarkantha: 'Sabarkantha', sabarkata: 'Sabarkantha', sabarkatha: 'Sabarkantha',
  porbandar: 'Porbandar', veraval: 'Veraval', rajkot: 'Rajkot', mehsana: 'Mehsana', mahesana: 'Mehsana',
  gandhidham: 'Gandhidham', kutch: 'Gandhidham', bhachau: 'Gandhidham', daman: 'Daman',
  abu: 'Abu Road', aburoad: 'Abu Road', sirohi: 'Abu Road', bhavnagar: 'Bhavnagar', botad: 'Botad',
  vadodara: 'Vadodara', baroda: 'Vadodara',
};
function cleanDistrict(districtCell, location) {
  const d = squash(districtCell);
  if (DISTRICTS[d]) return DISTRICTS[d];
  const loc = String(location || '').toLowerCase();
  for (const [k, v] of Object.entries(DISTRICTS)) if (k.length > 3 && loc.includes(k)) return v;
  return text(districtCell) || 'Not recorded';
}
const stateOf = district => (district === 'Abu Road' ? 'Rajasthan' : district === 'Daman' ? 'Daman' : 'Gujarat');

const COORDS = {
  Ahmedabad: [23.0225, 72.5714], Gandhinagar: [23.2156, 72.6369], Surat: [21.1702, 72.8311], Bharuch: [21.7051, 72.9959],
  Vapi: [20.3749, 72.9048], Morbi: [22.8175, 70.8378], Aravalli: [23.5039, 73.0065], Sabarkantha: [23.9833, 73.05],
  Porbandar: [21.6417, 69.6293], Veraval: [20.9014, 70.372], Rajkot: [22.3039, 70.8022], Mehsana: [23.588, 72.3693],
  Gandhidham: [23.0753, 70.1337], Daman: [20.3974, 72.8328], 'Abu Road': [24.4813, 72.7766], Bhavnagar: [21.7645, 72.1519],
  Botad: [21.9236, 71.6669], Vadodara: [22.3072, 73.1812],
};
// Same small spread on every run, so markers in one district do not sit on top of each other
// and the data file only changes when the data does.
function jitter(id, salt) {
  let h = 2166136261;
  for (const ch of `${id}|${salt}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (((h >>> 0) % 10000) / 10000 - 0.5) * 0.05;
}

// The status line above each audit column -> one of three statuses.
function statusOf(sheetStatus, r) {
  const s = squash(sheetStatus);
  if (s.includes('implementation')) return 'Implementation verified';
  if (s.includes('postassessment') || s.includes('postaudit')) return 'Post-audit pending';
  if (s.includes('reportunder') || s.includes('underprocess')) return 'Report under process';
  if ((r.in ?? 0) > 0) return 'Implementation verified';
  if ((r.rn ?? 0) > 0) return 'Post-audit pending';
  return 'Report under process';
}

// ---------------------------------------------------------------- reading one sheet

function readSheet(sheetName, firstCol) {
  const data = rowsOf(sheetName);
  const auditRow = data.findIndex(r => r && squash(r[0]) === 'auditnumbers');
  if (auditRow < 0) { console.warn(`  ! ${sheetName}: no "Audit Numbers" row, skipped`); return []; }
  const rowOf = {};
  for (const [label, key] of SHEET_ROWS) {
    rowOf[key] = data.findIndex((r, j) => j > auditRow && r && squash(r[0]).startsWith(label));
  }
  const missing = SHEET_ROWS.filter(([, k]) => rowOf[k] < 0).map(([l]) => l);
  if (missing.length) console.warn(`  ! ${sheetName}: rows not found: ${missing.join(', ')}`);
  const header = data[auditRow] || [];
  const statusRow = auditRow >= 2 ? data[auditRow - 2] : null;
  const out = [];
  for (let col = firstCol; col < header.length; col++) {
    const code = text(header[col]);
    if (!/^\d{2}-\d{2}\/\d+$/.test(code)) continue;
    const r = { c: code, fy: `20${code.slice(0, 2)}-${code.slice(3, 5)}`, sheet: sheetName };
    for (const [, key] of SHEET_ROWS) {
      const v = rowOf[key] >= 0 && data[rowOf[key]] ? data[rowOf[key]][col] : null;
      r[key] = key === 'dt' ? isoDate(v) : TEXT_KEYS.has(key) ? text(v) : numOrNull(v);
    }
    // Contact numbers are text even when Excel stored them as numbers.
    if (r.cd == null || r.cd === '') r.cd = text(rowOf.cd >= 0 && data[rowOf.cd] ? data[rowOf.cd][col] : '');
    r.ci = cleanDistrict(data[auditRow + 1] && data[auditRow + 1][col], r.loc);
    r.stt = stateOf(r.ci);
    r.s = sectorGroup(r.sr);
    r.st = statusOf(statusRow && statusRow[col], r);
    const at = COORDS[r.ci] || [22.2587, 71.1924];
    r.lat = +(at[0] + jitter(code, 'lat')).toFixed(5);
    r.lng = +(at[1] + jitter(code, 'lng')).toFixed(5);
    out.push(r);
  }
  return out;
}

// Walkthrough assessments are not in the master sheet. Change this number when more are done.
const WALKTHROUGH_ASSESSMENTS = 132;

// Industrial clusters: the "No of cluster" row of the KISEM AUDIT block in the Summary sheet,
// summed over the years. If the sheet's layout changes, the last known figure is kept and a
// warning is printed, so a layout change never silently shows zero.
function programmeCounts() {
  const fallback = { walkthrough: WALKTHROUGH_ASSESSMENTS, clusters: 37 };
  const sheet = wb.SheetNames.find(n => squash(n) === 'summary');
  if (!sheet) { console.warn('  ! No Summary sheet: cluster count kept as before'); return fallback; }
  const data = rowsOf(sheet);
  const head = data.findIndex(r => r && squash(r[1]) === 'kisemaudit');
  const row = head >= 0 ? data.slice(head + 1, head + 6).find(r => r && squash(r[1]) === 'noofcluster') : null;
  const vals = row ? row.slice(2, 8).map(numOrNull).filter(v => v != null) : [];
  if (!vals.length) { console.warn('  ! Summary sheet: "No of cluster" row not found, cluster count kept as before'); return fallback; }
  return { walkthrough: WALKTHROUGH_ASSESSMENTS, clusters: vals.reduce((a, b) => a + b, 0) };
}

// ---------------------------------------------------------------- main

const yearSheets = wb.SheetNames.filter(n => /^\d{4}-\d{2}$/.test(n.trim())).sort();
console.log(`Year sheets: ${yearSheets.join(', ')}`);
const rows = yearSheets.flatMap(n => readSheet(n, 2));
const paidSheet = wb.SheetNames.find(n => /^paid audit/i.test(n.trim()));
const paid = paidSheet ? readSheet(paidSheet, 1) : [];

// Duplicate audit numbers would make two plants share one page and one change history.
const seen = new Set();
for (const r of rows) {
  if (seen.has(r.c)) { console.error(`Audit number ${r.c} appears twice. Fix the master sheet and run again.`); process.exit(1); }
  seen.add(r.c);
}

// The "Master Data" sheet should repeat the year sheets. The website and the master Excel download
// follow the year sheets; any place where the two disagree is listed here so it can be fixed in
// the sheet. It never stops the import.
const masterSheet = wb.SheetNames.find(n => /^master/i.test(n.trim()));
if (masterSheet) {
  const LABEL = {
    n: 'name', sr: 'sector', p: 'products', dt: 'audit date', dy: 'audit days', kva: 'sanctioned kVA', e: 'electricity kWh',
    f: 'fuel TOE', cost: 'energy cost', co2: 'existing CO2', rn: 'ECMs recommended', rk: 'kWh savings recommended',
    rf: 'fuel savings recommended', ri: 'cost savings recommended', rc: 'CO2 reduction recommended', rv: 'investment proposed',
    in: 'ECMs implemented', iv: 'actual investment', ik: 'actual kWh savings', if: 'actual fuel savings', ii: 'actual cost savings', ic: 'actual CO2 reduction',
  };
  const COMPARE = ['n', 'sr', 'p', 'dt', 'dy', 'kva', 'e', 'f', 'cost', 'co2', 'rn', 'rk', 'rf', 'ri', 'rc', 'rv', 'in', 'iv', 'ik', 'if', 'ii', 'ic'];
  const same = (a, b) => {
    if (typeof a === 'number' || typeof b === 'number') return Math.abs((a ?? 0) - (b ?? 0)) <= 0.01 * Math.max(1, Math.abs(a ?? 0));
    return squash(a) === squash(b);
  };
  const master = new Map(readSheet(masterSheet, 1).map(r => [r.c, r]));
  const issues = [];
  for (const r of rows) {
    const m = master.get(r.c);
    if (!m) { issues.push(`${r.c}: not in "${masterSheet}"`); continue; }
    const diffs = COMPARE.filter(k => !same(r[k], m[k]));
    if (diffs.length) issues.push(`${r.c}: ${diffs.map(k => `${LABEL[k]} (year sheet ${JSON.stringify(r[k])}, master ${JSON.stringify(m[k])})`).join('; ')}`);
  }
  for (const c of master.keys()) if (!seen.has(c)) issues.push(`${c}: in "${masterSheet}" but in no year sheet`);
  if (issues.length) {
    console.warn(`\n  ! "${masterSheet}" disagrees with the year sheets in ${issues.length} audit(s). The year sheets are used.`);
    for (const i of issues) console.warn('    ' + i);
    console.warn('');
  } else console.log(`"${masterSheet}" matches the year sheets.`);
}

const pick = (r, keys) => Object.fromEntries(keys.map(k => [k, r[k] ?? null]));
const generated = new Date().toISOString();
const asOf = fs.statSync(EXCEL_FILE).mtime.toISOString().slice(0, 10);
const counts = { ...programmeCounts(), iga: paid.length };

const publicData = {
  generated,
  asOf,
  source: path.basename(EXCEL_FILE),
  counts,
  rows: rows.map(r => pick(r, PUBLIC_KEYS)),
};
// Last line of defence: nothing team-only may reach the public file.
for (const r of publicData.rows) for (const k of Object.keys(r)) if (TEAM_ONLY.has(k)) throw new Error(`team-only field ${k} in public data`);

fs.mkdirSync(path.dirname(PUBLIC_FILE), { recursive: true });
fs.writeFileSync(PUBLIC_FILE, JSON.stringify(publicData, null, 1) + '\n');

fs.mkdirSync(path.dirname(PRIVATE_FILE), { recursive: true });
fs.writeFileSync(PRIVATE_FILE, JSON.stringify({
  generated, asOf, source: path.basename(EXCEL_FILE), counts,
  sheetRows: SHEET_ROWS.map(([label, key, team]) => ({ label, key, team: !!team })),
  rows,
  paid,
}, null, 1) + '\n');

const byStatus = {};
rows.forEach(r => { byStatus[r.st] = (byStatus[r.st] || 0) + 1; });
console.log(`Public data: ${PUBLIC_FILE} (${rows.length} audits, no names)`);
console.log(`Team data:   ${PRIVATE_FILE} (keep private; import into FOX Console)`);
console.log('Statuses:', byStatus);
console.log('Sectors:', [...new Set(rows.map(r => r.s))].sort().join(', '));
console.log('Districts:', [...new Set(rows.map(r => r.ci))].sort().join(', '));
