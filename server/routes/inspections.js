const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper to calculate distance in meters between two lat/lng coordinates (Haversine formula)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function isCoordinate(value, minimum, maximum) {
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum;
}

// GET all inspections (supports ?milestone_id=...)
router.get('/', async (req, res) => {
  try {
    const { milestone_id } = req.query;
    let inspections = await db.findAll('inspections');
    if (milestone_id) {
      inspections = inspections.filter(i => i.milestone_id === milestone_id);
    }
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a field inspection report
router.post('/', async (req, res) => {
  try {
    const {
      milestone_id,
      inspector_name,
      inspector_id,
      latitude,
      longitude,
      checklist,
      photos,
      verdict,
      notes,
      location_accuracy_meters,
      location_captured_at
    } = req.body;

    if (!milestone_id || !verdict) {
      return res.status(400).json({ error: 'milestone_id and verdict are required' });
    }

    const milestone = await db.findById('milestones', milestone_id);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    const project = await db.findById('projects', milestone.project_id);
    const entity = project ? await db.findById('entities', project.entity_id) : null;

    const latitudeValue = Number(latitude);
    const longitudeValue = Number(longitude);
    const accuracyMeters = Number(location_accuracy_meters);
    const capturedAt = new Date(location_captured_at);
    const maximumLocationAgeMs = 5 * 60 * 1000;

    if (!entity || !isCoordinate(entity.latitude, -90, 90) || !isCoordinate(entity.longitude, -180, 180)) {
      return res.status(409).json({ error: 'The target school has no verified UDISE coordinates.' });
    }
    if (!isCoordinate(latitudeValue, -90, 90) || !isCoordinate(longitudeValue, -180, 180)) {
      return res.status(400).json({ error: 'A current GPS latitude and longitude are required.' });
    }
    if (!Number.isFinite(accuracyMeters) || accuracyMeters <= 0 || accuracyMeters > 100) {
      return res.status(400).json({ error: 'GPS accuracy must be 100 metres or better.' });
    }
    if (Number.isNaN(capturedAt.getTime()) || Math.abs(Date.now() - capturedAt.getTime()) > maximumLocationAgeMs) {
      return res.status(400).json({ error: 'Capture a fresh GPS location within the last five minutes.' });
    }

    const distanceMeters = getDistanceMeters(latitudeValue, longitudeValue, entity.latitude, entity.longitude);
    const geofenceRadius = Number(process.env.GEOFENCE_RADIUS_METERS || 500);
    const geoVerified = distanceMeters + accuracyMeters <= geofenceRadius;

    if (!geoVerified) {
      return res.status(422).json({
        error: `Inspection location is outside the ${geofenceRadius}m school geofence.`,
        distance_meters: distanceMeters,
        location_accuracy_meters: accuracyMeters
      });
    }

    const newInspection = await db.insert('inspections', {
      milestone_id,
      inspector_name: inspector_name || 'Govt Quality Auditor',
      inspector_id: inspector_id || 'UNASSIGNED',
      latitude: latitudeValue,
      longitude: longitudeValue,
      geo_verified: geoVerified,
      distance_meters: distanceMeters,
      location_accuracy_meters: accuracyMeters,
      location_captured_at: capturedAt.toISOString(),
      checklist: checklist || [
        { item: 'Structural specifications adherence', passed: verdict === 'APPROVED' },
        { item: 'Quality of materials verified on-site', passed: verdict === 'APPROVED' },
        { item: 'Zero siphoning or ghost labor detected', passed: verdict !== 'FRAUD_SUSPECTED' }
      ],
      photos: photos && photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80'
      ],
      verdict, // APPROVED, CORRECTIONS_REQUIRED, FRAUD_SUSPECTED
      notes: notes || 'Physical site inspection completed.',
      inspected_at: new Date().toISOString()
    });

    // Update milestone status based on inspection verdict
    if (verdict === 'APPROVED') {
      await db.update('milestones', milestone.id, {
        status: 'INSPECTED_PASSED',
        verified_at: new Date().toISOString()
      });
    } else if (verdict === 'CORRECTIONS_REQUIRED') {
      await db.update('milestones', milestone.id, { status: 'INSPECTED_FAILED' });
    } else if (verdict === 'FRAUD_SUSPECTED') {
      await db.update('milestones', milestone.id, { status: 'INSPECTED_FAILED' });
      if (project) {
        await db.update('projects', project.id, { status: 'HALTED' });
      }
    }

    res.status(201).json({
      message: `Inspection recorded with verdict: ${verdict}`,
      inspection: newInspection
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
