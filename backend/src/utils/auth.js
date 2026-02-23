const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');

function loadEnv() {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !line.startsWith('#')) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  }
}

loadEnv();

if (!process.env.ADMIN_USERS) {
  throw new Error('ADMIN_USERS environment variable is required. Copy .env.example to .env and configure users.');
}

let users;
try {
  users = JSON.parse(process.env.ADMIN_USERS);
} catch (e) {
  throw new Error('Invalid ADMIN_USERS JSON format in .env file');
}

if (Object.keys(users).length === 0) {
  throw new Error('ADMIN_USERS cannot be empty. Add at least one user to .env file.');
}

function verifyCredentials(username, password) {
  const storedHash = users[username];
  if (!storedHash) {
    return false;
  }
  
  if (storedHash.startsWith('$2')) {
    const bcrypt = require('bcrypt');
    return bcrypt.compareSync(password, storedHash);
  }
  
  return storedHash === password;
}

function getAllUsernames() {
  return Object.keys(users);
}

module.exports = {
  verifyCredentials,
  getAllUsernames,
};
