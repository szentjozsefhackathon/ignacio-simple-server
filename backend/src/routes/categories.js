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

router.get('/', (req, res) => {
  try {
    const data = readData();
    const categories = data.map((cat, index) => ({
      id: index,
      title: cat.title,
      image: cat.image,
      prayerCount: cat.prayers ? cat.prayers.length : 0
    }));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'A kategória nem található' });
    }
    res.json(data[id]);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'A cím kötelező' });
    }
    
    const data = readData();
    const newCategory = {
      title,
      image: image || 'default.jpg',
      prayers: []
    };
    
    data.push(newCategory);
    
    if (writeData(data)) {
      res.status(201).json({ id: data.length - 1, ...newCategory });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a kategória létrehozásakor' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, image } = req.body;
    const data = readData();
    
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'A kategória nem található' });
    }
    
    if (title) data[id].title = title;
    if (image) data[id].image = image;
    
    if (writeData(data)) {
      res.json(data[id]);
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a kategória frissítésekor' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'A kategória nem található' });
    }
    
    data.splice(id, 1);
    
    if (writeData(data)) {
      res.json({ message: 'Kategória törölve' });
    } else {
      res.status(500).json({ error: 'Hiba az adatok mentésekor' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Hiba a kategória törlésekor' });
  }
});

module.exports = router;
