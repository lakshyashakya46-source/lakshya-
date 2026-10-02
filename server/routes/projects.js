const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { dept, status, entity_id, search } = req.query;
    let projects = await db.findAll('projects');

    if (dept && dept !== 'ALL') {
      projects = projects.filter(p => p.dept_code === dept);
    }
    if (status && status !== 'ALL') {
      projects = projects.filter(p => p.status === status);
    }
    if (entity_id) {
      projects = projects.filter(p => p.entity_id === entity_id);
    }
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.scheme_name.toLowerCase().includes(q) ||
        (p.officer_name && p.officer_name.toLowerCase().includes(q))
      );
    }

    // Enrich each project with entity details & contractor name
    const entities = await db.findAll('entities');
    const contractors = await db.findAll('contractors');
    const milestones = await db.findAll('milestones');

    const enriched = projects.map(proj => {
      const ent = entities.find(e => e.id === proj.entity_id);
      const cont = contractors.find(c => c.id === proj.contractor_id);
      const projMilestones = milestones.filter(m => m.project_id === proj.id);
      return {
        ...proj,
        entity: ent || null,
        contractor: cont || null,
        milestone_count: projMilestones.length,
        milestones: projMilestones
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project by ID with full audit dossier
router.get('/:id', async (req, res) => {
  try {
    const project = await db.findById('projects', req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const entity = await db.findById('entities', project.entity_id);
    const contractor = await db.findById('contractors', project.contractor_id);
    const milestones = await db.findAll('milestones', m => m.project_id === project.id);
    const inspections = await db.findAll('inspections');
    const ledger = await db.findAll('ledger', l => l.project_id === project.id);
    const grievances = await db.findAll('grievances', g => g.project_id === project.id);

    // Attach inspections to milestones
    const enrichedMilestones = milestones.map(m => {
      const milestoneInspections = inspections.filter(i => i.milestone_id === m.id);
      return { ...m, inspections: milestoneInspections };
    });

    res.json({
      ...project,
      entity,
      contractor,
      milestones: enrichedMilestones,
      disbursement_ledger: ledger,
      grievances
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create project (with default milestone breakdown)
router.post('/', async (req, res) => {
  try {
    const {
      entity_id,
      dept_code,
      title,
      scheme_name,
      total_budget,
      completion_deadline,
      contractor_id,
      officer_name,
      description
    } = req.body;

    if (!entity_id || !title || !total_budget) {
      return res.status(400).json({ error: 'entity_id, title, and total_budget are required' });
    }

    const budget = parseFloat(total_budget);
    const entity = await db.findById('entities', entity_id);
    if (!entity || entity.data_source !== 'UDISE' || !entity.udise_code) {
      return res.status(400).json({ error: 'Projects can only be created for a school imported from UDISE.' });
    }
    if (!Number.isFinite(budget) || budget <= 0) {
      return res.status(400).json({ error: 'total_budget must be a positive number.' });
    }
    const effectiveDeptCode = 'EDU';

    const newProject = await db.insert('projects', {
      entity_id,
      dept_code: effectiveDeptCode,
      title,
      scheme_name: scheme_name || 'National Infrastructure Development Scheme',
      total_budget: budget,
      sanctioned_amount: budget,
      disbursed_amount: 0,
      status: 'SANCTIONED',
      completion_deadline: completion_deadline || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
      sanctioned_date: new Date().toISOString().split('T')[0],
      contractor_id: contractor_id || 'cont_1',
      officer_name: officer_name || 'Nodal Sanctioning Officer',
      description: description || 'Approved infrastructure requisition.',
      escrow_account_no: `RBI-PFMS-ESCROW-${Math.floor(10000 + Math.random() * 90000)}-${effectiveDeptCode}`,
      progress_pct: 0
    });

    // Auto-generate standard 3-phase milestone tranche
    const phase1Amount = Math.round(budget * 0.35);
    const phase2Amount = Math.round(budget * 0.35);
    const phase3Amount = budget - (phase1Amount + phase2Amount);

    await db.insert('milestones', {
      project_id: newProject.id,
      milestone_title: 'Phase 1: Mobilization, Foundation & Structural Groundwork (35%)',
      sequence: 1,
      allocated_amount: phase1Amount,
      status: 'PENDING',
      contractor_submission_notes: null,
      contractor_invoice_url: null,
      contractor_submitted_at: null,
      verified_at: null,
      disbursed_at: null
    });

    await db.insert('milestones', {
      project_id: newProject.id,
      milestone_title: 'Phase 2: Core Construction, Utilities & Hardware Installation (35%)',
      sequence: 2,
      allocated_amount: phase2Amount,
      status: 'PENDING',
      contractor_submission_notes: null,
      contractor_invoice_url: null,
      contractor_submitted_at: null,
      verified_at: null,
      disbursed_at: null
    });

    await db.insert('milestones', {
      project_id: newProject.id,
      milestone_title: 'Phase 3: Finishing, Commissioning & Quality Handover (30%)',
      sequence: 3,
      allocated_amount: phase3Amount,
      status: 'PENDING',
      contractor_submission_notes: null,
      contractor_invoice_url: null,
      contractor_submitted_at: null,
      verified_at: null,
      disbursed_at: null
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
