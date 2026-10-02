const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all registered contractors
router.get('/', async (req, res) => {
  try {
    const contractors = await db.findAll('contractors');
    res.json(contractors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET contractor by ID with assigned projects
router.get('/:id', async (req, res) => {
  try {
    const contractor = await db.findById('contractors', req.params.id);
    if (!contractor) return res.status(404).json({ error: 'Contractor not found' });
    const projects = await db.findAll('projects', p => p.contractor_id === contractor.id);
    res.json({ ...contractor, projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
