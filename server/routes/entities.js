const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { fetchUdiseSchool, isValidUdiseCode, normalizeUdiseCode } = require('../services/udise');

// GET all entities (supports ?dept=EDU, ?state=Delhi, ?search=...)
router.get('/', async (req, res) => {
  try {
    const { dept, state, search } = req.query;
    let entities = await db.findAll('entities');

    if (dept && dept !== 'ALL') {
      entities = entities.filter(e => e.dept_code === dept);
    }
    if (state && state !== 'ALL') {
      entities = entities.filter(e => e.state.toLowerCase().includes(state.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      entities = entities.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.code_identifier.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q)
      );
    }

    // Attach active project count & total budget
    const projects = await db.findAll('projects');
    const enriched = entities.map(entity => {
      const entityProjects = projects.filter(p => p.entity_id === entity.id);
      const totalBudget = entityProjects.reduce((acc, p) => acc + (p.total_budget || 0), 0);
      const totalDisbursed = entityProjects.reduce((acc, p) => acc + (p.disbursed_amount || 0), 0);
      return {
        ...entity,
        project_count: entityProjects.length,
        total_budget: totalBudget,
        total_disbursed: totalDisbursed
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single entity with its full dossier
router.get('/:id', async (req, res) => {
  try {
    const entity = await db.findById('entities', req.params.id);
    if (!entity) return res.status(404).json({ error: 'Entity not found' });

    const projects = await db.findAll('projects', p => p.entity_id === entity.id);
    const grievances = await db.findAll('grievances', g => g.entity_id === entity.id);

    res.json({ ...entity, projects, grievances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST imports a school from UDISE directory
router.post('/', async (req, res) => {
  try {
    const udiseCode = normalizeUdiseCode(req.body.udise_code);
    if (!isValidUdiseCode(udiseCode)) {
      return res.status(400).json({ error: 'A valid 11-digit UDISE code is required.' });
    }

    const existingSchool = await db.findOne('entities', entity => entity.udise_code === udiseCode);
    if (existingSchool) {
      return res.status(409).json({ error: 'This UDISE school is already registered.', entity: existingSchool });
    }

    const school = await fetchUdiseSchool(udiseCode);
    if (!school.name || !school.state || !school.district) {
      return res.status(502).json({ error: 'The UDISE record is incomplete and cannot be registered.' });
    }
    const inserted = await db.insert('entities', school);
    res.status(201).json(inserted);
  } catch (error) {
    res.status(error.statusCode || 502).json({ error: error.message || 'Unable to import the UDISE school.' });
  }
});

module.exports = router;
