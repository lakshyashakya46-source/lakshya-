import React, { useState } from 'react';
import { 
  Users, Search, SlidersHorizontal, MessageSquareWarning, CheckCircle2, 
  MapPin, Clock, ArrowRight, ShieldCheck, Heart, Sparkles, Filter, ExternalLink,
  Image, Link
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { formatRupee, formatFullRupee, submitGrievance } from '../services/api';

export default function PublicPortal({
  entities,
  projects,
  ledger,
  grievances,
  onRefresh,
  onOpenProject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  // Grievance form state
  const [targetEntityId, setTargetEntityId] = useState(entities[0]?.id || '');
  const [citizenName, setCitizenName] = useState('');
  const [citizenMobile, setCitizenMobile] = useState('');
  const [reporterRole, setReporterRole] = useState('Parent');
  const [grievanceCategory, setGrievanceCategory] = useState('Infrastructure Quality');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [beforePhotoUrl, setBeforePhotoUrl] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [submittingGrievance, setSubmittingGrievance] = useState(false);

  // States list for filtering
  const states = ['ALL', ...new Set(entities.map(e => e.state))];

  const filteredEntities = entities.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code_identifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'ALL' || e.state === selectedState;
    return matchesSearch && matchesState;
  });

  const handleGrievanceSubmit = async (e) => {
    e.preventDefault();
    if (!grievanceDesc || !targetEntityId) return;
    setSubmittingGrievance(true);
    try {
      const result = await submitGrievance({
        entity_id: targetEntityId,
        citizen_name: citizenName || 'Concerned Citizen',
        mobile: citizenMobile || '+91 98XXX XXXXX',
        reporter_role: reporterRole,
        category: grievanceCategory,
        description: grievanceDesc,
        photo_url: beforePhotoUrl || undefined,
        before_photo_url: beforePhotoUrl || undefined,
        after_photo_url: afterPhotoUrl || undefined
      });
      alert(`✅ Grievance successfully submitted!\n\nTicket ID: ${result.ticket_id}\n\nYour complaint has been logged in the Jan Sunwai public register. An officer will review within 7 working days.`);
      setShowGrievanceModal(false);
      setGrievanceDesc('');
      setBeforePhotoUrl('');
      setAfterPhotoUrl('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error submitting grievance: ' + err.message);
    } finally {
      setSubmittingGrievance(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Public Portal Hero Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-rose-900/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold px-2 py-0.5 rounded">
              School Theek Karo • Jan Sunwai Transparency
            </span>
            <span className="text-slate-400 text-xs font-hindi">
              खुला नागरिक व अभिभावक निगरानी मंच
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Where Is Your Tax Money Going? Track Every School & Project.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In government schools and rural roads across India, public funds must reach the ground. Compare verified Before &amp; After photos, inspect immutable treasury transactions, and raise your voice against substandard work or siphoning.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="flex items-center gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl shadow-lg transition"
            >
              <MessageSquareWarning className="w-4 h-4 text-amber-300" />
              <span>आवाज़ उठाओ (File Public Grievance / Report Substandard Work)</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              🛡️ 100% Whistleblower Protection
            </span>
          </div>
        </div>
      </div>

      {/* Public Search & State Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search school name, UDISE code, or district..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter State:</span>
          {states.map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition border ${
                selectedState === st
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities & Before/After Showcase Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Verified Public Infrastructure Transformation</span>
            <span className="text-xs font-normal text-slate-500">({filteredEntities.length} facilities found)</span>
          </h3>
          <span className="text-xs text-slate-400">Swipe or drag slider on any image</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEntities.map(entity => {
            const facilityProjects = projects.filter(p => p.entity_id === entity.id);
            const totalSanctioned = facilityProjects.reduce((s, p) => s + p.total_budget, 0);
            const totalDisbursed = facilityProjects.reduce((s, p) => s + (p.disbursed_amount || 0), 0);

            return (
              <div
                key={entity.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="p-5 space-y-4">
                  {/* Entity Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded font-mono">
                          {entity.code_identifier}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {entity.dept_code === 'EDU' ? 'Government School'
                            : entity.dept_code === 'HEALTH' ? 'Primary Health Centre'
                            : entity.dept_code === 'WATER' ? 'Jal Jeevan Mission'
                            : entity.dept_code === 'TRANS' ? 'Road Project'
                            : entity.dept_code === 'STARTUP' ? 'Startup / Innovation Lab'
                            : entity.dept_code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{entity.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {entity.district}, {entity.state} ({entity.pincode})
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Public Rating</div>
                      <div className="text-xs font-bold text-amber-500">
                        ★ {entity.current_condition_rating || 4.5} / 5.0
                      </div>
                    </div>
                  </div>

                  {/* Interactive Before & After Slider */}
                  {entity.before_image && entity.after_image ? (
                    <BeforeAfterSlider
                      beforeImage={entity.before_image}
                      afterImage={entity.after_image}
                      beforeLabel="Before (Initial State)"
                      afterLabel="After (Renovated & Inspected)"
                      title={`${entity.name} Transformation`}
                    />
                  ) : (
                    <div className="bg-slate-100 rounded-xl h-40 flex items-center justify-center text-slate-400 text-xs">
                      No before/after photos available yet
                    </div>
                  )}

                  {/* Fund Transparency Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[11px]">Sanctioned Fund:</span>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {formatRupee(totalSanctioned)}
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 text-[11px]">Disbursed (Audited):</span>
                      <div className="font-bold text-emerald-800 text-sm mt-0.5">
                        {formatRupee(totalDisbursed)}
                      </div>
                    </div>
                  </div>

                  {/* Associated Projects Breakdown */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Active Schemes ({facilityProjects.length}):
                    </span>
                    {facilityProjects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => onOpenProject(proj.id)}
                        className="text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between border border-slate-200 transition"
                      >
                        <span className="font-semibold text-slate-800 truncate">{proj.title}</span>
                        <span className="text-blue-600 font-bold flex items-center gap-0.5 text-[11px] flex-shrink-0">
                          View Proof <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Contact: {entity.head_name}</span>
                  <button
                    onClick={() => {
                      setTargetEntityId(entity.id);
                      setShowGrievanceModal(true);
                    }}
                    className="font-bold text-rose-600 hover:text-rose-800 hover:underline"
                  >
                    Report Issue →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Public Immutable Fund Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-slate-900">
                Public Financial Transparency Ledger (PFMS Real-Time Transactions)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Every single rupee released from government treasury is cryptographically audited and publicly verifiable.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-semibold">
            {ledger.length} Verified Disbursements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">PFMS UTR &amp; Date</th>
                <th className="py-2.5 px-3">Project / Scheme</th>
                <th className="py-2.5 px-3">Vendor / Recipient</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Quality Inspector Clearance</th>
                <th className="py-2.5 px-3">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-900">{entry.utr_no}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{entry.project_title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{entry.from_account}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{entry.to_beneficiary}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{entry.bank_account_masked}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700 font-mono">
                    {formatRupee(entry.amount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {entry.verified_by_inspector}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 max-w-[150px] truncate" title={entry.cryptographic_hash}>
                    {entry.cryptographic_hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Citizen Grievances Track */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Jan Sunwai Public Grievances &amp; Redressal Tracker ({grievances.length})
            </h3>
            <p className="text-xs text-slate-500">Citizen complaints logged with photo evidence</p>
          </div>
          <button
            onClick={() => setShowGrievanceModal(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg"
          >
            + File Complaint
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grievances.map(g => (
            <div key={g.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                  {g.category}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  g.status === 'RESOLVED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {g.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900">{g.entity_name}</div>
              <p className="text-xs text-slate-600 italic">"{g.description}"</p>

              {/* Show before/after evidence photos if present */}
              {(g.before_photo_url || g.after_photo_url) && (
                <div className="flex gap-2 pt-1">
                  {g.before_photo_url && (
                    <a
                      href={g.before_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                    >
                      <Image className="w-3 h-3" /> Before Photo
                    </a>
                  )}
                  {g.after_photo_url && (
                    <a
                      href={g.after_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded"
                    >
                      <Image className="w-3 h-3" /> After Photo
                    </a>
                  )}
                </div>
              )}

              {g.action_taken && (
                <div className="bg-emerald-50 text-emerald-900 p-2 rounded text-[11px] border border-emerald-100">
                  <strong>Action Taken by Officer:</strong> {g.action_taken}
                </div>
              )}

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                <span>Reported by: {g.citizen_name} ({g.reporter_role})</span>
                <span>{new Date(g.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Grievance Modal with Before/After Photo URLs ─── */}
      {showGrievanceModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareWarning className="w-5 h-5 text-rose-600" />
                  Jan Sunwai (आवाज़ उठाओ) Grievance Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Report substandard work, cracked walls, missing taps, or abandoned contractor sites.
                </p>
              </div>
              <button
                onClick={() => setShowGrievanceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target School / Public Asset *
                </label>
                <select
                  value={targetEntityId}
                  onChange={(e) => setTargetEntityId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.district}, {e.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional / Anonymous)
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Relation
                  </label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                  >
                    <option value="Parent">Parent of Student</option>
                    <option value="Local Resident">Local Resident / Citizen</option>
                    <option value="Teacher">School Teacher / Staff</option>
                    <option value="Student">Student</option>
                    <option value="Patient / Visitor">Patient / Visitor (Health)</option>
                    <option value="Farmer">Farmer / Road User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nature of Problem / Category
                </label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                >
                  <option value="Infrastructure Quality">Substandard Materials / Damaged Within Months</option>
                  <option value="Contractor Delay">Contractor Abandoned Site / Stalled Work</option>
                  <option value="Sanitation & Water">Toilets Locked or No Water Supply</option>
                  <option value="Suspected Siphoning">Funds Sanctioned but No Visible Work</option>
                  <option value="Safety Hazard">Dangerous Open Wiring / Deep Pit Left Open</option>
                  <option value="Healthcare Neglect">Medical Equipment Not Working / No Doctor</option>
                  <option value="Road Quality Scrutiny">Road Cracking / Pothole / Substandard Asphalt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe What Happened *
                </label>
                <textarea
                  rows={3}
                  required
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  placeholder="Detail the location inside the facility, what is broken, or how long the contractor has been absent..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              {/* ── Photo Evidence Links ── */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Link className="w-3.5 h-3.5" />
                  Photo Evidence Links (Optional but Powerful)
                </div>
                <p className="text-[11px] text-amber-700">
                  Paste public image URLs showing the problem. You can use Google Photos, WhatsApp shared link, or any photo hosting service.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    📸 Before Photo URL (Current Problem State)
                  </label>
                  <input
                    type="url"
                    value={beforePhotoUrl}
                    onChange={(e) => setBeforePhotoUrl(e.target.value)}
                    placeholder="https://photos.google.com/... or any public image URL"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  {beforePhotoUrl && (
                    <div className="mt-1.5 rounded-lg overflow-hidden border border-slate-200 max-h-24">
                      <img
                        src={beforePhotoUrl}
                        alt="Before preview"
                        className="w-full object-cover max-h-24"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    📸 After Photo URL (Comparison / What It Should Look Like)
                  </label>
                  <input
                    type="url"
                    value={afterPhotoUrl}
                    onChange={(e) => setAfterPhotoUrl(e.target.value)}
                    placeholder="https://... (optional comparison photo)"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  {afterPhotoUrl && (
                    <div className="mt-1.5 rounded-lg overflow-hidden border border-slate-200 max-h-24">
                      <img
                        src={afterPhotoUrl}
                        alt="After preview"
                        className="w-full object-cover max-h-24"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrievance}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow transition disabled:opacity-50"
                >
                  {submittingGrievance ? 'Logging Ticket...' : '🚨 File Grievance Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
