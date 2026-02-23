const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mediaDir = path.join(__dirname, '../../media');

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${generateUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|ogg|m4a|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Csak képek és hangfájlok engedélyezettek'));
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }
    
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/media/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(fileInfo);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a fájl feltöltésekor' });
  }
});

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(mediaDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(mediaDir);
    const fileInfos = files.map(file => {
      const stats = fs.statSync(path.join(mediaDir, file));
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
      const isAudio = ['.mp3', '.wav', '.ogg', '.m4a', '.webm'].includes(ext);
      
      return {
        filename: file,
        path: `/media/${file}`,
        size: stats.size,
        type: isImage ? 'image' : isAudio ? 'audio' : 'other',
        createdAt: stats.birthtime
      };
    });
    
    res.json(fileInfos);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a fájlok betöltésekor' });
  }
});

router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(mediaDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'A fájl nem található' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ message: 'Fájl törölve' });
  } catch (err) {
    res.status(500).json({ error: 'Hiba a fájl törlésekor' });
  }
});

router.get('/list', (req, res) => {
  try {
    const type = req.query.type;
    
    if (!fs.existsSync(mediaDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(mediaDir);
    let fileInfos = files.map(file => {
      const stats = fs.statSync(path.join(mediaDir, file));
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
      const isAudio = ['.mp3', '.wav', '.ogg', '.m4a', '.webm'].includes(ext);
      
      return {
        filename: file,
        path: `/media/${file}`,
        size: stats.size,
        type: isImage ? 'image' : isAudio ? 'audio' : 'other',
        createdAt: stats.birthtime
      };
    });
    
    if (type) {
      fileInfos = fileInfos.filter(f => f.type === type);
    }
    
    res.json(fileInfos);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a fájlok betöltésekor' });
  }
});

module.exports = router;
