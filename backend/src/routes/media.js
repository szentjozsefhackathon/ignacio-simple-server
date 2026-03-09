const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mediaRepository = require('../repositories/mediaRepository');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg|m4a|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Csak kepek es hangfajlok engedelyezettek'));
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nincs fajl feltoltve' });
    }
    
    const result = await mediaRepository.upload(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    
    res.status(201).json(result);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Hiba a fajl feltolteskor' });
  }
});

router.get('/', async (req, res) => {
  try {
    const media = await mediaRepository.getAll();
    res.json(media);
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ error: 'Hiba a fajlok betoltesekor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Ervenytelen azonosito' });
    }
    await mediaRepository.delete(id);
    res.json({ message: 'Fajl torolve' });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ error: 'Hiba a fajl torleskor' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const type = req.query.type;
    let media = await mediaRepository.getAll();
    
    if (type) {
      media = media.filter(m => m.media_type === type);
    }
    
    res.json(media);
  } catch (err) {
    console.error('Error listing media:', err);
    res.status(500).json({ error: 'Hiba a fajlok betoltesekor' });
  }
});

router.get('/images/:name', async (req, res) => {
  try {
    const filename = req.params.name;
    const result = await mediaRepository.getFileStream(filename, 'image');
    
    if (!result) {
      return res.status(404).json({ error: 'Kep nem talalhato' });
    }
    
    res.set('Content-Type', result.mimeType);
    result.stream.pipe(res);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ error: 'Hiba a kep kiszolgalasakor' });
  }
});

router.get('/voices/:name', async (req, res) => {
  try {
    const filename = req.params.name;
    const result = await mediaRepository.getFileStream(filename, 'voice');
    
    if (!result) {
      return res.status(404).json({ error: 'Hangfajl nem talalhato' });
    }
    
    res.set('Content-Type', result.mimeType);
    result.stream.pipe(res);
  } catch (err) {
    console.error('Error serving voice:', err);
    res.status(500).json({ error: 'Hiba a hangfajl kiszolgalasakor' });
  }
});

module.exports = router;
