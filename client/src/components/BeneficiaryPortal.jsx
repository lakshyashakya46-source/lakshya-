import React, { useState } from 'react';
import { 
  GraduationCap, PlusCircle, AlertCircle, CheckCircle2, Clock, 
  MapPin, Users, Phone, ArrowRight, Upload, Sparkles
} from 'lucide-react';
import { formatRupee, createProject, importUdiseSchool } from '../services/api';

export default function BeneficiaryPortal({
  entities,
  projects,
  onRefresh,
  onOpenProject
}) {
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id || '');
  const [showReqForm, setShowReqForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSchoolImport, setShowSchoolImport] = useState(false);
  const [udiseCode, setUdiseCode] = useState('');
  const [importingSchool, setImportingSchool] = useState(false);
  const [importError, setImportError] = useState('');

  // Form state for new requisition
  const [reqTitle, setReqTitle] = useState('');
  const [reqBudget, setReqBudget] = useState('2500000');
  const [reqDesc, setReqDesc] = useState('');
  const [reqPhoto, setReqPhoto] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80');

  const currentEntity = entities.find(e => e.id === selectedEntityId) || entities[0];
  const entityProjects = projects.filter(p => p.entity_id === currentEntity?.id);

  const handleSubmitRequisition = async (e) => {
    e.preventDefault();
    if (!reqTitle || !reqBudget) return;
    setSubmitting(true);
    try {
      await createProject({
        entity_id: currentEntity.id,
        dept_code: currentEntity.dept_code,
        title: reqTitle,
        scheme_name: 'School Theek Karo / Infrastructure Urgent Need',
        total_budget: parseFloat(reqBudget),
        description: reqDesc,
        officer_name: 'District Education Officer (Sanction In-Charge)'
      });
      setShowReqForm(false);
      setReqTitle('');
      setReqDesc('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error creating requisition: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSchoolImport = async (e) => {
    e.preventDefault();
    setImportingSchool(true);
    setImportError('');
    try {
      await importUdiseSchool(udiseCode);
      setUdiseCode('');
      setShowSchoolImport(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setImportError(err.message);
    } finally {
      setImportingSchool(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Entity Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-emerald-900/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded">
                School Theek Karo • SMC Portal
              </span>
              <span className="text-slate-400 text-xs font-hindi">
                विद्यालय प्रबंधन समिति एवं प्रधान पोर्टल
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-emerald-400" />
              {currentEntity?.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {currentEntity?.code_identifier}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {currentEntity?.district}, {currentEntity?.state} ({currentEntity?.pincode})
              </span>
              {currentEntity?.student_count && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  {currentEntity?.student_count} Enrolled Students
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                {currentEntity?.contact} ({currentEntity?.head_name})
              </span>
            </div>
          </div>

          {/* Quick Select another school */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] text-slate-400 font-medium">Switch Target School / Institution:</label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {entities.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.code_identifier})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button: Raise Infrastructure Need */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            Principals have statutory authority under SMC guidelines to raise infrastructure requisitions with initial photo proof.
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSchoolImport(!showSchoolImport)}
              className="flex items-center justify-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              <Upload className="w-4 h-4" />
              <span>{showSchoolImport ? 'Close UDISE Import' : 'Import UDISE School'}</span>
            </button>
            <button
              onClick={() => setShowReqForm(!showReqForm)}
              className="flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-lg shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showReqForm ? 'Close Requisition Form' : 'Raise New Infrastructure Need (स्कूल ठीक करो)'}</span>
            </button>
          </div>
        </div>
      </div>

      {showSchoolImport && (
        <form onSubmit={handleSchoolImport} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-bold text-slate-800">11-digit UDISE code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{11}"
                required
                value={udiseCode}
                onChange={(e) => setUdiseCode(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="e.g. 07040100201"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button disabled={importingSchool} className="rounded-lg bg-sky-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-800 disabled:opacity-50">
              {importingSchool ? 'Checking UDISE…' : 'Import verified school'}
            </button>
          </div>
          {importError && <p className="mt-2 text-xs text-rose-700">{importError}</p>}
          <p className="mt-2 text-[11px] text-slate-600">School identity, enrolment, address, and coordinates are read from the configured authorised UDISE directory; they cannot be entered manually here.</p>
        </form>
      )}

      {/* New Requisition Form Drawer */}
      {showReqForm && (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Official Infrastructure Requisition Form (School Theek Karo Proposal)
              </h3>
              <p className="text-xs text-slate-600">
                Direct proposal to District Education Officer & PFMS Treasury for fund sanctioning.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Step 1 of Anti-Leakage Pipeline
            </span>
          </div>

          <form onSubmit={handleSubmitRequisition} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Infrastructure Requirement Title *
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Modern Sanitation Block & Clean Drinking Water RO System"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Fund Required (in ₹) *
                </label>
                <input
                  type="number"
                  required
                  value={reqBudget}
                  onChange={(e) => setReqBudget(e.target.value)}
                  placeholder="2500000 (₹25 Lakhs)"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                  Formatted: {formatRupee(reqBudget)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Justification & Current Problems
              </label>
              <textarea
                rows={3}
                value={reqDesc}
                onChange={(e) => setReqDesc(e.target.value)}
                placeholder="Explain the damage or need. E.g. Toilets currently lack running water and roof has seepage during monsoons, affecting 800+ female students."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ground Evidence Photo URL (Initial Condition / Before Photo)
              </label>
              <input
                type="text"
                value={reqPhoto}
                onChange={(e) => setReqPhoto(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReqForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition disabled:opacity-50"
              >
                {submitting ? 'Submitting to Directorate...' : 'Submit Requisition to Govt Officer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active School Projects & Ground Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Sanctioned Infrastructure Works at this Facility ({entityProjects.length})
            </h3>
            <p className="text-xs text-slate-500">
              Contractor execution progress and upcoming field inspection schedules
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Sanctioned: <strong className="text-slate-900">{formatRupee(entityProjects.reduce((s, p) => s + p.total_budget, 0))}</strong>
          </span>
        </div>

        {entityProjects.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-60" />
            No infrastructure projects currently recorded for this facility. Click "Raise New Infrastructure Need" above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {entityProjects.map(proj => {
              const pct = proj.progress_pct || 0;
              return (
                <div
                  key={proj.id}
                  className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition flex flex-col justify-between bg-slate-50/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {proj.dept_code}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        proj.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proj.status === 'UNDER_INSPECTION'
                          ? 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Disbursed: <strong className="text-emerald-700">{formatRupee(proj.disbursed_amount)}</strong></span>
                        <span>Total: <strong className="text-slate-900">{formatRupee(proj.total_budget)}</strong></span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 text-right block font-mono">{pct}% completed</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 space-y-1">
                      <div>Assigned Contractor: <strong className="text-slate-800">{proj.contractor?.company_name || 'NIBC Ltd (Civil)'}</strong></div>
                      <div>Target Deadline: <strong className="text-slate-800">{proj.completion_deadline}</strong></div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => onOpenProject(proj.id)}
                      className="w-full text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 py-2 rounded-lg transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      View Milestone Details & Field Photos <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
