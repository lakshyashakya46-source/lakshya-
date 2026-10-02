const API_BASE = '/api';

export function formatRupee(amount) {
  if (amount === null || amount === undefined) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatFullRupee(amount) {
  if (!amount) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function fetchDepartments() {
  const res = await fetch(`${API_BASE}/departments`);
  if (!res.ok) throw new Error('Failed to load departments');
  return res.json();
}

export async function fetchEntities(params = {}) {
  const query = new URLSearchParams();
  if (params.dept) query.append('dept', params.dept);
  if (params.state) query.append('state', params.state);
  if (params.search) query.append('search', params.search);
  const res = await fetch(`${API_BASE}/entities?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load entities');
  return res.json();
}

export async function fetchEntity(id) {
  const res = await fetch(`${API_BASE}/entities/${id}`);
  if (!res.ok) throw new Error('Failed to load entity');
  return res.json();
}

export async function importUdiseSchool(udiseCode) {
  const res = await fetch(`${API_BASE}/entities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ udise_code: udiseCode })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to import the UDISE school');
  }
  return res.json();
}

export async function fetchProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.dept) query.append('dept', params.dept);
  if (params.status) query.append('status', params.status);
  if (params.entity_id) query.append('entity_id', params.entity_id);
  if (params.search) query.append('search', params.search);
  const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to load project details');
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create project');
  }
  return res.json();
}

export async function submitMilestone(milestoneId, data) {
  const res = await fetch(`${API_BASE}/milestones/${milestoneId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit milestone');
  }
  return res.json();
}

export async function inspectMilestone(data) {
  const res = await fetch(`${API_BASE}/inspections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit inspection');
  }
  return res.json();
}

export async function disburseMilestone(milestoneId, data = {}) {
  const res = await fetch(`${API_BASE}/milestones/${milestoneId}/disburse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Disbursement authorization failed');
  }
  return res.json();
}

export async function fetchLedger(projectId = null) {
  const query = projectId ? `?project_id=${projectId}` : '';
  const res = await fetch(`${API_BASE}/ledger${query}`);
  if (!res.ok) throw new Error('Failed to load ledger');
  return res.json();
}

export async function fetchGrievances(params = {}) {
  const query = new URLSearchParams();
  if (params.entity_id) query.append('entity_id', params.entity_id);
  if (params.status) query.append('status', params.status);
  const res = await fetch(`${API_BASE}/grievances?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load grievances');
  return res.json();
}

export async function submitGrievance(data) {
  const res = await fetch(`${API_BASE}/grievances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit grievance');
  }
  return res.json();
}

export async function resolveGrievance(id, data) {
  const res = await fetch(`${API_BASE}/grievances/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update grievance status');
  return res.json();
}

export async function fetchContractors() {
  const res = await fetch(`${API_BASE}/contractors`);
  if (!res.ok) throw new Error('Failed to load contractors');
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/reset-seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}
