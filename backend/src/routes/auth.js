const express = require('express');
const router = express.Router();
const { verifyCredentials } = require('../utils/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Hiányzó felhasználónév vagy jelszó' });
  }
  
  if (verifyCredentials(username, password)) {
    // In production, use JWT or session. For now, simple success response.
    return res.json({ 
      success: true, 
      username,
      message: 'Sikeres bejelentkezés' 
    });
  }
  
  return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
});

module.exports = router;
