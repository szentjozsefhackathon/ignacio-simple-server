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

router.get('/prayer/:prayerId', (req, res) => {
  try {
    const prayerId = parseInt(req.params.prayerId);
    const data = readData();
    
    let found = false;
    let steps = [];
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers && data[catIndex].prayers[prayerId]) {
        steps = data[catIndex].prayers[prayerId].steps || [];
        steps = steps.map((step, index) => ({ id: index, ...step }));
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Az ima nem található' });
    }
    
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

router.post('/prayer/:prayerId', (req, res) => {
  try {
    const prayerId = parseInt(req.params.prayerId);
    const { description, timeInSeconds, type, voices } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'A leírás kötelező' });
    }
    
    const data = readData();
    let found = false;
    let categoryIndex = -1;
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers && data[catIndex].prayers[prayerId]) {
        const newStep = {
          description,
          voices: voices || [],
          timeInSeconds: timeInSeconds || 60,
          type: type || 'FIX'
        };
        
        if (!data[catIndex].prayers[prayerId].steps) {
          data[catIndex].prayers[prayerId].steps = [];
        }
        
        data[catIndex].prayers[prayerId].steps.push(newStep);
        categoryIndex = catIndex;
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Az ima nem található' });
    }
    
    if (writeData(data)) {
      const newId = data[categoryIndex].prayers[prayerId].steps.length - 1;
      res.status(201).json({ id: newId, ...data[categoryIndex].prayers[prayerId].steps[newId] });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a lépés létrehozásakor' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const stepId = parseInt(req.params.id);
    const { description, timeInSeconds, type, voices } = req.body;
    const data = readData();
    
    let found = false;
    let categoryIndex = -1;
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers) {
        for (let p = 0; p < data[catIndex].prayers.length; p++) {
          if (data[catIndex].prayers[p].steps && data[catIndex].prayers[p].steps[stepId]) {
            if (description) data[catIndex].prayers[p].steps[stepId].description = description;
            if (timeInSeconds) data[catIndex].prayers[p].steps[stepId].timeInSeconds = timeInSeconds;
            if (type) data[catIndex].prayers[p].steps[stepId].type = type;
            if (voices) data[catIndex].prayers[p].steps[stepId].voices = voices;
            categoryIndex = catIndex;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    
    if (!found) {
      return res.status(404).json({ error: 'A lépés nem található' });
    }
    
    if (writeData(data)) {
      res.json(data[categoryIndex].prayers.map(p => p.steps).flat()[stepId]);
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a lépés frissítésekor' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const stepId = parseInt(req.params.id);
    const data = readData();
    
    let found = false;
    let prayerIndex = -1;
    
    for (let catIndex = 0; catIndex < data.length; catIndex++) {
      if (data[catIndex].prayers) {
        for (let p = 0; p < data[catIndex].prayers.length; p++) {
          if (data[catIndex].prayers[p].steps && data[catIndex].prayers[p].steps[stepId]) {
            data[catIndex].prayers[p].steps.splice(stepId, 1);
            prayerIndex = p;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    
    if (!found) {
      return res.status(404).json({ error: 'A lépés nem található' });
    }
    
    if (writeData(data)) {
      res.json({ message: 'Lépés törölve' });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a lépés törlésekor' });
  }
});

module.exports = router;
