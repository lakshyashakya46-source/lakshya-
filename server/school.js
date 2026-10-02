const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function startServer() {
  // Initialize PostgreSQL schema first
  const db = require('./db/database');
  await db.testConnection();
  await db.initSchema();

  // Routes
  app.use('/api/departments', require('./routes/departments'));
  app.use('/api/entities', require('./routes/entities'));
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/milestones', require('./routes/milestones'));
  app.use('/api/inspections', require('./routes/inspections'));
  app.use('/api/contractors', require('./routes/contractors'));
  app.use('/api/grievances', require('./routes/grievances'));
  app.use('/api/ledger', require('./routes/ledger'));
  app.use('/api/analytics', require('./routes/analytics'));
  app.use('/api/upload', require('./routes/upload'));

  // Reset database route for demo/testing
  app.post('/api/reset-seed', async (req, res) => {
    try {
      const runSeed = require('./db/seed');
      await runSeed();
      res.json({ message: 'Database reset to initial GovTech seed state successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reset database: ' + err.message });
    }
  });

  // Serve frontend in production
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), err => {
      if (err) {
        res.status(200).send(`
          <h1>Fund to Field (Nidhi Se Nirman) API Server Running</h1>
          <p>Frontend client is running separately in development mode on port 5173.</p>
          <p>Health check: <a href="/api/analytics">/api/analytics</a></p>
        `);
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏛️ FUND TO FIELD (निधि से निर्माण) - GovTech API Server`);
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics`);
    console.log(`📁 Static Uploads: http://localhost:${PORT}/uploads`);
    console.log(`🐘 Database: PostgreSQL @ ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
