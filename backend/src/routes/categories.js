const express = require('express');
const router = express.Router();
const categoryRepository = require('../repositories/categoryRepository');

router.get('/', async (req, res) => {
  try {
    const categories = await categoryRepository.getAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Hiba az adatok betoltesekor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await categoryRepository.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'A kategoria nem talalhato' });
    }
    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Hiba az adatok betoltesekor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'A cím kotelezo' });
    }
    
    const category = await categoryRepository.create({ title, image });
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Hiba az adatok mentesekor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, image } = req.body;
    const category = await categoryRepository.update(req.params.id, { title, image });
    if (!category) {
      return res.status(404).json({ error: 'A kategoria nem talalhato' });
    }
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Hiba az adatok frissitesekor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Ervenytelen azonosito' });
    }
    await categoryRepository.delete(id);
    res.json({ message: 'Kategoria torolve' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Hiba a kategoria torleskor' });
  }
});

module.exports = router;
