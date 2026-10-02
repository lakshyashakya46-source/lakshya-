import React from 'react';
import { ShieldCheck, RefreshCw, Layers, CheckCircle2, Lock } from 'lucide-react';
import { resetDatabase } from '../services/api';

export default function GovHeader({ onReset }) {
  const [resetting, setResetting] = React.useState(false);

  const handleReset = async () => {
    if (confirm('Reset all demo data to initial government seed state?')) {
      setResetting(true);
      try {
        await resetDatabase();
        if (onReset) onReset();
      } catch (err) {
        alert('Reset failed: ' + err.message);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Indian National Tricolor Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5">
          {/* Left: Emblem & National GovTech Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-inner">
              <span className="text-2xl" role="img" aria-label="Emblem">🏛️</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-hindi">
                  भारत सरकार | GOVERNMENT OF INDIA
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded font-mono font-medium">
                  PFMS-DPI v2.4
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>निधि से निर्माण</span>
                <span className="text-slate-500 font-light">|</span>
                <span className="text-amber-400">FUND TO FIELD</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Transparent Public Fund Tracking, Anti-Siphoning Escrow & Real-Time Field Verification Platform
              </p>
            </div>
          </div>

          {/* Right: Security & Movement Badges + Reset Action */}
          <div className="flex items-center space-x-3">
            {/* School Theek Karo Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-600/40 px-2.5 py-1 rounded-md text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">School Theek Karo</span>
              <span className="text-slate-500 text-[10px]">Verified DPI</span>
            </div>

            {/* Smart-Lock Escrow Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-md text-xs text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspection-Locked Escrow</span>
            </div>

            {/* Reset Seed Button */}
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-700 transition"
              title="Reset sample data to initial state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
