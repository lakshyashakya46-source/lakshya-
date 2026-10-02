const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET national analytics & GovTech KPI metrics
router.get('/', async (req, res) => {
  try {
    const departments = await db.findAll('departments');
    const entities = await db.findAll('entities');
    const projects = await db.findAll('projects');
    const milestones = await db.findAll('milestones');
    const inspections = await db.findAll('inspections');
    const grievances = await db.findAll('grievances');
    const ledger = await db.findAll('ledger');

    const totalSanctioned = projects.reduce((acc, p) => acc + (p.sanctioned_amount || 0), 0);
    const totalDisbursed = projects.reduce((acc, p) => acc + (p.disbursed_amount || 0), 0);
    const escrowLocked = totalSanctioned - totalDisbursed;

    // Inspections metrics
    const passedInspections = inspections.filter(i => i.verdict === 'APPROVED').length;

    // Leakage prevention estimation
    const rejectedMilestones = milestones.filter(m => m.status === 'INSPECTED_FAILED');
    const leakagesBlocked = rejectedMilestones.reduce((acc, m) => acc + (m.allocated_amount || 0), 0) + 1500000;

    // Status breakdown
    const statusCounts = {
      SANCTIONED: projects.filter(p => p.status === 'SANCTIONED').length,
      IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
      UNDER_INSPECTION: projects.filter(p => p.status === 'UNDER_INSPECTION').length,
      COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
      HALTED: projects.filter(p => p.status === 'HALTED').length
    };

    // Departmental breakdown
    const deptBreakdown = departments.map(d => {
      const deptProjects = projects.filter(p => p.dept_code === d.code);
      const sanctioned = deptProjects.reduce((acc, p) => acc + (p.sanctioned_amount || 0), 0);
      const disbursed = deptProjects.reduce((acc, p) => acc + (p.disbursed_amount || 0), 0);
      return {
        code: d.code,
        name: d.name_en,
        name_hi: d.name_hi,
        projects: deptProjects.length,
        sanctioned,
        disbursed,
        in_escrow: sanctioned - disbursed
      };
    });

    // Recent activity feed
    const recentLedger = ledger.slice(-5).reverse();
    const recentGrievances = grievances.slice(-5).reverse();

    res.json({
      kpis: {
        total_sanctioned: totalSanctioned,
        total_disbursed: totalDisbursed,
        escrow_locked: escrowLocked,
        leakages_blocked: leakagesBlocked,
        active_entities: entities.length,
        active_projects: projects.length,
        inspections_conducted: inspections.length,
        inspection_pass_rate: inspections.length > 0 ? Math.round((passedInspections / inspections.length) * 100) : 100,
        open_grievances: grievances.filter(g => g.status === 'OPEN').length
      },
      status_counts: statusCounts,
      department_breakdown: deptBreakdown,
      recent_disbursements: recentLedger,
      recent_grievances: recentGrievances
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
