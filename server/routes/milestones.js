const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db/database');

// GET single milestone
router.get('/:id', async (req, res) => {
  try {
    const milestone = await db.findById('milestones', req.params.id);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    const inspections = await db.findAll('inspections', i => i.milestone_id === milestone.id);
    res.json({ ...milestone, inspections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Contractor submits milestone work for inspection
router.post('/:id/submit', async (req, res) => {
  try {
    const { notes, invoice_url } = req.body;
    const milestone = await db.findById('milestones', req.params.id);

    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status === 'DISBURSED') {
      return res.status(400).json({ error: 'Milestone has already been disbursed' });
    }

    const updatedMilestone = await db.update('milestones', milestone.id, {
      status: 'SUBMITTED',
      contractor_submission_notes: notes || 'Work completed as per specifications. Ready for quality inspection.',
      contractor_invoice_url: invoice_url || `INV-${Date.now().toString().slice(-6)}.pdf`,
      contractor_submitted_at: new Date().toISOString()
    });

    // Update parent project status to UNDER_INSPECTION
    const project = await db.findById('projects', milestone.project_id);
    if (project && project.status !== 'COMPLETED') {
      await db.update('projects', project.id, { status: 'UNDER_INSPECTION' });
    }

    res.json({
      message: 'Milestone work submitted successfully. Triggered field inspection ticket.',
      milestone: updatedMilestone
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Government Officer authorizes escrow disbursement
// STRICT GOVTECH RULE: Can ONLY disburse if status is INSPECTED_PASSED!
router.post('/:id/disburse', async (req, res) => {
  try {
    const { officer_name } = req.body;
    const milestone = await db.findById('milestones', req.params.id);

    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status === 'DISBURSED') {
      return res.status(400).json({ error: 'Funds for this milestone have already been released.' });
    }
    if (milestone.status !== 'INSPECTED_PASSED') {
      return res.status(400).json({
        error: 'CRITICAL ANTI-SIPHONING PROTOCOL: Milestone cannot be disbursed without passing independent Field Inspection.',
        current_status: milestone.status,
        required_status: 'INSPECTED_PASSED'
      });
    }

    const project = await db.findById('projects', milestone.project_id);
    if (!project) return res.status(404).json({ error: 'Associated project not found' });

    const contractor = await db.findById('contractors', project.contractor_id);
    const inspection = await db.findOne('inspections', i => i.milestone_id === milestone.id && i.verdict === 'APPROVED');

    // Mark milestone as DISBURSED
    const updatedMilestone = await db.update('milestones', milestone.id, {
      status: 'DISBURSED',
      disbursed_at: new Date().toISOString()
    });

    // Calculate updated disbursed amount on project
    const allProjectMilestones = await db.findAll('milestones', m => m.project_id === project.id);
    // Re-fetch to get updated status
    const freshMilestones = await db.findAll('milestones', m => m.project_id === project.id);
    const totalDisbursed = freshMilestones
      .filter(m => m.id === updatedMilestone.id ? true : m.status === 'DISBURSED')
      .reduce((sum, m) => sum + (m.allocated_amount || 0), 0);

    const allDisbursed = freshMilestones.every(m => m.id === updatedMilestone.id ? true : m.status === 'DISBURSED');
    const newProgressPct = Math.round((totalDisbursed / project.total_budget) * 100);

    await db.update('projects', project.id, {
      disbursed_amount: totalDisbursed,
      progress_pct: Math.min(newProgressPct, 100),
      status: allDisbursed ? 'COMPLETED' : 'IN_PROGRESS'
    });

    // Create immutable UTR Ledger transaction
    const utrNo = `PFMS${new Date().getFullYear()}${String(Date.now()).slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    const hash = crypto.createHash('sha256')
      .update(`${utrNo}-${milestone.id}-${milestone.allocated_amount}-${new Date().toISOString()}`)
      .digest('hex');

    const ledgerEntry = await db.insert('ledger', {
      utr_no: utrNo,
      project_id: project.id,
      milestone_id: milestone.id,
      amount: milestone.allocated_amount,
      from_account: project.escrow_account_no || 'RBI-PFMS-MASTER-ESCROW',
      to_beneficiary: contractor ? contractor.company_name : 'Authorized Vendor',
      bank_account_masked: 'SBI A/C ***' + Math.floor(1000 + Math.random() * 9000),
      approved_by: officer_name || project.officer_name || 'Sanctioning Officer (PFMS DDO)',
      verified_by_inspector: inspection ? `${inspection.inspector_name} (${inspection.inspector_id})` : 'Independent Quality Auditor',
      timestamp: new Date().toISOString(),
      cryptographic_hash: `SHA256: ${hash}`,
      project_title: project.title
    });

    res.json({
      message: 'Escrow payment tranche authorized and credited to contractor bank account.',
      milestone: updatedMilestone,
      ledger_entry: ledgerEntry,
      project_disbursed_total: totalDisbursed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
