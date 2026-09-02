const db = require('./database');

console.log('🔄 Resetting and seeding Ambattur Classic Tailors database...');
const seeded = db.resetSeed();
console.log(`✅ Successfully seeded ${seeded.length} realistic Chennai tailoring appointments!`);
console.log('Sample Bookings:');
seeded.forEach(b => {
  console.log(`  - [${b.tracking_id}] ${b.customer_name} | ${b.service_name} (₹${b.estimated_price}) -> Status: ${b.status}`);
});
console.log('\nReady to use!');
