const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, 'IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx'));

// Print full Summary sheet
const summaryWs = wb.Sheets['Summary'];
const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
console.log('\n=== FULL SUMMARY SHEET ===');
summaryData.forEach((row, i) => {
  if (row.some(c => c !== null && c !== undefined && c !== '')) {
    console.log(`Row ${i}:`, JSON.stringify(row));
  }
});

// Print full 2025-26 sheet (row descriptions)
const fy26Ws = wb.Sheets['2025-26'];
const fy26Data = XLSX.utils.sheet_to_json(fy26Ws, { header: 1 });
console.log('\n=== FULL 2025-26 SHEET ===');
fy26Data.forEach((row, i) => {
  if (row.some(c => c !== null && c !== undefined && c !== '')) {
    console.log(`Row ${i}:`, JSON.stringify(row));
  }
});
