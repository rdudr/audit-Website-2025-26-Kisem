/**
 * KISEM Annual Report - Excel to JSON Data Parser
 * Run: node scripts/parse-excel.js
 * Reads: ../IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx
 * Outputs: src/data/kisem-data.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '../../IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/data/kisem-data.json');

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

// Row index constants for audit sheets (rows 0-based)
const ROW = {
  AUDIT_NO: 1,
  DISTRICT: 2,
  INDUSTRY_NAME: 3,
  LOCATION: 4,
  SECTOR: 5,
  PRODUCT: 6,
  PRODUCTION_CAPACITY: 7,
  EMPLOYEES: 8,
  AGE: 9,
  CONTACT_PERSON: 10,
  CONTACT_DETAILS: 11,
  SOURCE: 12,
  AUDIT_DATE: 13,
  AUDIT_DAYS: 14,
  MANPOWER: 15,
  UTILITIES: 16,
  SANCTIONED_DEMAND: 17,
  ELEC_CONSUMPTION_KWH: 18,
  ELEC_CONSUMPTION_TOE: 19,
  FUEL_USED: 20,
  FUEL_CONSUMPTION_TOE: 21,
  ENERGY_CONSUMPTION_TOE: 22,
  ENERGY_COST: 23,
  ELEC_COST: 24,
  FUEL_COST: 25,
  ELEC_RATE: 26,
  FUEL_RATE: 27,
  CO2_EXISTING: 28,
  ECM_RECOMMENDED: 29,
  ELEC_SAVINGS_KWH: 30,
  FUEL_SAVINGS_TOE: 31,
  ENERGY_SAVINGS_TOE: 32,
  ENERGY_COST_SAVINGS: 33,
  ENERGY_SAVINGS_PCT: 34,
  ENERGY_COST_SAVINGS_PCT: 35,
  CO2_REDUCTION: 36,
  INVESTMENT: 37,
  ROI_MONTHS: 38,
  ECM_IMPLEMENTED: 39,
  ACTUAL_INVESTMENT: 40,
  ACTUAL_ELEC_SAVINGS_KWH: 41,
  ACTUAL_FUEL_SAVINGS_TOE: 42,
  ACTUAL_ENERGY_COST_SAVINGS: 43,
  ACTUAL_CO2_REDUCTION: 44,
};

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
  'Sbarkantha': { lat: 23.9833, lng: 73.05 },
  'Porbandar': { lat: 21.6417, lng: 69.6293 },
  'Veraval': { lat: 20.9014, lng: 70.3720 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Mehsana': { lat: 23.5880, lng: 72.3693 },
  'Gandhidham': { lat: 23.0753, lng: 70.1337 },
  'Daman': { lat: 20.3974, lng: 72.8328 },
  'Abu': { lat: 24.5925, lng: 72.7081 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'Botad': { lat: 21.9236, lng: 71.6669 },
  'Rajasthan': { lat: 26.9124, lng: 75.7873 },
};

function getCoords(district) {
  if (!district) return { lat: 23.0225, lng: 72.5714 };
  const key = Object.keys(DISTRICT_COORDS).find(k => 
    district.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return DISTRICT_COORDS[key];
  // Default to Gujarat center
  return { lat: 22.2587, lng: 71.1924 };
}

// Parse individual audit columns from a sheet
function parseAuditSheet(sheetName, fy) {
  const data = getSheetData(sheetName);
  const audits = [];
  
  if (data.length < 5) return audits;
  
  // Data columns start at index 2 (col A=Description, col B=Total, col C+ = individual audits)
  const numCols = data[ROW.AUDIT_NO] ? data[ROW.AUDIT_NO].length : 0;
  
  for (let col = 2; col < numCols; col++) {
    const auditNo = data[ROW.AUDIT_NO] ? data[ROW.AUDIT_NO][col] : null;
    if (!auditNo) continue;
    
    const district = data[ROW.DISTRICT] ? data[ROW.DISTRICT][col] : null;
    const sector = normalizeSector(data[ROW.SECTOR] ? data[ROW.SECTOR][col] : null);
    const coords = getCoords(district ? String(district).trim() : '');
    
    // Add slight random offset so markers don't overlap
    const jitter = () => (Math.random() - 0.5) * 0.05;
    
    const audit = {
      id: String(auditNo),
      fy,
      auditNumber: String(auditNo),
      companyName: data[ROW.INDUSTRY_NAME] ? data[ROW.INDUSTRY_NAME][col] || '' : '',
      location: data[ROW.LOCATION] ? data[ROW.LOCATION][col] || '' : '',
      district: district ? String(district).trim() : '',
      sector,
      product: data[ROW.PRODUCT] ? data[ROW.PRODUCT][col] || '' : '',
      auditDate: parseDate(data[ROW.AUDIT_DATE] ? data[ROW.AUDIT_DATE][col] : null),
      auditDays: num(data[ROW.AUDIT_DAYS] ? data[ROW.AUDIT_DAYS][col] : 0),
      utilities: data[ROW.UTILITIES] ? data[ROW.UTILITIES][col] || '' : '',
      sanctionedDemand: num(data[ROW.SANCTIONED_DEMAND] ? data[ROW.SANCTIONED_DEMAND][col] : 0),
      // Baseline
      annualElecConsumptionKwh: num(data[ROW.ELEC_CONSUMPTION_KWH] ? data[ROW.ELEC_CONSUMPTION_KWH][col] : 0),
      annualEnergyConsumptionToe: num(data[ROW.ENERGY_CONSUMPTION_TOE] ? data[ROW.ENERGY_CONSUMPTION_TOE][col] : 0),
      annualEnergyCostInr: num(data[ROW.ENERGY_COST] ? data[ROW.ENERGY_COST][col] : 0),
      annualElecCostInr: num(data[ROW.ELEC_COST] ? data[ROW.ELEC_COST][col] : 0),
      annualFuelCostInr: num(data[ROW.FUEL_COST] ? data[ROW.FUEL_COST][col] : 0),
      existingCo2Tonnes: num(data[ROW.CO2_EXISTING] ? data[ROW.CO2_EXISTING][col] : 0),
      // Recommendations
      ecmRecommended: num(data[ROW.ECM_RECOMMENDED] ? data[ROW.ECM_RECOMMENDED][col] : 0),
      annualElecSavingsKwh: num(data[ROW.ELEC_SAVINGS_KWH] ? data[ROW.ELEC_SAVINGS_KWH][col] : 0),
      annualEnergySavingsToe: num(data[ROW.ENERGY_SAVINGS_TOE] ? data[ROW.ENERGY_SAVINGS_TOE][col] : 0),
      annualSavingsInr: num(data[ROW.ENERGY_COST_SAVINGS] ? data[ROW.ENERGY_COST_SAVINGS][col] : 0),
      annualCo2ReductionTonnes: num(data[ROW.CO2_REDUCTION] ? data[ROW.CO2_REDUCTION][col] : 0),
      investmentInr: num(data[ROW.INVESTMENT] ? data[ROW.INVESTMENT][col] : 0),
      roiMonths: num(data[ROW.ROI_MONTHS] ? data[ROW.ROI_MONTHS][col] : 0),
      energySavingsPct: num(data[ROW.ENERGY_SAVINGS_PCT] ? data[ROW.ENERGY_SAVINGS_PCT][col] : 0),
      // Implementation
      ecmImplemented: num(data[ROW.ECM_IMPLEMENTED] ? data[ROW.ECM_IMPLEMENTED][col] : 0),
      actualInvestmentInr: num(data[ROW.ACTUAL_INVESTMENT] ? data[ROW.ACTUAL_INVESTMENT][col] : 0),
      actualElecSavingsKwh: num(data[ROW.ACTUAL_ELEC_SAVINGS_KWH] ? data[ROW.ACTUAL_ELEC_SAVINGS_KWH][col] : 0),
      actualEnergyCostSavingsInr: num(data[ROW.ACTUAL_ENERGY_COST_SAVINGS] ? data[ROW.ACTUAL_ENERGY_COST_SAVINGS][col] : 0),
      actualCo2ReductionTonnes: num(data[ROW.ACTUAL_CO2_REDUCTION] ? data[ROW.ACTUAL_CO2_REDUCTION][col] : 0),
      // Coordinates for map
      coordinates: {
        lat: coords.lat + jitter(),
        lng: coords.lng + jitter(),
      },
    };
    
    // Computed
    audit.implementationPct = audit.ecmRecommended > 0
      ? Math.round((audit.ecmImplemented / audit.ecmRecommended) * 100)
      : 0;
    
    audits.push(audit);
  }
  
  return audits;
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

// Parse paid audits sheet
function parsePaidAudits() {
  const data = getSheetData('Paid Audit FY 25-26');
  const audits = [];
  const numCols = data[1] ? data[1].length : 0;
  
  for (let col = 1; col < numCols; col++) {
    const auditNo = data[1] ? data[1][col] : null;
    if (!auditNo) continue;
    
    const district = data[2] ? data[2][col] : null;
    const coords = getCoords(district ? String(district).trim() : 'Surat');
    const jitter = () => (Math.random() - 0.5) * 0.05;
    
    const audit = {
      id: `paid-${auditNo}`,
      fy: 'FY25-26',
      auditNumber: String(auditNo),
      isPaid: true,
      companyName: data[3] ? data[3][col] || '' : '',
      location: data[4] ? data[4][col] || '' : '',
      district: district ? String(district).trim() : '',
      sector: normalizeSector(data[5] ? data[5][col] : null),
      product: data[6] ? data[6][col] || '' : '',
      sourceOfLead: data[12] ? data[12][col] || '' : '',
      auditDate: parseDate(data[13] ? data[13][col] : null),
      auditDays: num(data[14] ? data[14][col] : 0),
      utilities: data[16] ? data[16][col] || '' : '',
      sanctionedDemand: num(data[17] ? data[17][col] : 0),
      annualElecConsumptionKwh: num(data[18] ? data[18][col] : 0),
      annualEnergyConsumptionToe: num(data[22] ? data[22][col] : 0),
      annualEnergyCostInr: num(data[23] ? data[23][col] : 0),
      existingCo2Tonnes: num(data[28] ? data[28][col] : 0),
      ecmRecommended: num(data[29] ? data[29][col] : 0),
      annualElecSavingsKwh: num(data[30] ? data[30][col] : 0),
      annualSavingsInr: num(data[33] ? data[33][col] : 0),
      annualCo2ReductionTonnes: num(data[36] ? data[36][col] : 0),
      investmentInr: num(data[37] ? data[37][col] : 0),
      roiMonths: num(data[38] ? data[38][col] : 0),
      coordinates: {
        lat: coords.lat + jitter(),
        lng: coords.lng + jitter(),
      },
    };
    
    audits.push(audit);
  }
  
  return audits;
}

// Main parse function
function parseAll() {
  console.log('Parsing Excel data...');
  
  const audits2223 = parseAuditSheet('2022-23', 'FY22-23');
  const audits2324 = parseAuditSheet('2023-24', 'FY23-24');
  const audits2425 = parseAuditSheet('2024-25', 'FY24-25');
  const audits2526 = parseAuditSheet('2025-26', 'FY25-26');
  const paidAudits = parsePaidAudits();
  const { metrics, kisem } = parseSummary();
  
  const allAudits = [...audits2223, ...audits2324, ...audits2425, ...audits2526];
  
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
  
  // Year-over-year summary
  const yearSummary = {
    'FY22-23': buildYearSummary(audits2223, 'FY22-23', metrics, kisem),
    'FY23-24': buildYearSummary(audits2324, 'FY23-24', metrics, kisem),
    'FY24-25': buildYearSummary(audits2425, 'FY24-25', metrics, kisem),
    'FY25-26': buildYearSummary(audits2526, 'FY25-26', metrics, kisem),
  };
  
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
