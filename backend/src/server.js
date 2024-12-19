// Import required modules
const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const { limiter, adminAuth } = require('./middleware/middleware');
const jsonRoutes = require('./routes/jsonRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5005;

// for debugging
//The error occurs because the browser's Same-Origin Policy blocks the request made from http://localhost:44849 to http://localhost:3000 due to a missing Access-Control-Allow-Origin header in the response from the server at localhost:3000. This is a Cross-Origin Resource Sharing (CORS) issue.
const cors = require('cors');
app.use(cors());



// Middleware
app.use(limiter);
// app.use('/admin', adminAuth);

// Use JSON and media routes
app.use('/api/json', jsonRoutes);
app.use('/api/media', mediaRoutes);

// Load SSL certificates
// const sslOptions = {
//   key: fs.readFileSync('certs/server.key'),
//   cert: fs.readFileSync('certs/server.cert')
// };



// Start HTTPS server
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`Secure server running on https://backend:${PORT}`);
// });

// Start HTTP server
http.createServer(app).listen(PORT, () => {
  console.log(`Secure server running on http://backend:${PORT}`);
});