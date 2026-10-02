const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await db.findAll('departments');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single department
router.get('/:id', async (req, res) => {
  try {
    const dept = await db.findById('departments', req.params.id);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
