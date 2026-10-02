import React from 'react';
import { School, Truck, Rocket, Droplets, Activity, LayoutGrid } from 'lucide-react';

const SECTORS = [
  { code: 'ALL', label: 'All Sectors', label_hi: 'सभी क्षेत्र', icon: LayoutGrid, color: 'text-slate-600' },
  { code: 'EDU', label: 'School Education (School Theek Karo)', label_hi: 'स्कूली शिक्षा सुधार', icon: School, color: 'text-emerald-600' },
  { code: 'TRANS', label: 'Roads & Rural Connectivity (PMGSY)', label_hi: 'सड़क एवं परिवहन', icon: Truck, color: 'text-amber-600' },
  { code: 'STARTUP', label: 'Startup India Seed Grants', label_hi: 'स्टार्टअप व नवाचार अनुदान', icon: Rocket, color: 'text-indigo-600' },
  { code: 'WATER', label: 'Jal Jeevan Mission (Har Ghar Jal)', label_hi: 'जल जीवन मिशन', icon: Droplets, color: 'text-cyan-600' },
  { code: 'HEALTH', label: 'Healthcare & Ayushman Mandir', label_hi: 'प्राथमिक स्वास्थ्य केंद्र', icon: Activity, color: 'text-rose-600' }
];

export default function SectorSelector({ activeSector, onSelectSector }) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1 pr-2 whitespace-nowrap">
          Sector / विभाग:
        </span>
        {SECTORS.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSector === sec.code;
          return (
            <button
              key={sec.code}
              onClick={() => onSelectSector(sec.code)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : sec.color}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
