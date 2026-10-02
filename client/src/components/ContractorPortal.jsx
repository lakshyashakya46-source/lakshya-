import React, { useState } from 'react';
import { 
  HardHat, FileText, CheckCircle2, Clock, Upload, ArrowRight, 
  AlertCircle, DollarSign, Building2, Send
} from 'lucide-react';
import { formatRupee, submitMilestone } from '../services/api';

export default function ContractorPortal({
  projects,
  contractors,
  onRefresh,
  onOpenProject
}) {
  const [selectedContractorId, setSelectedContractorId] = useState(contractors[0]?.id || 'cont_1');
  const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);

  // Modal / Form state for submitting a milestone
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0];
  const assignedProjects = projects.filter(p => p.contractor_id === currentContractor?.id);

  const handleOpenSubmitModal = (milestone) => {
    setActiveMilestone(milestone);
    setSubmissionNotes(`Completed physical deliverables for ${milestone.milestone_title}. Labor registers and material invoices attached.`);
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!activeMilestone) return;
    setIsSubmitting(true);
    try {
      await submitMilestone(activeMilestone.id, {
        notes: submissionNotes,
        invoice_url: `${invoiceNumber}.pdf`
      });
      setActiveMilestone(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error submitting milestone: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contractor Header Card */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-amber-900/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold px-2 py-0.5 rounded">
                GovTech GeM / PWD Vendor Portal
              </span>
              <span className="text-slate-400 text-xs font-hindi">
                पंजीकृत ठेकेदार एवं कार्य निष्पादन कार्यक्षेत्र
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HardHat className="w-7 h-7 text-amber-400" />
              {currentContractor?.company_name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {currentContractor?.registration_no}
              </span>
              <span className="bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-700/50">
                Category: {currentContractor?.category}
              </span>
              <span className="text-amber-400 font-semibold">
                Rating: ★ {currentContractor?.rating} / 5.0
              </span>
              <span className="text-slate-400">
                Active Contracts: {assignedProjects.length}
              </span>
            </div>
          </div>

          {/* Switch Contractor profile */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] text-slate-400 font-medium">Switch Contractor Persona:</label>
            <select
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {contractors.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name} ({c.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
          <span>
            Under anti-leakage rules, milestone invoices trigger <strong>automated physical field inspections</strong> before fund release.
          </span>
          <span className="font-mono text-amber-300 font-semibold">PFMS Direct Escrow Credit</span>
        </div>
      </div>

      {/* Assigned Projects & Milestones */}
      <div className="space-y-6">
        {assignedProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            <Building2 className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-60" />
            No active works assigned to this contractor currently. Switch contractor persona above!
          </div>
        ) : (
          assignedProjects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {project.dept_code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{project.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Location: <strong className="text-slate-800">{project.entity?.name}</strong> ({project.entity?.district}, {project.entity?.state})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Contract Value</div>
                  <div className="text-base font-bold text-slate-900">{formatRupee(project.total_budget)}</div>
                </div>
              </div>

              {/* Milestones list for this project */}
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Milestone Tranches & Inspection Status:
                </h4>

                {(project.milestones || []).map(m => {
                  return (
                    <div
                      key={m.id}
                      className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                            {m.sequence}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {m.milestone_title}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>Tranche Payout: <strong className="text-emerald-700">{formatRupee(m.allocated_amount)}</strong></span>
                          <span>•</span>
                          <span>Status: <strong className="text-slate-800">{m.status.replace('_', ' ')}</strong></span>
                          {m.contractor_invoice_url && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-blue-600">Invoice: {m.contractor_invoice_url}</span>
                            </>
                          )}
                        </div>
                        {m.contractor_submission_notes && (
                          <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200 mt-1">
                            "{m.contractor_submission_notes}"
                          </p>
                        )}
                      </div>

                      {/* Action status button */}
                      <div className="flex-shrink-0">
                        {m.status === 'PENDING' && (
                          <button
                            onClick={() => handleOpenSubmitModal(m)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-lg shadow-sm transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Completion Invoice</span>
                          </button>
                        )}

                        {m.status === 'SUBMITTED' && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Field Inspector Dispatched</span>
                          </div>
                        )}

                        {m.status === 'INSPECTED_PASSED' && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Passed Audit • Awaiting Officer</span>
                          </div>
                        )}

                        {m.status === 'DISBURSED' && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tranche Disbursed (PFMS Paid)</span>
                          </div>
                        )}

                        {m.status === 'INSPECTED_FAILED' && (
                          <button
                            onClick={() => handleOpenSubmitModal(m)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Rectify & Resubmit Work</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {activeMilestone && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Milestone Completion
                </h3>
                <p className="text-xs text-slate-500">
                  Trigger on-site Field Inspection and submit contractor invoice
                </p>
              </div>
              <button
                onClick={() => setActiveMilestone(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4 mt-4">
              <div>
                <span className="text-xs text-slate-500">Milestone:</span>
                <div className="font-bold text-slate-800 text-sm">{activeMilestone.milestone_title}</div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  Tranche Amount Claim: {formatRupee(activeMilestone.allocated_amount)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contractor Invoice Reference *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. INV-2026-902"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Execution Report & Materials Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
                ⚠️ <strong>Notice:</strong> Submission automatically generates an inspection ticket. A field officer will visit the physical site with GPS tracking to verify your work before any funds can be released.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMilestone(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Dispatching Ticket...' : 'Confirm & Request Field Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
