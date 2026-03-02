const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const { limiter } = require('./middleware/middleware');
const jsonRoutes = require('./routes/jsonRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const categoriesRoutes = require('./routes/categories');
const prayersRoutes = require('./routes/prayers');
const stepsRoutes = require('./routes/steps');
const mediaApiRoutes = require('./routes/media');
const authRoutes = require('./routes/auth');
const { createRedisClient } = require('./services/redis');
const { ensureBucket } = require('./services/s3');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 5005;

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use(limiter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/json', jsonRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/prayers', prayersRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/media', mediaApiRoutes);

async function startServer() {
  try {
    console.log('Initializing services...');
    
    // Test database connection
    await db.raw('SELECT 1');
    console.log('✓ PostgreSQL connected');
    
    // Initialize Redis
    try {
      await createRedisClient();
      console.log('✓ Redis connected');
    } catch (err) {
      console.warn('⚠ Redis connection failed, continuing without cache:', err.message);
    }
    
    // Initialize MinIO bucket
    try {
      await ensureBucket();
      console.log('✓ MinIO bucket ready');
    } catch (err) {
      console.warn('⚠ MinIO connection failed, continuing:', err.message);
    }
    
    // Start server
    http.createServer(app).listen(PORT, () => {
      console.log(`Server running on http://backend:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
