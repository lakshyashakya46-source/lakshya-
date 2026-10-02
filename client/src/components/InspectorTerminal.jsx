import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Check,
  X
} from 'lucide-react';

import {
  formatRupee,
  inspectMilestone
} from '../services/api';

export default function InspectorTerminal({
  projects = [],
  entities = [],
  onRefresh
}) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');

  const [inspectorName, setInspectorName] =
    useState('Er. Deepa Nair');

  const [inspectorId, setInspectorId] =
    useState('PWD-QI-DL-088');

  const [verdict, setVerdict] =
    useState('APPROVED');

  const [notes, setNotes] =
    useState('');

  const [location, setLocation] =
    useState(null);

  const [locationError, setLocationError] =
    useState('');

  const [isLocating, setIsLocating] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [checklist, setChecklist] = useState([
    {
      id: 1,
      text: 'Structural measurements match approved BOQ',
      passed: true
    },
    {
      id: 2,
      text: 'Construction material quality verified',
      passed: true
    },
    {
      id: 3,
      text: 'Sanitary and water systems functional',
      passed: true
    },
    {
      id: 4,
      text: 'Safety compliance verified',
      passed: true
    },
    {
      id: 5,
      text: 'Principal / SMC satisfaction noted',
      passed: true
    }
  ]);

  // --------------------------------------------------
  // INSPECTION QUEUE
  // --------------------------------------------------

  const pendingTickets = [];

  projects.forEach((project) => {
    const milestones = project.milestones || [];

    milestones.forEach((milestone) => {
      if (
        milestone.status === 'SUBMITTED' ||
        milestone.status === 'INSPECTED_FAILED'
      ) {
        pendingTickets.push({
          ...milestone,
          project: project,
          entity: project.entity || null
        });
      }
    });
  });

  // --------------------------------------------------
  // ACTIVE TICKET
  // --------------------------------------------------

  const activeTicket =
    pendingTickets.find(
      (ticket) => ticket.id === selectedMilestoneId
    ) ||
    pendingTickets[0] ||
    null;

  // --------------------------------------------------
  // GPS
  // --------------------------------------------------

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'GPS is not supported by this browser.'
      );
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: new Date(
            position.timestamp
          ).toISOString()
        });

        setIsLocating(false);
      },
      (error) => {
        setLocationError(
          error.message ||
            'Unable to capture GPS location.'
        );

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12000
      }
    );
  };

  // --------------------------------------------------
  // CHECKLIST
  // --------------------------------------------------

  const handleToggleChecklist = (id) => {
    setChecklist((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              passed: !item.passed
            }
          : item
      )
    );
  };

  // --------------------------------------------------
  // SUBMIT INSPECTION
  // --------------------------------------------------

  const handleSubmitAudit = async () => {
    if (!activeTicket) {
      alert('Please select an inspection ticket.');
      return;
    }

    if (!location) {
      setLocationError(
        'Please capture GPS before submitting the inspection.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await inspectMilestone({
        milestone_id: activeTicket.id,

        inspector_name: inspectorName,

        inspector_id: inspectorId,

        latitude: location.latitude,

        longitude: location.longitude,

        location_accuracy_meters:
          location.accuracy,

        location_captured_at:
          location.capturedAt,

        checklist: checklist.map((item) => ({
          item: item.text,
          passed: item.passed
        })),

        photos: [],

        verdict: verdict,

        notes:
          notes ||
          `Field inspection completed by ${inspectorName}.`
      });

      alert(
        `Inspection submitted successfully: ${verdict}`
      );

      setSelectedMilestoneId('');
      setNotes('');
      setLocation(null);
      setLocationError('');

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      alert(
        'Inspection submission failed: ' +
          error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">

        <div className="flex items-center gap-3">

          <Camera className="w-8 h-8 text-purple-400" />

          <div>

            <h2 className="text-2xl font-bold">
              Field Inspection Terminal
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Independent Quality Inspection
            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-xs">

          <span className="text-purple-300">
            Inspector: {inspectorName}
          </span>

          <span className="text-slate-400">
            ID: {inspectorId}
          </span>

          <span className="text-amber-400 font-bold">
            {pendingTickets.length} Pending
          </span>

        </div>

      </div>

      {/* EMPTY */}

      {pendingTickets.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />

          <h3 className="font-bold text-slate-900">
            No Pending Inspection Tickets
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            No submitted milestones are waiting for inspection.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* QUEUE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">

            <h3 className="font-bold text-slate-900 mb-4">
              Inspection Queue
            </h3>

            <div className="space-y-3">

              {pendingTickets.map((ticket) => (

                <button
                  key={ticket.id}
                  type="button"
                  onClick={() =>
                    setSelectedMilestoneId(
                      ticket.id
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl border ${
                    activeTicket?.id === ticket.id
                      ? 'bg-purple-50 border-purple-500'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >

                  <div className="text-xs font-bold text-purple-700">
                    {ticket.project?.dept_code ||
                      'PROJECT'}
                  </div>

                  <div className="font-bold text-sm text-slate-900 mt-1">
                    {ticket.milestone_title}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {ticket.entity?.name ||
                      'Entity unavailable'}
                  </div>

                  <div className="text-xs text-emerald-700 font-bold mt-2">
                    {formatRupee(
                      ticket.allocated_amount || 0
                    )}
                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* MAIN FORM */}

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">

            <div className="border-b border-slate-200 pb-4">

              <div className="text-xs font-bold text-purple-600">
                ACTIVE INSPECTION
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {activeTicket?.milestone_title ||
                  'Select a milestone'}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Target:{' '}
                {activeTicket?.entity?.name ||
                  'Not selected'}
              </p>

            </div>

            {/* GPS */}

            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div>

                  <div className="text-sm font-bold text-slate-800">
                    Field GPS
                  </div>

                  <div className="text-xs text-slate-500 mt-1">

                    {location
                      ? `${location.latitude.toFixed(
                          6
                        )}, ${location.longitude.toFixed(
                          6
                        )} ±${Math.round(
                          location.accuracy
                        )}m`
                      : 'GPS not captured'}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={captureLocation}
                  disabled={isLocating}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                >

                  <span className="flex items-center gap-2">

                    <Navigation className="w-4 h-4" />

                    {isLocating
                      ? 'Capturing...'
                      : 'Capture GPS'}

                  </span>

                </button>

              </div>

              {locationError && (

                <p className="text-xs text-red-600 mt-3">
                  {locationError}
                </p>

              )}

            </div>

            {/* CHECKLIST */}

            <div className="mt-6">

              <h3 className="text-sm font-bold text-slate-800 mb-3">
                Quality Checklist
              </h3>

              <div className="space-y-2">

                {checklist.map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleToggleChecklist(
                        item.id
                      )
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left ${
                      item.passed
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >

                    <span className="text-xs font-medium text-slate-800">
                      {item.text}
                    </span>

                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        item.passed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >

                      {item.passed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}

                    </span>

                  </button>

                ))}

              </div>

            </div>

            {/* INSPECTOR */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

              <div>

                <label className="text-xs font-bold text-slate-700">
                  Inspector Name
                </label>

                <input
                  value={inspectorName}
                  onChange={(event) =>
                    setInspectorName(
                      event.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                />

              </div>

              <div>

                <label className="text-xs font-bold text-slate-700">
                  Inspector ID
                </label>

                <input
                  value={inspectorId}
                  onChange={(event) =>
                    setInspectorId(
                      event.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                />

              </div>

            </div>

            {/* VERDICT */}

            <div className="mt-6">

              <div className="text-xs font-bold text-slate-700 mb-2">
                Inspection Verdict
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setVerdict('APPROVED')
                  }
                  className={`p-3 rounded-lg border text-xs font-bold ${
                    verdict === 'APPROVED'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  APPROVED
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVerdict(
                      'CORRECTIONS_REQUIRED'
                    )
                  }
                  className={`p-3 rounded-lg border text-xs font-bold ${
                    verdict ===
                    'CORRECTIONS_REQUIRED'
                      ? 'bg-amber-100 border-amber-500 text-amber-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  CORRECTIONS REQUIRED
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVerdict(
                      'FRAUD_SUSPECTED'
                    )
                  }
                  className={`p-3 rounded-lg border text-xs font-bold ${
                    verdict ===
                    'FRAUD_SUSPECTED'
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  FRAUD SUSPECTED
                </button>

              </div>

            </div>

            {/* NOTES */}

            <div className="mt-6">

              <label className="text-xs font-bold text-slate-700">
                Inspector Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="Enter inspection observations..."
              />

            </div>

            {/* SUBMIT */}

            <button
              type="button"
              onClick={handleSubmitAudit}
              disabled={
                isSubmitting ||
                !activeTicket ||
                !location
              }
              className="w-full mt-6 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl disabled:opacity-50"
            >

              {isSubmitting
                ? 'Submitting...'
                : 'Submit Inspection Report'}

            </button>

          </div>

        </div>

      )}

    </div>
  );
}