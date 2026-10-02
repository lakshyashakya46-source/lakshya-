import React from 'react';
import { Landmark, GraduationCap, HardHat, Camera, Users } from 'lucide-react';

export const ROLES = [
  {
    id: 'OFFICER',
    title: 'Government Officer',
    title_hi: 'नोडल अधिकारी',
    subtitle: 'PFMS Sanction & Escrow Payouts',
    icon: Landmark,
    badgeColor: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
    activeColor: 'bg-blue-600 text-white shadow-blue-500/20'
  },
  {
    id: 'BENEFICIARY',
    title: 'School Principal / SMC',
    title_hi: 'विद्यालय प्रधान / लाभार्थी',
    subtitle: 'Needs Assessment & Sign-off',
    icon: GraduationCap,
    badgeColor: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50',
    activeColor: 'bg-emerald-600 text-white shadow-emerald-500/20'
  },
  {
    id: 'CONTRACTOR',
    title: 'Civil Contractor / Grantee',
    title_hi: 'ठेकेदार / वेंडर',
    subtitle: 'Milestone Execution & Invoices',
    icon: HardHat,
    badgeColor: 'bg-amber-900/30 text-amber-300 border-amber-700/50',
    activeColor: 'bg-amber-600 text-white shadow-amber-500/20'
  },
  {
    id: 'INSPECTOR',
    title: 'Field Quality Inspector',
    title_hi: 'फील्ड क्वालिटी इंस्पेक्टर',
    subtitle: 'GPS Geo-Audit & Quality Clearance',
    icon: Camera,
    badgeColor: 'bg-purple-900/30 text-purple-300 border-purple-700/50',
    activeColor: 'bg-purple-600 text-white shadow-purple-500/20'
  },
  {
    id: 'CITIZEN',
    title: 'Parents & Public (Civic Radar)',
    title_hi: 'नागरिक व अभिभावक मंच',
    subtitle: 'Before/After & Grievance Portal',
    icon: Users,
    badgeColor: 'bg-rose-900/30 text-rose-300 border-rose-700/50',
    activeColor: 'bg-rose-600 text-white shadow-rose-500/20'
  }
];

export default function RoleSwitcher({ activeRole, onSelectRole }) {
  return (
    <div className="bg-slate-850 bg-slate-900/90 border-b border-slate-800 backdrop-blur px-4 py-3 sticky top-[69px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Switch Active Persona:
          </span>
        </div>

        {/* Persona Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 w-full md:w-auto">
          {ROLES.map(role => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left border ${
                  isActive
                    ? `${role.activeColor} border-transparent shadow-md scale-[1.02]`
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="truncate">
                  <div className="font-semibold leading-tight truncate">{role.title}</div>
                  <div className="text-[10px] opacity-75 font-hindi truncate hidden sm:block">
                    {role.title_hi}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
