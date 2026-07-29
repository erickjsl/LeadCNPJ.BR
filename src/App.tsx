import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredLeads, 
  saveStoredLeads, 
  updateLeadStatusInStorage, 
  getStoredProfile, 
  saveStoredProfile 
} from './data/mockDatabase';
import { CompanyLead, CRMStatus, FilterState, UserProfileService } from './types';

import { Navbar } from './components/Navbar';
import { CitySelectorModal } from './components/CitySelectorModal';
import { FilterBar } from './components/FilterBar';
import { CompanyCard } from './components/CompanyCard';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { AIPitchModal } from './components/AIPitchModal';
import { PipelineCRM } from './components/PipelineCRM';
import { RealCnpjLookup } from './components/RealCnpjLookup';
import { MarketAnalytics } from './components/MarketAnalytics';
import { UserProfileModal } from './components/UserProfileModal';
import { LoginScreen } from './components/LoginScreen';

import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Radar, 
  Kanban, 
  Search, 
  BarChart3, 
  SlidersHorizontal,
  PlusCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Active Location (Default: Caxias do Sul - RS)
  const [currentUf, setCurrentUf] = useState<string>('RS');
  const [currentMunicipio, setCurrentMunicipio] = useState<string>('Caxias do Sul');

  // Leads & Profile State
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileService>(INITIAL_PROFILE);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'radar' | 'pipeline' | 'lookup' | 'analytics'>('radar');

  // Modals
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedDetailCompany, setSelectedDetailCompany] = useState<CompanyLead | null>(null);
  const [selectedPitchCompany, setSelectedPitchCompany] = useState<CompanyLead | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    uf: 'RS',
    municipio: 'Caxias do Sul',
    searchQuery: '',
    statusAbertura: 'TODOS',
    setor: 'TODOS',
    porte: 'TODOS',
    pipelineStatus: 'TODOS',
    periodoDias: 30,
    minCapitalSocial: 0
  });

  // Initial Data Load
  useEffect(() => {
    const loadedProfile = getStoredProfile();
    setUserProfile(loadedProfile);
    refreshLeads('RS', 'Caxias do Sul');
  }, []);

  // Reload leads when city changes
  const refreshLeads = (uf: string, municipio: string) => {
    const data = getStoredLeads(uf, municipio);
    setLeads(data);
  };

  const handleSelectCity = (uf: string, municipio: string) => {
    setCurrentUf(uf);
    setCurrentMunicipio(municipio);
    setFilters(prev => ({ ...prev, uf, municipio }));
    refreshLeads(uf, municipio);
  };

  const handleSaveProfile = (newProfile: UserProfileService) => {
    setUserProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  const handleStatusChange = (companyId: string, newStatus: CRMStatus, notes?: string) => {
    updateLeadStatusInStorage(companyId, newStatus, notes);
    setLeads(prev => prev.map(l => {
      if (l.id === companyId) {
        return {
          ...l,
          pipelineStatus: newStatus,
          notas: notes !== undefined ? notes : l.notas
        };
      }
      return l;
    }));
  };

  const handleAddCustomLead = (newLead: CompanyLead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveStoredLeads(updated);
  };

  const handleResetFilters = () => {
    setFilters({
      uf: currentUf,
      municipio: currentMunicipio,
      searchQuery: '',
      statusAbertura: 'TODOS',
      setor: 'TODOS',
      porte: 'TODOS',
      pipelineStatus: 'TODOS',
      periodoDias: 30,
      minCapitalSocial: 0
    });
  };

  // Filtered Leads Calculation
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // Search query (Razão, Fantasia, CNPJ, Sócio, Bairro)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = l.razaoSocial.toLowerCase().includes(q) || (l.nomeFantasia && l.nomeFantasia.toLowerCase().includes(q));
        const matchCnpj = l.cnpj.includes(q);
        const matchSocio = l.socioAdministrador.nome.toLowerCase().includes(q);
        const matchBairro = l.bairro.toLowerCase().includes(q);
        if (!matchName && !matchCnpj && !matchSocio && !matchBairro) {
          return false;
        }
      }

      // Status
      if (filters.statusAbertura !== 'TODOS' && l.statusAbertura !== filters.statusAbertura) {
        return false;
      }

      // Setor
      if (filters.setor !== 'TODOS' && l.setor !== filters.setor) {
        return false;
      }

      // Porte
      if (filters.porte !== 'TODOS' && l.porte !== filters.porte) {
        return false;
      }

      // Pipeline
      if (filters.pipelineStatus !== 'TODOS' && l.pipelineStatus !== filters.pipelineStatus) {
        return false;
      }

      // PeriodoDias (Data de Abertura)
      if (filters.periodoDias < 365) { // Assuming 365 or a large number means 'all' if we ever add it, but here we just filter by the days.
        const today = new Date();
        const openingDate = new Date(l.dataAbertura);
        
        // Calculate difference in days
        const diffTime = Math.abs(today.getTime() - openingDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays > filters.periodoDias) {
          return false;
        }
      }

      return true;
    });
  }, [leads, filters]);

  const newLeadsCount = leads.filter(l => l.pipelineStatus === 'NOVO').length;

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentUf={currentUf}
        currentMunicipio={currentMunicipio}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
        totalLeadsCount={leads.length}
        newLeadsCount={newLeadsCount}
        onRefresh={() => refreshLeads(currentUf, currentMunicipio)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* City Highlight Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950/60 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{currentMunicipio} - {currentUf}</span>
              </span>
              {currentMunicipio === 'Caxias do Sul' && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Serra Gaúcha
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Radar de Novas Empresas em Abertura
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitore empresas em protocolo de abertura na Junta Comercial, novos CNPJs e alvarás em liberação. Prospecte antes dos concorrentes!
            </p>
          </div>

          <div className="flex items-center space-x-3 z-10 shrink-0">
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Trocar Cidade / UF</span>
            </button>
          </div>
        </div>

        {/* TAB 1: RADAR DE ABERTURAS */}
        {activeTab === 'radar' && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              totalResults={filteredLeads.length}
              onResetFilters={handleResetFilters}
              currentMunicipio={currentMunicipio}
            />

            {/* Leads Grid */}
            {filteredLeads.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Nenhuma empresa encontrada com estes filtros</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tente redefinir a busca ou altere o período de dias para expandir o histórico de novos CNPJs em {currentMunicipio}.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeads.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onOpenDetail={(c) => setSelectedDetailCompany(c)}
                    onGeneratePitch={(c) => setSelectedPitchCompany(c)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CRM & PIPELINE */}
        {activeTab === 'pipeline' && (
          <PipelineCRM
            leads={leads}
            onOpenDetail={(c) => setSelectedDetailCompany(c)}
            onGeneratePitch={(c) => setSelectedPitchCompany(c)}
            onStatusChange={handleStatusChange}
            currentMunicipio={currentMunicipio}
            currentUf={currentUf}
          />
        )}

        {/* TAB 3: MARKET METRICS */}
        {activeTab === 'analytics' && (
          <MarketAnalytics
            leads={leads}
            currentMunicipio={currentMunicipio}
            currentUf={currentUf}
          />
        )}

        {/* TAB 4: REAL RECEITA CNPJ LOOKUP */}
        {activeTab === 'lookup' && (
          <RealCnpjLookup
            onAddCustomLead={handleAddCustomLead}
            currentMunicipio={currentMunicipio}
            currentUf={currentUf}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>LeadCNPJ Brasil</strong> • Inteligência em Prospecção B2B de Novas Empresas
          </div>
          <div>
            Disponível em Caxias do Sul (RS) e nos 5.570 municípios do Brasil
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentUf={currentUf}
        currentMunicipio={currentMunicipio}
        onSelectCity={handleSelectCity}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <CompanyDetailModal
        isOpen={!!selectedDetailCompany}
        onClose={() => setSelectedDetailCompany(null)}
        company={selectedDetailCompany}
        onGeneratePitch={(c) => setSelectedPitchCompany(c)}
        onUpdateStatus={handleStatusChange}
      />

      <AIPitchModal
        isOpen={!!selectedPitchCompany}
        onClose={() => setSelectedPitchCompany(null)}
        company={selectedPitchCompany}
        userProfile={userProfile}
      />

    </div>
  );
}

const INITIAL_PROFILE: UserProfileService = {
  userName: 'Seu Nome / Atendimento',
  companyName: 'Minha Empresa de Serviços',
  serviceType: 'Contabilidade & Alvarás de Funcionamento',
  differentials: 'Atendimento prioritário em Caxias do Sul e região, abertura ágil de inscrições estaduais e emissão de alvará municipal sem burocracia.',
  phoneWhatsApp: '54999887766'
};
