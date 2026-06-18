const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, 'IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx'));

// Print full Summary sheet rows
const summaryWs = wb.Sheets['Summary'];
const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
console.log('\n=== FULL SUMMARY SHEET ===');
summaryData.forEach((row, i) => {
  if (row.some(c => c !== null && c !== undefined && c !== '')) {
    console.log(`Row ${i}:`, JSON.stringify(row));
  }
});

// Print 2022-23 row descriptions (column 0)
const fy23Ws = wb.Sheets['2022-23'];
const fy23Data = XLSX.utils.sheet_to_json(fy23Ws, { header: 1 });
console.log('\n=== 2022-23 Row Labels (col 0) ===');
fy23Data.forEach((row, i) => {
  if (row[0] !== null && row[0] !== undefined && row[0] !== '') {
    console.log(`Row ${i}: ${row[0]} | total: ${row[1]}`);
  }
});

// Print 2024-25 full
const fy25Ws = wb.Sheets['2024-25'];
const fy25Data = XLSX.utils.sheet_to_json(fy25Ws, { header: 1 });
console.log('\n=== 2024-25 Row Labels (col 0) ===');
fy25Data.forEach((row, i) => {
  if (row[0] !== null && row[0] !== undefined && row[0] !== '') {
    console.log(`Row ${i}: ${row[0]} | total: ${row[1]}`);
  }
});

// Paid Audits  
const paidWs = wb.Sheets['Paid Audit FY 25-26'];
const paidData = XLSX.utils.sheet_to_json(paidWs, { header: 1 });
console.log('\n=== PAID AUDIT SHEET ===');
paidData.forEach((row, i) => {
  if (row.some(c => c !== null && c !== undefined && c !== '')) {
    console.log(`Row ${i}:`, JSON.stringify(row));
  }
});
