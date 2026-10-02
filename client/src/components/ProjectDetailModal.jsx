import React, { useEffect, useState } from 'react';
import { 
  Building2, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  MapPin, FileText, ArrowRight, ExternalLink, X, Lock
} from 'lucide-react';
import { fetchProject, formatRupee, formatFullRupee } from '../services/api';

export default function ProjectDetailModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetchProject(projectId)
      .then(data => setProject(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Loading project audit dossier...
          </div>
        ) : !project ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Project not found.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-t-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                      {project.dept_code} • {project.scheme_name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      project.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : project.status === 'UNDER_INSPECTION'
                        ? 'bg-purple-950 text-purple-300 border-purple-700'
                        : 'bg-blue-950 text-blue-300 border-blue-700'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {project.title}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{project.entity?.name} ({project.entity?.district}, {project.entity?.state})</span>
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Financial Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Total Sanctioned:</span>
                  <div className="font-bold text-white text-base">{formatRupee(project.total_budget)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Released to Contractor:</span>
                  <div className="font-bold text-emerald-400 text-base">{formatRupee(project.disbursed_amount)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Locked in Escrow:</span>
                  <div className="font-bold text-amber-400 text-base">{formatRupee(project.total_budget - (project.disbursed_amount || 0))}</div>
                </div>
                <div>
                  <span className="text-slate-400">Completion Target:</span>
                  <div className="font-bold text-slate-200 text-base">{project.completion_deadline}</div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="px-6 pb-6 space-y-6">
              {/* Description & Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Scope of Work & Objectives:</span>
                  <p className="text-slate-600 leading-relaxed">{project.description}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 block mb-1">Contract & Escrow Allocation:</span>
                  <div>Contractor: <strong className="text-slate-900">{project.contractor?.company_name}</strong></div>
                  <div>Registration / GSTIN: <strong className="text-slate-900 font-mono">{project.contractor?.registration_no}</strong></div>
                  <div>Nodal Officer: <strong className="text-slate-900">{project.officer_name}</strong></div>
                  <div>Escrow Account: <strong className="text-slate-900 font-mono">{project.escrow_account_no}</strong></div>
                </div>
              </div>

              {/* Milestones & Field Inspection Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Milestone Escrow Tranches & Inspection Trail:
                </h3>

                <div className="space-y-4">
                  {(project.milestones || []).map((m, idx) => (
                    <div key={m.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{m.milestone_title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700 font-mono text-xs">
                            {formatRupee(m.allocated_amount)}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            m.status === 'DISBURSED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : m.status === 'INSPECTED_PASSED'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : m.status === 'SUBMITTED'
                              ? 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {m.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Contractor execution note */}
                      {m.contractor_submission_notes && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-slate-800">Contractor Declaration:</strong> {m.contractor_submission_notes}
                          {m.contractor_invoice_url && (
                            <span className="block mt-1 font-mono text-blue-600 text-[11px]">
                              Invoice Doc: {m.contractor_invoice_url}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Inspections performed on this milestone */}
                      {(m.inspections || []).length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                            Field Inspection Report:
                          </span>
                          {m.inspections.map(insp => (
                            <div key={insp.id} className="bg-purple-50/50 border border-purple-200 rounded-xl p-3 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-purple-950">
                                  Inspector: {insp.inspector_name} ({insp.inspector_id})
                                </span>
                                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                                  Verdict: {insp.verdict}
                                </span>
                              </div>
                              <p className="text-slate-700 italic">"{insp.notes}"</p>

                              {/* Inspection Photos */}
                              {insp.photos && insp.photos.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                  {insp.photos.map((ph, pIdx) => (
                                    <img
                                      key={pIdx}
                                      src={ph}
                                      alt="Inspection site"
                                      className="rounded-lg h-20 w-full object-cover border border-purple-200 shadow-sm"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* UTR Disbursements for this project */}
              {(project.disbursement_ledger || []).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    PFMS Treasury Transactions Log:
                  </h3>
                  <div className="space-y-1.5">
                    {project.disbursement_ledger.map(tx => (
                      <div key={tx.id} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-mono font-bold text-emerald-950">{tx.utr_no}</span>
                          <span className="text-slate-500 text-[11px] ml-2">to {tx.to_beneficiary}</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-800">
                          {formatRupee(tx.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
