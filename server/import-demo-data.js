const XLSX = require('xlsx');
const db = require('./db/database');

async function run() {

  const workbook = XLSX.readFile(
  './data/fund_to_field_21_schools_10_projects_30_milestones_demo-2.xlsx'
);


  const schools =
    XLSX.utils.sheet_to_json(workbook.Sheets['Schools_21']);

  const projects =
    XLSX.utils.sheet_to_json(workbook.Sheets['Projects_10']);

  const milestones =
    XLSX.utils.sheet_to_json(workbook.Sheets['Milestones_30']);

  console.log(
    `Schools=${schools.length}, Projects=${projects.length}, Milestones=${milestones.length}`
  );

  // IMPORT SCHOOLS
  for (const s of schools) {

    await db.insert('entities', {
      id: `SCH-${s.udise_code_from_notebook}`,
      dept_code: 'EDU',
      name: s.school_name,
      code_identifier: String(s.udise_code_from_notebook),
      district: s.district_demo,
      state: s.state_demo,
      head_name: 'Principal',
      contact: '',
      student_count: 0
    });

  }

  // IMPORT PROJECTS
  for (const p of projects) {

    await db.insert('projects', {
      id: p.project_id,
      entity_id: `SCH-${p.udise_code}`,
      dept_code: 'EDU',
      title: p.project_name,
      scheme_name: p.program,
      total_budget: 1000000,
      sanctioned_amount: 1000000,
      disbursed_amount: 0,
      status: 'SANCTIONED',
      contractor_id: 'cont_1',
      officer_name: p.contractor_name,
      description: p.sector,
      progress_pct: 0
    });

  }

  // IMPORT MILESTONES
  for (const m of milestones) {

    await db.insert('milestones', {
      id: m.milestone_id,
      project_id: m.project_id,
      milestone_title: m.milestone_name,
      sequence: 1,
      allocated_amount: 100000,
      status: m.status,
      contractor_submission_notes: m.description
    });

  }

  console.log('✅ IMPORT COMPLETE');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


