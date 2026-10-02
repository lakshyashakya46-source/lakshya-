import React, { useState } from 'react';
import {
Landmark, ShieldCheck, AlertTriangle, CheckCircle2, Lock, ArrowUpRight,
FileText, Clock, ExternalLink, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatRupee, formatFullRupee, disburseMilestone } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function OfficerDashboard({
analytics,
projects,
onRefresh,
onOpenProject
}) {
const [disbursingId, setDisbursingId] = useState(null);
const [filterStatus, setFilterStatus] = useState('ALL');

const kpis = analytics?.kpis || {};
const statusCounts = analytics?.status_counts || {};

// Find milestones that have passed inspection and are ready for release
const readyForPayoutMilestones = [];
projects.forEach(p => {
(p.milestones || []).forEach(m => {
if (m.status === 'INSPECTED_PASSED') {
readyForPayoutMilestones.push({
...m,
project: p
});
}
});
});

const handleDisburse = async (milestoneId) => {
if (!confirm('Authorize public escrow release for this inspected milestone? Funds will be credited directly to the vendor account.')) {
return;
}
setDisbursingId(milestoneId);
try {
await disburseMilestone(milestoneId, {
officer_name: 'Shri Arvind Kaushik, IAS (Nodal Sanctioning Officer)'
});
confetti({
particleCount: 100,
spread: 70,
origin: { y: 0.6 }
});
if (onRefresh) onRefresh();
} catch (err) {
alert('Error: ' + err.message);
} finally {
setDisbursingId(null);
}
};

const chartData = (analytics?.department_breakdown || []).map(d => ({
name: d.code,
fullName: d.name,
Sanctioned: Math.round(d.sanctioned / 100000), // in Lakhs
Disbursed: Math.round(d.disbursed / 100000)
}));

const pieColors = ['#059669', '#d97706', '#4f46e5', '#0891b2', '#e11d48'];

const filteredProjects = projects.filter(p => {
if (filterStatus === 'ALL') return true;
return p.status === filterStatus;
});

return (
<div className="space-y-6">
{/* Officer Header Card */}
<div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
<div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold px-2 py-0.5 rounded">
PFMS Nodal Officer Terminal
</span>
<span className="text-slate-400 text-xs font-hindi">
सार्वजनिक वित्तीय प्रबंधन प्रणाली
</span>
</div>
<h2 className="text-2xl font-bold text-white flex items-center gap-2">
<Landmark className="w-6 h-6 text-amber-400" />
National Public Fund Tracking & Escrow Command Center
</h2>
<p className="text-sm text-slate-300 mt-1 max-w-3xl">
Real-time multi-sector transparency dashboard. Funds remain locked in RBI-linked Escrow until Field Quality Inspectors submit verified geo-tagged photo audits.
</p>
</div>

<div className="flex items-center gap-2">  
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-right">  
          <div className="text-[11px] text-slate-400 font-medium">Anti-Siphoning Protocol</div>  
          <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">  
            <ShieldCheck className="w-4 h-4" /> 100% Inspection Enforced  
          </div>  
        </div>  
      </div>  
    </div>  

    {/* Top 4 KPI Metrics */}  
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">  
      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/60">  
        <span className="text-xs text-slate-400 font-medium">Total Sanctioned Budget</span>  
        <div className="text-2xl font-bold text-white mt-1">  
          {formatRupee(kpis.total_sanctioned)}  
        </div>  
        <span className="text-[11px] text-blue-400 font-mono mt-0.5 block">Across all sectors</span>  
      </div>  

      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/60">  
        <span className="text-xs text-slate-400 font-medium">Released to Contractors</span>  
        <div className="text-2xl font-bold text-emerald-400 mt-1">  
          {formatRupee(kpis.total_disbursed)}  
        </div>  
        <span className="text-[11px] text-emerald-300/80 font-mono mt-0.5 block">100% Audited Payouts</span>  
      </div>  

      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/60">  
        <span className="text-xs text-slate-400 font-medium">Locked in Escrow</span>  
        <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">  
          <Lock className="w-5 h-5 text-amber-400" />  
          {formatRupee(kpis.escrow_locked)}  
        </div>  
        <span className="text-[11px] text-amber-300/80 font-mono mt-0.5 block">Awaiting Field Inspection</span>  
      </div>  

      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/60">  
        <span className="text-xs text-slate-400 font-medium">Leakages Blocked</span>  
        <div className="text-2xl font-bold text-rose-400 mt-1 flex items-center gap-1.5">  
          <ShieldCheck className="w-5 h-5 text-rose-400" />  
          {formatRupee(kpis.leakages_blocked)}  
        </div>  
        <span className="text-[11px] text-rose-300/80 font-mono mt-0.5 block">Flagged / Substandard Work</span>  
      </div>  
    </div>  
  </div>  

  {/* Escrow Release Approval Section */}  
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">  
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">  
      <div>  
        <div className="flex items-center gap-2">  
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />  
          <h3 className="text-lg font-bold text-slate-900">  
            Escrow Disbursement Authorizations ({readyForPayoutMilestones.length} Pending)  
          </h3>  
        </div>  
        <p className="text-xs text-slate-500 mt-0.5">  
          These milestones have passed on-site quality inspection and geo-tag validation. Authorized nodal officers can release the tranches directly.  
        </p>  
      </div>  
      <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">  
        Quality Cleared by Independent Inspector  
      </span>  
    </div>  

    {readyForPayoutMilestones.length === 0 ? (  
      <div className="py-8 text-center text-slate-500 text-sm">  
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />  
        No pending milestone payouts awaiting authorization. All inspected works have been settled!  
      </div>  
    ) : (  
      <div className="divide-y divide-slate-100 mt-2">  
        {readyForPayoutMilestones.map(item => (  
          <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">  
            <div className="space-y-1">  
              <div className="flex items-center gap-2">  
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">  
                  {item.project.dept_code}  
                </span>  
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">  
                  {item.milestone_title}  
                </h4>  
              </div>  
              <p className="text-xs text-slate-600">  
                <span className="font-semibold text-slate-800">{item.project.title}</span> — {item.project.entity?.name}  
              </p>  
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">  
                <span>Tranche Amount: <strong className="text-emerald-700">{formatRupee(item.allocated_amount)}</strong></span>  
                <span>•</span>  
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">  
                  <CheckCircle2 className="w-3.5 h-3.5" /> Field Inspection Verified  
                </span>  
                <span>•</span>  
                <span className="font-mono text-[11px] text-slate-400">Escrow: {item.project.escrow_account_no}</span>  
              </div>  
            </div>  

            <div className="flex items-center gap-2">  
              <button  
                onClick={() => onOpenProject(item.project.id)}  
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"  
              >  
                View Audit Dossier  
              </button>  
              <button  
                onClick={() => handleDisburse(item.id)}  
                disabled={disbursingId === item.id}  
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50"  
              >  
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />  
                <span>{disbursingId === item.id ? 'Authorizing PFMS...' : 'Authorize & Disburse Fund'}</span>  
              </button>  
            </div>  
          </div>  
        ))}  
      </div>  
    )}  
  </div>  

  {/* Sector Allocation & Performance Charts */}  
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">  
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">  
      <div className="flex items-center justify-between mb-4">  
        <div>  
          <h3 className="font-bold text-slate-900">Sectoral Fund Utilization (in ₹ Lakhs)</h3>  
          <p className="text-xs text-slate-500">Sanctioned vs Disbursed per Department</p>  
        </div>  
        <span className="text-xs text-slate-400 font-mono">Real-time DB</span>  
      </div>  

      <div className="h-64 w-full">  
        <ResponsiveContainer width="100%" height="100%">  
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>  
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />  
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />  
            <Tooltip  
              formatter={(value) => [`₹${value} Lakhs`, '']}  
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}  
            />  
            <Bar dataKey="Sanctioned" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Sanctioned" />  
            <Bar dataKey="Disbursed" fill="#059669" radius={[4, 4, 0, 0]} name="Disbursed" />  
          </BarChart>  
        </ResponsiveContainer>  
      </div>  
    </div>  

    {/* Project Status Summary Card */}  
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">  
      <div>  
        <h3 className="font-bold text-slate-900">Project Status Radar</h3>  
        <p className="text-xs text-slate-500 mb-4">Anti-Leakage Execution Health</p>  

        <div className="space-y-3">  
          <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">  
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">  
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed & Verified  
            </span>  
            <span className="font-bold text-emerald-900 font-mono">{statusCounts.COMPLETED || 0}</span>  
          </div>  

          <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-purple-50 border border-purple-100">  
            <span className="font-semibold text-purple-800 flex items-center gap-1.5">  
              <Clock className="w-3.5 h-3.5 text-purple-600" /> Under Field Inspection  
            </span>  
            <span className="font-bold text-purple-900 font-mono">{statusCounts.UNDER_INSPECTION || 0}</span>  
          </div>  

          <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-blue-50 border border-blue-100">  
            <span className="font-semibold text-blue-800 flex items-center gap-1.5">  
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Active Execution  
            </span>  
            <span className="font-bold text-blue-900 font-mono">{statusCounts.IN_PROGRESS || 0}</span>  
          </div>  

          <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-50 border border-amber-100">  
            <span className="font-semibold text-amber-800 flex items-center gap-1.5">  
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Newly Sanctioned  
            </span>  
            <span className="font-bold text-amber-900 font-mono">{statusCounts.SANCTIONED || 0}</span>  
          </div>  
        </div>  
      </div>  

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">  
        <span>Inspector Pass Rate: <strong>{kpis.inspection_pass_rate}%</strong></span>  
        <span className="text-emerald-600 font-semibold">Zero Unaudited Payouts</span>  
      </div>  
    </div>  
  </div>  

  {/* Full Projects Table */}  
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">  
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">  
      <div>  
        <h3 className="font-bold text-slate-900 text-base">Sanctioned Public Projects Directory</h3>  
        <p className="text-xs text-slate-500">Track budget vs real-time disbursement progress</p>  
      </div>  

      <div className="flex items-center gap-2">  
        <span className="text-xs text-slate-400">Filter Status:</span>  
        <select  
          value={filterStatus}  
          onChange={(e) => setFilterStatus(e.target.value)}  
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"  
        >  
          <option value="ALL">All Statuses</option>  
          <option value="UNDER_INSPECTION">Under Inspection</option>  
          <option value="IN_PROGRESS">In Progress</option>  
          <option value="COMPLETED">Completed</option>  
          <option value="SANCTIONED">Sanctioned</option>  
        </select>  
      </div>  
    </div>  

    <div className="overflow-x-auto mt-2">  
      <table className="w-full text-left text-xs">  
        <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/80 border-b border-slate-100">  
          <tr>  
            <th className="py-3 px-4">Scheme & Project</th>  
            <th className="py-3 px-4">Target Entity / School</th>  
            <th className="py-3 px-4">Budget Sanctioned</th>  
            <th className="py-3 px-4">Disbursed (Audited)</th>  
            <th className="py-3 px-4">Status</th>  
            <th className="py-3 px-4 text-right">Action</th>  
          </tr>  
        </thead>  
        <tbody className="divide-y divide-slate-100">  
          {filteredProjects.map(p => {  
            const pct = Math.round(((p.disbursed_amount || 0) / p.total_budget) * 100);  
            return (  
              <tr key={p.id} className="hover:bg-slate-50/60 transition">  
                <td className="py-3.5 px-4">  
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">{p.title}</div>  
                  <div className="text-[11px] text-slate-500">{p.scheme_name}</div>  
                </td>  
                <td className="py-3.5 px-4">  
                  <div className="font-semibold text-slate-800">{p.entity?.name || 'Public Asset'}</div>  
                  <div className="text-[11px] text-slate-400">{p.entity?.state} • {p.entity?.district}</div>  
                </td>  
                <td className="py-3.5 px-4 font-semibold text-slate-900">  
                  {formatRupee(p.total_budget)}  
                </td>  
                <td className="py-3.5 px-4">  
                  <div className="font-semibold text-emerald-700">{formatRupee(p.disbursed_amount)}</div>  
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">  
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />  
                  </div>  
                </td>  
                <td className="py-3.5 px-4">  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${  
                    p.status === 'COMPLETED'  
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'  
                      : p.status === 'UNDER_INSPECTION'  
                      ? 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse'  
                      : p.status === 'IN_PROGRESS'  
                      ? 'bg-blue-50 text-blue-800 border-blue-200'  
                      : 'bg-amber-50 text-amber-800 border-amber-200'  
                  }`}>  
                    {p.status.replace('_', ' ')}  
                  </span>  
                </td>  
                <td className="py-3.5 px-4 text-right">  
                  <button  
                    onClick={() => onOpenProject(p.id)}  
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-end gap-1 ml-auto"  
                  >  
                    Inspect Dossier <ChevronRight className="w-3.5 h-3.5" />  
                  </button>  
                </td>  
              </tr>  
            );  
          })}  
        </tbody>  
      </table>  
    </div>  
  </div>  
</div>

);
}