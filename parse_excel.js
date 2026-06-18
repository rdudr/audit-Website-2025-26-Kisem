const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, 'IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx'));
console.log('Sheets:', wb.SheetNames);

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  console.log('\n=== SHEET:', sheetName, '===');
  console.log('Total rows:', data.length);
  if (data.length > 0) console.log('Headers:', JSON.stringify(data[0]));
  if (data.length > 1) console.log('Row1:', JSON.stringify(data[1]));
  if (data.length > 2) console.log('Row2:', JSON.stringify(data[2]));
  if (data.length > 3) console.log('Row3:', JSON.stringify(data[3]));
});
