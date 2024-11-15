const express = require('express');
const path = require('path');
const { getFilesList } = require('../utils/fileUtils');

const router = express.Router();

// Serve static files from "images" and "voices" directories
router.use('/images', express.static(path.join(__dirname, '../../public/images')));
router.use('/voices', express.static(path.join(__dirname, '../../public/voices')));

// Endpoint to get list of image files
router.get('/sync-images', (req, res) => {
  const imagesPath = path.join(__dirname, '../../public/images');
  const imagesList = getFilesList(imagesPath);
  res.json(imagesList);
});

// Endpoint to get list of voice files
router.get('/sync-voices', (req, res) => {
  const voicesPath = path.join(__dirname, '../../public/voices');
  const voicesList = getFilesList(voicesPath);
  res.json(voicesList);
});

module.exports = router;