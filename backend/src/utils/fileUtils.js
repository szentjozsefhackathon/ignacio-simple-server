const fs = require('fs');
const path = require('path');

// Helper function to read and parse JSON files
function getJsonData(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

// Helper function to get list of files in a directory
function getFilesList(directoryPath) {
  return fs.readdirSync(directoryPath).map(file => ({
    name: file,
    path: path.join(directoryPath, file),
    size: fs.statSync(path.join(directoryPath, file)).size,
    lastModified: fs.statSync(path.join(directoryPath, file)).mtime
  }));
}

function updateVersion(field) {
  const filePath = path.join(__dirname, '../db/versions.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data[field] = new Date().toISOString();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n');
}

module.exports = { getJsonData, getFilesList, updateVersion };