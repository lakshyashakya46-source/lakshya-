import React, { useEffect, useState } from 'react';
import GovHeader from './components/GovHeader';
import RoleSwitcher from './components/RoleSwitcher';
import SectorSelector from './components/SectorSelector';
import OfficerDashboard from './components/OfficerDashboard';
import BeneficiaryPortal from './components/BeneficiaryPortal';
import ContractorPortal from './components/ContractorPortal';
import InspectorTerminal from './components/InspectorTerminal';
import PublicPortal from './components/PublicPortal';
import ProjectDetailModal from './components/ProjectDetailModal';
import { 
  fetchAnalytics, fetchDepartments, fetchEntities, fetchProjects, 
  fetchContractors, fetchLedger, fetchGrievances 
} from './services/api';

export default function App() {
  const [activeRole, setActiveRole] = useState('OFFICER');
  const [activeSector, setActiveSector] = useState('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [entities, setEntities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [grievances, setGrievances] = useState([]);

  const loadAllData = async () => {
    try {
      const [
        anData,
        deptData,
        entData,
        projData,
        contData,
        ledData,
        grievData
      ] = await Promise.all([
        fetchAnalytics(),
        fetchDepartments(),
        fetchEntities(),
        fetchProjects(),
        fetchContractors(),
        fetchLedger(),
        fetchGrievances()
      ]);

      setAnalytics(anData);
      setDepartments(deptData);
      setEntities(entData);
      setProjects(projData);
      setContractors(contData);
      setLedger(ledData);
      setGrievances(grievData);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ============================================================
  // SECTOR FILTER
  // ============================================================

  const filteredProjects =
    activeSector === 'ALL'
      ? projects
      : projects.filter(
          project => project.dept_code === activeSector
        );

  const filteredEntities =
    activeSector === 'ALL'
      ? entities
      : entities.filter(entity => {
          const belongsToSector =
            entity.dept_code === activeSector;

          const hasProjectInSector = filteredProjects.some(
            project => project.entity_id === entity.id
          );

          return belongsToSector || hasProjectInSector;
        });

  const filteredLedger =
    activeSector === 'ALL'
      ? ledger
      : ledger.filter(entry => {
          const project = projects.find(
            project => project.id === entry.project_id
          );

          return project?.dept_code === activeSector;
        });

  const filteredGrievances =
    activeSector === 'ALL'
      ? grievances
      : grievances.filter(grievance => {
          const project = projects.find(
            project => project.id === grievance.project_id
          );

          return project?.dept_code === activeSector;
        });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Official GovTech Header */}
      <GovHeader onReset={loadAllData} />

      {/* 2. Persona Role Switcher */}
      <RoleSwitcher activeRole={activeRole} onSelectRole={setActiveRole} />

      {/* 3. Multi-Sector / Department Switcher */}
      <SectorSelector activeSector={activeSector} onSelectSector={setActiveSector} />

      {/* 4. Main Dynamic View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800">Connecting to National Fund & Field Ledger...</h3>
            <p className="text-xs text-slate-400 mt-1">Initializing multi-sector GovTech public registry</p>
          </div>
        ) : (
          <>
            {activeRole === 'OFFICER' && (
              <OfficerDashboard
                analytics={analytics}
                projects={filteredProjects}
                onRefresh={loadAllData}
                onOpenProject={(id) => setSelectedProjectId(id)}
              />
            )}

            {activeRole === 'BENEFICIARY' && (
              <BeneficiaryPortal
                entities={filteredEntities}
                projects={filteredProjects}
                onRefresh={loadAllData}
                onOpenProject={(id) => setSelectedProjectId(id)}
              />
            )}

            {activeRole === 'CONTRACTOR' && (
              <ContractorPortal
                projects={filteredProjects}
                contractors={contractors}
                onRefresh={loadAllData}
                onOpenProject={(id) => setSelectedProjectId(id)}
              />
            )}

            {activeRole === 'INSPECTOR' && (
              <InspectorTerminal
                projects={filteredProjects}
                entities={filteredEntities}
                onRefresh={loadAllData}
                onOpenProject={(id) => setSelectedProjectId(id)}
              />
            )}

            {activeRole === 'CITIZEN' && (
              <PublicPortal
                entities={filteredEntities}
                projects={filteredProjects}
                ledger={filteredLedger}
                grievances={filteredGrievances}
                onRefresh={loadAllData}
                onOpenProject={(id) => setSelectedProjectId(id)}
              />
            )}
          </>
        )}
      </main>

      {/* 5. Project Detail Audit Dossier Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* 6. Official GovTech Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏛️</span>
              <div>
                <div className="font-bold text-white text-sm">
                  निधि से निर्माण (FUND TO FIELD) • Digital Public Infrastructure
                </div>
                <div className="text-[11px] text-slate-400">
                  Government of India • Public Financial Management System & "School Theek Karo" Initiative
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">● 100% Milestone-Locked Escrow</span>
              <span>● Geo-Tagged Photo Verification</span>
              <span>● Open Jan Sunwai Ledger</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 pt-2">
            <div>
              Designed for transparency, anti-corruption, and accountability across Indian public infrastructure projects.
            </div>
            <div className="font-hindi text-slate-400">
              सत्यमेव जयते | पारदर्शी भारत, सशक्त भारत
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
