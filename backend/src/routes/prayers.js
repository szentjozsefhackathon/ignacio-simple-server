const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing data:', err);
    return false;
  }
}

function findPrayer(data, prayerId) {
  for (let catIndex = 0; catIndex < data.length; catIndex++) {
    if (data[catIndex].prayers && data[catIndex].prayers.length > prayerId) {
      return { categoryIndex: catIndex, prayer: data[catIndex].prayers[prayerId] };
    }
    let prayerCount = 0;
    if (data[catIndex].prayers) {
      for (let p = 0; p < data[catIndex].prayers.length; p++) {
        if (p === prayerId) {
          return { categoryIndex: catIndex, prayer: data[catIndex].prayers[p] };
        }
      }
    }
  }
  return null;
}

router.get('/category/:categoryId', (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const data = readData();
    
    if (categoryId < 0 || categoryId >= data.length) {
      return res.status(404).json({ error: 'A kategória nem található' });
    }
    
    const prayers = data[categoryId].prayers || [];
    const prayersWithId = prayers.map((prayer, index) => ({
      id: index,
      ...prayer
    }));
    
    res.json(prayersWithId);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

router.post('/category/:categoryId', (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const { title, description, image, voice_options, minTimeInMinutes } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'A cím kötelező' });
    }
    
    const data = readData();
    
    if (categoryId < 0 || categoryId >= data.length) {
      return res.status(404).json({ error: 'A kategória nem található' });
    }
    
    const newPrayer = {
      title,
      description: description || '',
      image: image || 'default.jpg',
      voice_options: voice_options || [],
      minTimeInMinutes: minTimeInMinutes || 15,
      steps: []
    };
    
    if (!data[categoryId].prayers) {
      data[categoryId].prayers = [];
    }
    
    data[categoryId].prayers.push(newPrayer);
    
    if (writeData(data)) {
      const newId = data[categoryId].prayers.length - 1;
      res.status(201).json({ id: newId, ...newPrayer });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba az ima létrehozásakor' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const prayerId = parseInt(req.params.id);
    const { title, description, image, voice_options, minTimeInMinutes } = req.body;
    const data = readData();
    
    let found = false;
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers && data[catIndex].prayers[prayerId]) {
        if (title) data[catIndex].prayers[prayerId].title = title;
        if (description !== undefined) data[catIndex].prayers[prayerId].description = description;
        if (image) data[catIndex].prayers[prayerId].image = image;
        if (voice_options) data[catIndex].prayers[prayerId].voice_options = voice_options;
        if (minTimeInMinutes) data[catIndex].prayers[prayerId].minTimeInMinutes = minTimeInMinutes;
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Az ima nem található' });
    }
    
    if (writeData(data)) {
      res.json(data[catIndex].prayers[prayerId]);
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba az ima frissítésekor' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const prayerId = parseInt(req.params.id);
    const data = readData();
    
    let found = false;
    let categoryIndex = -1;
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers && data[catIndex].prayers[prayerId]) {
        data[catIndex].prayers.splice(prayerId, 1);
        categoryIndex = catIndex;
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Az ima nem található' });
    }
    
    if (writeData(data)) {
      res.json({ message: 'Ima törölve' });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba az ima törlésekor' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const prayerId = parseInt(req.params.id);
    const data = readData();
    
    let found = false;
    let prayer = null;
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers && data[catIndex].prayers[prayerId]) {
        prayer = { id: prayerId, ...data[catIndex].prayers[prayerId] };
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Az ima nem található' });
    }
    
    res.json(prayer);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

module.exports = router;
