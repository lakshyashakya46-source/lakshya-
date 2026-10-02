const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET grievances
router.get('/', async (req, res) => {
  try {
    const { entity_id, project_id, status } = req.query;
    let grievances = await db.findAll('grievances');

    if (entity_id) grievances = grievances.filter(g => g.entity_id === entity_id);
    if (project_id) grievances = grievances.filter(g => g.project_id === project_id);
    if (status && status !== 'ALL') grievances = grievances.filter(g => g.status === status);

    // Attach entity name
    const entities = await db.findAll('entities');
    const enriched = grievances.map(g => {
      const ent = entities.find(e => e.id === g.entity_id);
      return {
        ...g,
        entity_name: ent ? ent.name : 'Public Facility'
      };
    });

    res.json(enriched.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a new grievance (supports before_photo_url & after_photo_url)
router.post('/', async (req, res) => {
  try {
    const {
      entity_id,
      project_id,
      citizen_name,
      mobile,
      reporter_role,
      category,
      description,
      photo_url,
      before_photo_url,
      after_photo_url
    } = req.body;

    if (!description || !entity_id) {
      return res.status(400).json({ error: 'entity_id and description are required' });
    }

    const newGrievance = await db.insert('grievances', {
      entity_id,
      project_id: project_id || null,
      citizen_name: citizen_name || 'Concerned Citizen',
      mobile: mobile || '+91 9XXXX XXXXX',
      reporter_role: reporter_role || 'Parent / Resident',
      category: category || 'Infrastructure Quality',
      description,
      photo_url: photo_url || before_photo_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      before_photo_url: before_photo_url || null,
      after_photo_url: after_photo_url || null,
      status: 'OPEN',
      action_taken: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    });

    res.status(201).json({
      message: 'Grievance ticket registered successfully under Jan Sunwai Portal.',
      ticket_id: newGrievance.id,
      grievance: newGrievance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH resolve or update grievance
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, action_taken } = req.body;
    const grievance = await db.findById('grievances', req.params.id);

    if (!grievance) return res.status(404).json({ error: 'Grievance ticket not found' });

    const updates = {
      status: status || grievance.status,
      action_taken: action_taken || grievance.action_taken
    };

    if (status === 'RESOLVED') {
      updates.resolved_at = new Date().toISOString();
    }

    const updated = await db.update('grievances', grievance.id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
