const express = require('express');
const path = require('path');
const { getJsonData } = require('../utils/fileUtils');
const db = require('../db/connection');

const router = express.Router();

const versionsFilePath = path.join(__dirname, '../db/versions.json');

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, '');
}

function slugify(text) {
  return removeDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

router.get('/check-versions', (req, res) => {
  const jsonData = getJsonData(versionsFilePath);
  res.json({
    ...jsonData,
    timestamp: new Date().toISOString()
  });
});

router.get('/download-data', async (req, res) => {
  try {
    const categories = await db('categories').orderBy('id');
    
    const result = await Promise.all(
      categories.map(async (category) => {
        const categorySlug = slugify(category.title);
        
        const prayers = await db('prayers')
          .where('category_id', category.id)
          .orderBy('id');
        
        const prayersWithSteps = await Promise.all(
          prayers.map(async (prayer) => {
            const prayerSlug = slugify(prayer.title);
            
            const steps = await db('steps')
              .where('prayer_id', prayer.id)
              .orderBy('step_order');
            
            return {
              title: prayer.title,
              description: prayer.description,
              image: prayer.image,
              voice_options: typeof prayer.voice_options === 'string'
                ? JSON.parse(prayer.voice_options)
                : prayer.voice_options,
              minTimeInMinutes: prayer.min_time_in_minutes,
              slug: prayerSlug,
              group: categorySlug,
                steps: steps.map((s, index) => ({
                index: index,
                description: s.description,
                voices: typeof s.voices === 'string' ? JSON.parse(s.voices) : s.voices,
                timeInSeconds: s.time_in_seconds,
                type: s.step_type ? s.step_type.toUpperCase() : 'FIX',
                prayer: prayerSlug
              }))
            };
          })
        );
        
        return {
          title: category.title,
          image: category.image,
          slug: categorySlug,
          prayers: prayersWithSteps
        };
      })
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

module.exports = router;
