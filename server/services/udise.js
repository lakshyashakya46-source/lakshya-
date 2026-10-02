const UDISE_CODE_PATTERN = /^\d{11}$/;

function normalizeUdiseCode(value) {
  return String(value || '').replace(/\D/g, '');
}

function isValidUdiseCode(value) {
  return UDISE_CODE_PATTERN.test(normalizeUdiseCode(value));
}

function firstValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key];
  }
  return null;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSchool(record, udiseCode) {
  const latitude = toNumber(firstValue(record, ['latitude', 'lat', 'school_latitude']));
  const longitude = toNumber(firstValue(record, ['longitude', 'lng', 'lon', 'school_longitude']));

  if (!latitude || !longitude) throw new Error('The UDISE record does not include usable school coordinates.');

  return {
    dept_code: 'EDU',
    name: firstValue(record, ['school_name', 'name', 'schoolName']),
    code_identifier: `UDISE: ${udiseCode}`,
    udise_code: udiseCode,
    state: firstValue(record, ['state_name', 'state', 'stateName']),
    district: firstValue(record, ['district_name', 'district', 'districtName']),
    pincode: String(firstValue(record, ['pincode', 'pin_code', 'pin']) || ''),
    head_name: firstValue(record, ['head_name', 'headName', 'principal_name']) || 'School Head',
    contact: firstValue(record, ['contact', 'phone', 'mobile']) || '',
    latitude,
    longitude,
    student_count: toNumber(firstValue(record, ['student_count', 'enrollment', 'total_enrolment'])),
    before_image: null,
    after_image: null,
    current_condition_rating: null,
    data_source: 'UDISE',
    source_verified_at: new Date().toISOString()
  };
}

async function fetchUdiseSchool(udiseCode) {
  const baseUrl = process.env.UDISE_DIRECTORY_URL;
  if (!baseUrl) {
    const error = new Error('UDISE directory integration is not configured. Set UDISE_DIRECTORY_URL before importing a school.');
    error.statusCode = 503;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(udiseCode)}`, {
      headers: process.env.UDISE_DIRECTORY_TOKEN ? { Authorization: `Bearer ${process.env.UDISE_DIRECTORY_TOKEN}` } : {},
      signal: controller.signal
    });
    if (response.status === 404) {
      const error = new Error('No school was found for this UDISE code.');
      error.statusCode = 404;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`UDISE directory request failed (${response.status}).`);
      error.statusCode = 502;
      throw error;
    }
    const payload = await response.json();
    return normalizeSchool(payload.data || payload, udiseCode);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { fetchUdiseSchool, isValidUdiseCode, normalizeUdiseCode };
