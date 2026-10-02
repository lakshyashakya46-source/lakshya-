const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET public disbursement ledger
router.get('/', async (req, res) => {
  try {
    const { project_id } = req.query;
    let ledger = await db.findAll('ledger');

    if (project_id) {
      ledger = ledger.filter(l => l.project_id === project_id);
    }

    const projects = await db.findAll('projects');
    const enriched = ledger.map(entry => {
      const proj = projects.find(p => p.id === entry.project_id);
      return {
        ...entry,
        project_title: entry.project_title || (proj ? proj.title : 'Public Infrastructure Scheme'),
        dept_code: proj ? proj.dept_code : 'EDU'
      };
    });

    res.json(enriched.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
