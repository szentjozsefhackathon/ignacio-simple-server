const express = require('express');
const path = require('path');
const { getJsonData } = require('../utils/fileUtils');

const router = express.Router();

// Paths to JSON files
const dataFilePath = path.join(__dirname, '../data/data.json');
const versionsFilePath = path.join(__dirname, '../data/versions.json');

// Endpoint to check the data version
router.get('/check-versions', (req, res) => {
  const jsonData = getJsonData(versionsFilePath);
  res.json(jsonData);
});

// Endpoint to download JSON data
router.get('/download-data', (req, res) => {
  const jsonData = getJsonData(dataFilePath);
  res.json(jsonData);
});

module.exports = router;