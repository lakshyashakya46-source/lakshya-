require('dotenv').config();

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const { Pool } = require('pg');



// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fundtofield',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,

  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.error('Make sure PostgreSQL is running and env variables are set correctly.');
    process.exit(1);
  }
}

// Initialize database schema
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name_en TEXT,
        name_hi TEXT,
        ministry TEXT,
        icon TEXT,
        color TEXT,
        total_budget_cr NUMERIC,
        disbursed_cr NUMERIC,
        active_projects INTEGER DEFAULT 0,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contractors (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        registration_no TEXT,
        category TEXT,
        rating NUMERIC,
        active_contracts INTEGER DEFAULT 0,
        completed_contracts INTEGER DEFAULT 0,
        contact_email TEXT,
        phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        dept_code TEXT,
        name TEXT NOT NULL,
        code_identifier TEXT,
        state TEXT,
        district TEXT,
        pincode TEXT,
        head_name TEXT,
        contact TEXT,
        latitude NUMERIC,
        longitude NUMERIC,
        student_count INTEGER,
        before_image TEXT,
        after_image TEXT,
        current_condition_rating NUMERIC,
        udise_code TEXT,
        data_source TEXT,
        source_verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        entity_id TEXT,
        dept_code TEXT,
        title TEXT NOT NULL,
        scheme_name TEXT,
        total_budget NUMERIC,
        sanctioned_amount NUMERIC,
        disbursed_amount NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'SANCTIONED',
        completion_deadline DATE,
        sanctioned_date DATE,
        contractor_id TEXT,
        officer_name TEXT,
        description TEXT,
        escrow_account_no TEXT,
        progress_pct INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        milestone_title TEXT,
        sequence INTEGER,
        allocated_amount NUMERIC,
        status TEXT DEFAULT 'PENDING',
        contractor_submission_notes TEXT,
        contractor_invoice_url TEXT,
        contractor_submitted_at TIMESTAMPTZ,
        verified_at TIMESTAMPTZ,
        disbursed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS inspections (
        id TEXT PRIMARY KEY,
        milestone_id TEXT,
        inspector_name TEXT,
        inspector_id TEXT,
        latitude NUMERIC,
        longitude NUMERIC,
        geo_verified BOOLEAN DEFAULT FALSE,
        distance_meters INTEGER,
        location_accuracy_meters NUMERIC,
        location_captured_at TIMESTAMPTZ,
        checklist JSONB DEFAULT '[]',
        photos JSONB DEFAULT '[]',
        verdict TEXT,
        notes TEXT,
        inspected_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS grievances (
        id TEXT PRIMARY KEY,
        entity_id TEXT,
        project_id TEXT,
        citizen_name TEXT,
        mobile TEXT,
        reporter_role TEXT,
        category TEXT,
        description TEXT,
        photo_url TEXT,
        before_photo_url TEXT,
        after_photo_url TEXT,
        status TEXT DEFAULT 'OPEN',
        action_taken TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ledger (
        id TEXT PRIMARY KEY,
        utr_no TEXT,
        project_id TEXT,
        milestone_id TEXT,
        amount NUMERIC,
        from_account TEXT,
        to_beneficiary TEXT,
        bank_account_masked TEXT,
        approved_by TEXT,
        verified_by_inspector TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        cryptographic_hash TEXT,
        project_title TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Database schema initialized');
  } finally {
    client.release();
  }
}

// Generate a unique ID similar to old format
function generateId(collection) {
  const prefix = collection.slice(0, 3);
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Map table names to SQL table names (same in this case)
function tableName(collection) {
  return collection; // departments, contractors, entities, projects, milestones, inspections, grievances, ledger
}

// Database helper object – same interface as the old JSON store
const db = {
  pool,
  testConnection,
  initSchema,

  async getStore() {
    const [departments, entities, contractors, projects, milestones, inspections, grievances, ledger] = await Promise.all([
      this.findAll('departments'),
      this.findAll('entities'),
      this.findAll('contractors'),
      this.findAll('projects'),
      this.findAll('milestones'),
      this.findAll('inspections'),
      this.findAll('grievances'),
      this.findAll('ledger'),
    ]);
    return { departments, entities, contractors, projects, milestones, inspections, grievances, ledger };
  },

  async findAll(collection, filterFn = null) {
    const tbl = tableName(collection);
    const result = await pool.query(`SELECT * FROM ${tbl} ORDER BY created_at ASC`);
    const rows = result.rows.map(r => this._deserializeRow(tbl, r));
    return filterFn ? rows.filter(filterFn) : rows;
  },

  async findById(collection, id) {
    const tbl = tableName(collection);
    const result = await pool.query(`SELECT * FROM ${tbl} WHERE id = $1`, [String(id)]);
    if (result.rows.length === 0) return null;
    return this._deserializeRow(tbl, result.rows[0]);
  },

  async findOne(collection, filterFn) {
    const rows = await this.findAll(collection);
    return rows.find(filterFn) || null;
  },

  async insert(collection, item) {
    const tbl = tableName(collection);
    if (!item.id) {
      item.id = generateId(collection);
    }
    if (!item.created_at) {
      item.created_at = new Date().toISOString();
    }

    const serialized = this._serializeRow(tbl, item);
    const keys = Object.keys(serialized);
    const values = Object.values(serialized);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columnsList = keys.map(k => `"${k}"`).join(', ');

    await pool.query(
      `INSERT INTO ${tbl} (${columnsList}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
      values
    );
    return item;
  },

  async update(collection, id, updates) {
    const tbl = tableName(collection);
    updates.updated_at = new Date().toISOString();
    const serialized = this._serializeRow(tbl, updates);
    const keys = Object.keys(serialized);
    const values = Object.values(serialized);
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE ${tbl} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, String(id)]
    );
    if (result.rows.length === 0) return null;
    return this._deserializeRow(tbl, result.rows[0]);
  },

  async delete(collection, id) {
    const tbl = tableName(collection);
    const result = await pool.query(`DELETE FROM ${tbl} WHERE id = $1`, [String(id)]);
    return result.rowCount > 0;
  },

  async resetStore(newStore) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const tbl of ['ledger', 'inspections', 'grievances', 'milestones', 'projects', 'entities', 'contractors', 'departments']) {
        await client.query(`DELETE FROM ${tbl}`);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    // Insert all data
    for (const [collection, items] of Object.entries(newStore)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          await this.insert(collection, item);
        }
      }
    }
    return newStore;
  },

  // Serialize JSONB fields for PostgreSQL
  _serializeRow(tbl, row) {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === undefined) continue;
      if ((key === 'checklist' || key === 'photos') && typeof value !== 'string') {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  },

  // Deserialize JSONB fields from PostgreSQL
  _deserializeRow(tbl, row) {
    const result = { ...row };
    // JSONB fields are already parsed by pg driver
    // Convert numeric strings back to numbers for key fields
    if (result.latitude !== undefined && result.latitude !== null) result.latitude = parseFloat(result.latitude);
    if (result.longitude !== undefined && result.longitude !== null) result.longitude = parseFloat(result.longitude);
    if (result.total_budget !== undefined && result.total_budget !== null) result.total_budget = parseFloat(result.total_budget);
    if (result.sanctioned_amount !== undefined && result.sanctioned_amount !== null) result.sanctioned_amount = parseFloat(result.sanctioned_amount);
    if (result.disbursed_amount !== undefined && result.disbursed_amount !== null) result.disbursed_amount = parseFloat(result.disbursed_amount);
    if (result.allocated_amount !== undefined && result.allocated_amount !== null) result.allocated_amount = parseFloat(result.allocated_amount);
    if (result.amount !== undefined && result.amount !== null) result.amount = parseFloat(result.amount);
    if (result.rating !== undefined && result.rating !== null) result.rating = parseFloat(result.rating);
    if (result.current_condition_rating !== undefined && result.current_condition_rating !== null) result.current_condition_rating = parseFloat(result.current_condition_rating);
    if (result.total_budget_cr !== undefined && result.total_budget_cr !== null) result.total_budget_cr = parseFloat(result.total_budget_cr);
    if (result.disbursed_cr !== undefined && result.disbursed_cr !== null) result.disbursed_cr = parseFloat(result.disbursed_cr);
    if (result.distance_meters !== undefined && result.distance_meters !== null) result.distance_meters = parseInt(result.distance_meters);
    if (result.progress_pct !== undefined && result.progress_pct !== null) result.progress_pct = parseInt(result.progress_pct);
    if (result.student_count !== undefined && result.student_count !== null) result.student_count = parseInt(result.student_count);
    if (result.active_contracts !== undefined && result.active_contracts !== null) result.active_contracts = parseInt(result.active_contracts);
    if (result.completed_contracts !== undefined && result.completed_contracts !== null) result.completed_contracts = parseInt(result.completed_contracts);
    if (result.active_projects !== undefined && result.active_projects !== null) result.active_projects = parseInt(result.active_projects);
    return result;
  }
};

module.exports = db;
