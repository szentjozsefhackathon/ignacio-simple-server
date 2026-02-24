const express = require('express');
const router = express.Router();
const prayerRepository = require('../repositories/prayerRepository');

router.get('/category/:id', async (req, res) => {
  try {
    const prayers = await prayerRepository.getByCategory(req.params.id);
    res.json(prayers);
  } catch (err) {
    console.error('Error fetching prayers:', err);
    res.status(500).json({ error: 'Hiba az adatok betoltesekor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prayer = await prayerRepository.getById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ error: 'Az ima nem talalhato' });
    }
    res.json(prayer);
  } catch (err) {
    console.error('Error fetching prayer:', err);
    res.status(500).json({ error: 'Hiba az adatok betoltesekor' });
  }
});

router.post('/category/:id', async (req, res) => {
  try {
    const { title, description, image, voice_options, minTimeInMinutes } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'A cím kotelezo' });
    }
    
    const prayer = await prayerRepository.create(req.params.id, {
      title,
      description,
      image,
      voice_options,
      minTimeInMinutes
    });
    res.status(201).json(prayer);
  } catch (err) {
    console.error('Error creating prayer:', err);
    res.status(500).json({ error: 'Hiba az adatok mentesekor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, image, voice_options, minTimeInMinutes } = req.body;
    const prayer = await prayerRepository.update(req.params.id, {
      title,
      description,
      image,
      voice_options,
      minTimeInMinutes
    });
    if (!prayer) {
      return res.status(404).json({ error: 'Az ima nem talalhato' });
    }
    res.json(prayer);
  } catch (err) {
    console.error('Error updating prayer:', err);
    res.status(500).json({ error: 'Hiba az adatok frissitesekor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Ervenytelen azonosito' });
    }
    await prayerRepository.delete(id);
    res.json({ message: 'Ima torolve' });
  } catch (err) {
    console.error('Error deleting prayer:', err);
    res.status(500).json({ error: 'Hiba az ima torleskor' });
  }
});

module.exports = router;
