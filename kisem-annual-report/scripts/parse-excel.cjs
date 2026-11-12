/**
 * KISEM Annual Report - Excel to JSON Data Parser
 * Run: node scripts/parse-excel.js
 * Reads: the newest ../../IIT Gandhinagar KISEM - Audit Master Data Sheet Latest <year>.xlsx
 *        (or the file given: node scripts/parse-excel.cjs <file.xlsx>)
 * Outputs: src/data/kisem-data.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// The master sheet: the one named on the command line, or else the newest year's
// "IIT Gandhinagar KISEM - Audit Master Data Sheet Latest <year>.xlsx" in the repository root.
const ROOT = path.join(__dirname, '../..');
const EXCEL_FILE = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, fs.readdirSync(ROOT)
      .filter(f => /^IIT Gandhinagar KISEM - Audit Master Data Sheet Latest \d{4}-\d{2}\.xlsx$/.test(f))
      .sort().pop());
const OUTPUT_FILE = path.join(__dirname, '../src/data/kisem-data.json');

console.log(`Reading ${path.basename(EXCEL_FILE)}`);
const wb = XLSX.readFile(EXCEL_FILE);

// Helper: Get row-indexed data from a sheet
function getSheetData(sheetName) {
  const ws = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
}

// Helper: Parse date serial to string
function parseDate(serial) {
  if (!serial || typeof serial !== 'number') return null;
  const date = XLSX.SSF.parse_date_code(serial);
  if (!date) return null;
  return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
}

// Helper: Safe number
function num(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// Rows are found by their label in column A, not by position: rows get added or moved in the
// master sheet from year to year. The label is compared with spaces, stars and dots removed.
const FIELDS = {
  INDUSTRY_NAME: 'industryname',
  LOCATION: 'industrylocation',
  SECTOR: 'sectorclassification',
  PRODUCT: 'productproducts',
  SOURCE: 'sourceoflead',
  AUDIT_DATE: 'dateofcommencement',
  AUDIT_DAYS: 'totalnumberofauditdays',
  UTILITIES: 'listofutilities',
  SANCTIONED_DEMAND: 'sanctioneddemand',
  ELEC_CONSUMPTION_KWH: 'annualelectricityconsumptioninkwh',
  ENERGY_CONSUMPTION_TOE: 'annualenergyconsumptioninmetrictoe',
  ENERGY_COST: 'annualenergycostininr',
  ELEC_COST: 'annualelectricitycostininr',
  FUEL_COST: 'annualfuelcostininr',
  CO2_EXISTING: 'existingoverallco2',
  ECM_RECOMMENDED: 'noofecmsrecommended',
  ELEC_SAVINGS_KWH: 'annualelectricitysavingsrecommended',
  ENERGY_SAVINGS_TOE: 'annualenergysavingsrecommended',
  ENERGY_COST_SAVINGS: 'annualenergycostsavingsrecommended',
  ENERGY_SAVINGS_PCT: 'percentageofoverallenergysavings',
  CO2_REDUCTION: 'annualco2emmisionreductionrecommended',
  INVESTMENT: 'totalinvestmentproposed',
  ROI_MONTHS: 'overallroiestimated',
  ECM_IMPLEMENTED: 'noofecmsimplemented',
  ACTUAL_INVESTMENT: 'overallactualinvestment',
  ACTUAL_ELEC_SAVINGS_KWH: 'actualelectricitysavingsachieved',
  ACTUAL_ENERGY_COST_SAVINGS: 'actualenergycostsavingsachieved',
  ACTUAL_CO2_REDUCTION: 'actualco2emmisionreductionachieved',
};
const squash = v => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

// The layout of one audit sheet: where the audit numbers are, the district row under them, every
// labelled row, and the columns that hold an audit.
function sheetLayout(data, firstCol) {
  const auditRow = data.findIndex(r => r && squash(r[0]) === 'auditnumbers');
  if (auditRow < 0) return null;
  const rows = {};
  for (const [key, label] of Object.entries(FIELDS)) {
    const i = data.findIndex((r, j) => j > auditRow && r && squash(r[0]).startsWith(label));
    rows[key] = i;
  }
  const cols = [];
  const header = data[auditRow] || [];
  for (let c = firstCol; c < header.length; c++) {
    if (/^\d{2}-\d{2}\/\d+/.test(String(header[c] ?? '').trim())) cols.push(c);
  }
  return { auditRow, districtRow: auditRow + 1, rows, cols };
}

// A financial year from an audit number such as "26-27/3".
function fyOf(auditNo) {
  const m = String(auditNo).match(/^(\d{2})-(\d{2})/);
  return m ? `FY${m[1]}-${m[2]}` : null;
}

// Same marker spread on every run, so the data file only changes when the data does.
function jitterFor(id, salt) {
  let h = 2166136261;
  for (const ch of `${id}|${salt}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (((h >>> 0) % 10000) / 10000 - 0.5) * 0.05;
}

// Sector mapping
const SECTOR_MAP = {
  'cold storage': 'Cold Storage',
  'chemical': 'Chemical',
  'textile': 'Textile',
  'pharma': 'Pharma',
  'pharmaceutical': 'Pharma',
  'metal': 'Metal',
  'sea food': 'Sea Food',
  'seafood': 'Sea Food',
  'paper': 'Paper',
  'engineering': 'Engineering',
  'cetp': 'CETP',
  'solar': 'Solar',
  'diamond': 'Diamond',
  'packaging': 'Packaging',
  'plastic': 'Plastic',
  'food': 'Food',
  'ceramic': 'Ceramic',
  'sugar': 'Sugar',
  'timber': 'Timber',
  'auto': 'Engineering',
  'nonwoven': 'Textile',
};

function normalizeSector(s) {
  if (!s) return 'Other';
  const lower = s.toLowerCase().trim();
  for (const [key, val] of Object.entries(SECTOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return s.trim();
}

// Coordinates for districts
const DISTRICT_COORDS = {
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Bharuch': { lat: 21.7051, lng: 72.9959 },
  'Vapi': { lat: 20.3749, lng: 72.9048 },
  'Morbi': { lat: 22.8175, lng: 70.8378 },
  'Aravalli': { lat: 23.5039, lng: 73.0065 },
  'Sabarkantha': { lat: 23.9833, lng: 73.05 },
  'Porbandar': { lat: 21.6417, lng: 69.6293 },
  'Veraval': { lat: 20.9014, lng: 70.3720 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Mehsana': { lat: 23.5880, lng: 72.3693 },
  'Gandhidham': { lat: 23.0753, lng: 70.1337 },
  'Daman': { lat: 20.3974, lng: 72.8328 },
  'Abu': { lat: 24.5925, lng: 72.7081 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'Botad': { lat: 21.9236, lng: 71.6669 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Sirohi': { lat: 24.8853, lng: 72.8606 },
  'Rajasthan': { lat: 26.9124, lng: 75.7873 },
};

// One spelling per district, so the map groups a district's plants together.
const DISTRICT_ALIASES = {
  gandhinaagar: 'Gandhinagar',
  sbarkantha: 'Sabarkantha', sabarkata: 'Sabarkantha', sabarkatha: 'Sabarkantha', sabarkantha: 'Sabarkantha',
  modasa: 'Aravalli', modassa: 'Aravalli',
};
function cleanDistrict(v) {
  const d = v == null ? '' : String(v).trim();
  return DISTRICT_ALIASES[d.toLowerCase()] || d;
}

function getCoords(district) {
  if (!district) return { lat: 23.0225, lng: 72.5714 };
  const key = Object.keys(DISTRICT_COORDS).find(k => 
    district.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return DISTRICT_COORDS[key];
  // Default to Gujarat center
  return { lat: 22.2587, lng: 71.1924 };
}

// District from the plant's address, when the district row is empty.
function districtFromLocation(location) {
  const loc = String(location || '').toLowerCase();
  if (loc.includes('porbandar')) return 'Porbandar';
  if (loc.includes('palsana') || loc.includes('surat')) return 'Surat';
  if (loc.includes('bhachau') || loc.includes('gandhidham') || loc.includes('kutch')) return 'Gandhidham';
  if (loc.includes('morbi')) return 'Morbi';
  if (loc.includes('sabarkata') || loc.includes('sabarkantha')) return 'Sabarkantha';
  if (loc.includes('modasa') || loc.includes('aravalli') || loc.includes('sabarkatha')) return 'Aravalli';
  if (loc.includes('bhavnagar')) return 'Bhavnagar';
  if (loc.includes('vadodara') || loc.includes('baroda')) return 'Vadodara';
  if (loc.includes('vatva') || loc.includes('ahmedabad')) return 'Ahmedabad';
  return '';
}

// Every audit (one column each) of an audit sheet. `firstCol` is the first column that can hold an
// audit: the year sheets have a Total column before the audits, the paid sheet does not.
function readAudits(sheetName, firstCol) {
  const data = getSheetData(sheetName);
  const L = sheetLayout(data, firstCol);
  if (!L) { console.warn(`  ! ${sheetName}: no "Audit Numbers" row, skipped`); return []; }
  const missing = Object.entries(L.rows).filter(([, i]) => i < 0).map(([k]) => k);
  if (missing.length) console.warn(`  ! ${sheetName}: rows not found: ${missing.join(', ')}`);
  const cell = (key, col) => (L.rows[key] >= 0 && data[L.rows[key]] ? data[L.rows[key]][col] : null);
  const text = (key, col) => { const v = cell(key, col); return v == null ? '' : String(v).trim(); };
  const n = (key, col) => num(cell(key, col));
  const statusRow = L.auditRow >= 2 ? data[L.auditRow - 2] : null;

  return L.cols.map(col => {
    const auditNo = String(data[L.auditRow][col]).trim();
    const location = text('LOCATION', col);
    const district = cleanDistrict(data[L.districtRow] && data[L.districtRow][col]) || districtFromLocation(location);
    const status = statusRow && statusRow[col] ? String(statusRow[col]).trim() : '';
    return { auditNo, col, location, district, status, text, n, cell };
  });
}

function parseAuditSheet(sheetName, fy) {
  return readAudits(sheetName, 2).map(({ auditNo, col, location, district, status, text, n, cell }) => {
    const coords = getCoords(district);
    const audit = {
      id: auditNo,
      fy,
      auditNumber: auditNo,
      companyName: text('INDUSTRY_NAME', col),
      location,
      district,
      sector: normalizeSector(text('SECTOR', col) || null),
      product: text('PRODUCT', col),
      auditDate: parseDate(cell('AUDIT_DATE', col)),
      auditDays: n('AUDIT_DAYS', col),
      utilities: text('UTILITIES', col),
      sanctionedDemand: n('SANCTIONED_DEMAND', col),
      // Baseline
      annualElecConsumptionKwh: n('ELEC_CONSUMPTION_KWH', col),
      annualEnergyConsumptionToe: n('ENERGY_CONSUMPTION_TOE', col),
      annualEnergyCostInr: n('ENERGY_COST', col),
      annualElecCostInr: n('ELEC_COST', col),
      annualFuelCostInr: n('FUEL_COST', col),
      existingCo2Tonnes: n('CO2_EXISTING', col),
      // Recommendations
      ecmRecommended: n('ECM_RECOMMENDED', col),
      annualElecSavingsKwh: n('ELEC_SAVINGS_KWH', col),
      annualEnergySavingsToe: n('ENERGY_SAVINGS_TOE', col),
      annualSavingsInr: n('ENERGY_COST_SAVINGS', col),
      annualCo2ReductionTonnes: n('CO2_REDUCTION', col),
      investmentInr: n('INVESTMENT', col),
      roiMonths: n('ROI_MONTHS', col),
      energySavingsPct: n('ENERGY_SAVINGS_PCT', col),
      // Implementation
      ecmImplemented: n('ECM_IMPLEMENTED', col),
      actualInvestmentInr: n('ACTUAL_INVESTMENT', col),
      actualElecSavingsKwh: n('ACTUAL_ELEC_SAVINGS_KWH', col),
      actualEnergyCostSavingsInr: n('ACTUAL_ENERGY_COST_SAVINGS', col),
      actualCo2ReductionTonnes: n('ACTUAL_CO2_REDUCTION', col),
      // Coordinates for map (spread a little so markers don't overlap)
      coordinates: {
        lat: coords.lat + jitterFor(auditNo, 'lat'),
        lng: coords.lng + jitterFor(auditNo, 'lng'),
      },
    };
    if (status) audit.status = status; // e.g. "Post Assessment Pending", "Report Under Process"
    audit.implementationPct = audit.ecmRecommended > 0
      ? Math.round((audit.ecmImplemented / audit.ecmRecommended) * 100)
      : 0;
    return audit;
  });
}

// Parse Summary sheet
function parseSummary() {
  const data = getSheetData('Summary');
  
  // Find the main data rows (col 11 = Description, col 12-16 = values)
  const summary = {};
  
  data.forEach((row, i) => {
    if (!row[11] || typeof row[11] !== 'string') return;
    const label = row[11].trim();
    const fy2223 = num(row[12]);
    const fy2324 = num(row[13]);
    const fy2425 = num(row[14]);
    const fy2526 = num(row[15]);
    const total = num(row[16]);
    
    summary[label] = { 'FY22-23': fy2223, 'FY23-24': fy2324, 'FY24-25': fy2425, 'FY25-26': fy2526, total };
  });
  
  // Also capture KISEM audit counts (rows 2-5 area, col B-F)
  const kisemSection = {};
  data.forEach((row, i) => {
    if (row[1] === 'KISEM AUDIT') {
      // Next rows have the data
    }
    if (row[1] === 'No of audit') {
      kisemSection.auditCounts = {
        'FY22-23': num(row[2]),
        'FY23-24': num(row[3]),
        'FY24-25': num(row[4]),
        'FY25-26': num(row[5]),
      };
    }
    if (row[8] === 'PAID AUDIT') {
      // paid audit label row
    }
    if (row[1] === 'No of Cluster') {
      kisemSection.clusterCounts = {
        'FY22-23': num(row[2]),
        'FY23-24': num(row[3]),
        'FY24-25': num(row[4]),
        'FY25-26': num(row[5]),
      };
    }
    if (row[1] === 'No. of Walkthrough Assessments') {
      kisemSection.walkthroughCounts = {
        'FY22-23': num(row[2]),
        'FY23-24': num(row[3]),
        'FY24-25': num(row[4]),
        'FY25-26': num(row[5]),
      };
    }
    if (row[1] === 'No. of Awareness Programs') {
      kisemSection.awarenessCounts = {
        'FY22-23': num(row[2]),
        'FY23-24': num(row[3]),
        'FY24-25': num(row[4]),
        'FY25-26': num(row[5]),
      };
    }
  });
  
  return { metrics: summary, kisem: kisemSection };
}

// Parse the paid audits sheet (all years on one sheet; the year comes from the audit number)
function parsePaidAudits() {
  const sheet = wb.SheetNames.find(name => /^paid audit/i.test(name.trim()));
  if (!sheet) return [];
  return readAudits(sheet, 1).map(({ auditNo, col, location, district, text, n, cell }) => {
    const coords = getCoords(district || 'Surat');
    return {
      id: `paid-${auditNo}`,
      fy: fyOf(auditNo) || 'FY25-26',
      auditNumber: auditNo,
      isPaid: true,
      companyName: text('INDUSTRY_NAME', col),
      location,
      district,
      sector: normalizeSector(text('SECTOR', col) || null),
      product: text('PRODUCT', col),
      sourceOfLead: text('SOURCE', col),
      auditDate: parseDate(cell('AUDIT_DATE', col)),
      auditDays: n('AUDIT_DAYS', col),
      utilities: text('UTILITIES', col),
      sanctionedDemand: n('SANCTIONED_DEMAND', col),
      annualElecConsumptionKwh: n('ELEC_CONSUMPTION_KWH', col),
      annualEnergyConsumptionToe: n('ENERGY_CONSUMPTION_TOE', col),
      annualEnergyCostInr: n('ENERGY_COST', col),
      existingCo2Tonnes: n('CO2_EXISTING', col),
      ecmRecommended: n('ECM_RECOMMENDED', col),
      annualElecSavingsKwh: n('ELEC_SAVINGS_KWH', col),
      annualSavingsInr: n('ENERGY_COST_SAVINGS', col),
      annualCo2ReductionTonnes: n('CO2_REDUCTION', col),
      investmentInr: n('INVESTMENT', col),
      roiMonths: n('ROI_MONTHS', col),
      coordinates: {
        lat: coords.lat + jitterFor(`paid-${auditNo}`, 'lat'),
        lng: coords.lng + jitterFor(`paid-${auditNo}`, 'lng'),
      },
    };
  });
}

// Main parse function
function parseAll() {
  console.log('Parsing Excel data...');
  
  const yearSheets = wb.SheetNames.filter(name => /^\d{4}-\d{2}$/.test(name));
  yearSheets.sort();
  console.log(`Found year sheets: ${yearSheets.join(', ')}`);
  
  const allAudits = [];
  const yearSummary = {};
  const paidAudits = parsePaidAudits();
  const { metrics, kisem } = parseSummary();
  
  yearSheets.forEach(sheetName => {
    const fy = `FY${sheetName.substring(2, 4)}-${sheetName.substring(5, 7)}`;
    const audits = parseAuditSheet(sheetName, fy);
    allAudits.push(...audits);
    yearSummary[fy] = buildYearSummary(audits, fy, metrics, kisem);
  });
  
  // Compute sector breakdown
  const sectorStats = {};
  allAudits.forEach(a => {
    if (!sectorStats[a.sector]) {
      sectorStats[a.sector] = {
        sector: a.sector,
        count: 0,
        totalSavingsInr: 0,
        totalCo2Reduction: 0,
        totalInvestment: 0,
        totalEcmRecommended: 0,
        totalEcmImplemented: 0,
      };
    }
    sectorStats[a.sector].count++;
    sectorStats[a.sector].totalSavingsInr += a.annualSavingsInr;
    sectorStats[a.sector].totalCo2Reduction += a.annualCo2ReductionTonnes;
    sectorStats[a.sector].totalInvestment += a.investmentInr;
    sectorStats[a.sector].totalEcmRecommended += a.ecmRecommended;
    sectorStats[a.sector].totalEcmImplemented += a.ecmImplemented;
  });
  
  // Grand totals
  const grandTotals = {
    totalAudits: allAudits.length,
    totalPaidAudits: paidAudits.length,
    totalWalkthrough: 132,
    totalClusters: 37,
    totalSavingsInr: allAudits.reduce((s, a) => s + a.annualSavingsInr, 0),
    totalCo2ReductionTonnes: allAudits.reduce((s, a) => s + a.annualCo2ReductionTonnes, 0),
    totalInvestmentInr: allAudits.reduce((s, a) => s + a.investmentInr, 0),
    totalEcmRecommended: allAudits.reduce((s, a) => s + a.ecmRecommended, 0),
    totalEcmImplemented: allAudits.reduce((s, a) => s + a.ecmImplemented, 0),
    totalActualSavingsInr: allAudits.reduce((s, a) => s + a.actualEnergyCostSavingsInr, 0),
    totalActualCo2Tonnes: allAudits.reduce((s, a) => s + a.actualCo2ReductionTonnes, 0),
    totalElecConsumptionKwh: allAudits.reduce((s, a) => s + a.annualElecConsumptionKwh, 0),
    totalEnergyCostInr: allAudits.reduce((s, a) => s + a.annualEnergyCostInr, 0),
    totalExistingCo2Tonnes: allAudits.reduce((s, a) => s + a.existingCo2Tonnes, 0),
    implementationPct: 0,
  };
  grandTotals.implementationPct = grandTotals.totalEcmRecommended > 0
    ? Math.round((grandTotals.totalEcmImplemented / grandTotals.totalEcmRecommended) * 100)
    : 0;
  
  const output = {
    generated: new Date().toISOString(),
    grandTotals,
    yearSummary,
    audits: allAudits,
    paidAudits,
    sectorBreakdown: Object.values(sectorStats).sort((a, b) => b.count - a.count),
    metricsRaw: metrics,
  };
  
  // Create data directory
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✓ Data written to ${OUTPUT_FILE}`);
  console.log(`  Audits: ${allAudits.length} KISEM + ${paidAudits.length} Paid`);
  console.log(`  Sectors: ${Object.keys(sectorStats).join(', ')}`);
  console.log(`  Grand totals:`, JSON.stringify(grandTotals, null, 2));
}

function buildYearSummary(audits, fy, metrics, kisem) {
  const fyKey = fy.replace('FY', 'FY ').replace('-', '-');
  
  const totalSavingsInr = audits.reduce((s, a) => s + a.annualSavingsInr, 0);
  const totalCo2 = audits.reduce((s, a) => s + a.annualCo2ReductionTonnes, 0);
  const totalInvestment = audits.reduce((s, a) => s + a.investmentInr, 0);
  const totalEcmRec = audits.reduce((s, a) => s + a.ecmRecommended, 0);
  const totalEcmImpl = audits.reduce((s, a) => s + a.ecmImplemented, 0);
  const totalActualSavings = audits.reduce((s, a) => s + a.actualEnergyCostSavingsInr, 0);
  const totalActualCo2 = audits.reduce((s, a) => s + a.actualCo2ReductionTonnes, 0);
  
  return {
    fy,
    auditCount: audits.length,
    totalSavingsInr,
    totalCo2ReductionTonnes: totalCo2,
    totalInvestmentInr: totalInvestment,
    totalEcmRecommended: totalEcmRec,
    totalEcmImplemented: totalEcmImpl,
    implementationPct: totalEcmRec > 0 ? Math.round((totalEcmImpl / totalEcmRec) * 100) : 0,
    actualSavingsInr: totalActualSavings,
    actualCo2Tonnes: totalActualCo2,
    elecSavingsKwh: audits.reduce((s, a) => s + a.annualElecSavingsKwh, 0),
  };
}

parseAll();
