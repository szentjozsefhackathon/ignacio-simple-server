const fs = require('fs');
const path = require('path');
const db = require('../db/connection');

const dataFilePath = path.join(__dirname, '../data/data.json');

async function migrateSteps() {
  console.log('Reading data.json...');
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
  console.log('Fetching prayers from database...');
  const prayers = await db('prayers').select('id', 'title', 'category_id');
  
  // Create a map of prayer title -> database id
  const prayerMap = {};
  for (const prayer of prayers) {
    prayerMap[prayer.title] = prayer.id;
  }
  
  console.log(`Found ${prayers.length} prayers in database`);
  console.log('Prayer map:', prayerMap);
  
  let stepsInserted = 0;
  
  for (const category of data) {
    for (const prayer of category.prayers || []) {
      const prayerId = prayerMap[prayer.title];
      
      if (!prayerId) {
        console.log(`Warning: Prayer not found in database: ${prayer.title}`);
        continue;
      }
      
      for (let i = 0; i < (prayer.steps || []).length; i++) {
        const step = prayer.steps[i];
        
        await db('steps').insert({
          prayer_id: prayerId,
          step_order: i + 1,
          description: step.description || '',
          voices: JSON.stringify(step.voices || []),
          time_in_seconds: step.timeInSeconds || 60,
          step_type: step.type || 'FIX'
        });
        
        stepsInserted++;
      }
    }
  }
  
  console.log(`\n✓ Migration complete!`);
  console.log(`  Steps inserted: ${stepsInserted}`);
  
  // Verify
  const count = await db('steps').count('* as count').first();
  console.log(`  Total steps in database: ${count.count}`);
  
  process.exit(0);
}

migrateSteps().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
