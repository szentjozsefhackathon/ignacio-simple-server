const express = require('express');
const router = express.Router();
const stepRepository = require('../repositories/stepRepository');

router.get('/prayer/:prayerId', async (req, res) => {
  try {
    const steps = await stepRepository.getByPrayer(req.params.prayerId);
    res.json(steps);
  } catch (err) {
    console.error('Error fetching steps:', err);
    res.status(500).json({ error: 'Hiba az adatok betoltesekor' });
  }
});

router.post('/prayer/:prayerId', async (req, res) => {
  try {
    const { description, timeInSeconds, type, voices } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'A leiras kotelezo' });
    }
    
    const step = await stepRepository.create(req.params.prayerId, {
      description,
      timeInSeconds,
      type,
      voices
    });
    
    res.status(201).json(step);
  } catch (err) {
    console.error('Error creating step:', err);
    res.status(500).json({ error: 'Hiba az adatok mentesekor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { description, timeInSeconds, type, voices, stepOrder } = req.body;
    const step = await stepRepository.update(req.params.id, {
      description,
      timeInSeconds,
      type,
      voices,
      stepOrder
    });
    
    if (!step) {
      return res.status(404).json({ error: 'A lepes nem talalhato' });
    }
    
    res.json(step);
  } catch (err) {
    console.error('Error updating step:', err);
    res.status(500).json({ error: 'Hiba az adatok frissitesekor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Ervenytelen azonosito' });
    }
    await stepRepository.delete(id);
    res.json({ message: 'Lepes torolve' });
  } catch (err) {
    console.error('Error deleting step:', err);
    res.status(500).json({ error: 'Hiba a lepes torleskor' });
  }
});

module.exports = router;
