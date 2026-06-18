const data = require('./src/data/kisem-data.json');
console.log('Paid audits count:', data.paidAudits?.length);
if (data.paidAudits && data.paidAudits.length > 0) {
  console.log('First paid audit:', JSON.stringify(data.paidAudits[0], null, 2));
} else {
  console.log('No paid audits found.');
}
