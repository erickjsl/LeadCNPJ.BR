import React from 'react';
import { 
  Building2, 
  MapPin, 
  Radar, 
  Kanban, 
  Search, 
  Sparkles, 
  BarChart3, 
  UserCheck, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { UserProfileService } from '../types';

interface NavbarProps {
  currentUf: string;
  currentMunicipio: string;
  activeTab: 'radar' | 'pipeline' | 'lookup' | 'analytics';
  setActiveTab: (tab: 'radar' | 'pipeline' | 'lookup' | 'analytics') => void;
  onOpenCityModal: () => void;
  onOpenProfileModal: () => void;
  userProfile: UserProfileService;
  totalLeadsCount: number;
  newLeadsCount: number;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUf,
  currentMunicipio,
  activeTab,
  setActiveTab,
  onOpenCityModal,
  onOpenProfileModal,
  userProfile,
  totalLeadsCount,
  newLeadsCount,
  onRefresh
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  LeadCNPJ<span className="text-blue-400 font-extrabold">.BR</span>
                </span>
                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                  Prospecção B2B
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Radar de Empresas em Abertura & Acompanhamento de Leads
              </p>
            </div>
          </div>

          {/* Active City Selector Button */}
          <button
            onClick={onOpenCityModal}
            className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3.5 py-1.5 rounded-xl transition-all duration-150 group shadow-inner text-left"
            title="Alterar cidade de busca"
          >
            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium leading-none flex items-center space-x-1">
                <span>Cidade Ativa:</span>
                {currentMunicipio === 'Caxias do Sul' && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                    Destacada
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-white flex items-center space-x-1 mt-0.5">
                <span>{currentMunicipio} - {currentUf}</span>
                <SlidersHorizontal className="w-3 h-3 text-slate-400 ml-1 group-hover:text-blue-400" />
              </div>
            </div>
          </button>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Atualizar radar de novas empresas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg text-slate-200 transition-colors"
              title="Configurar seu serviço para personalizar a abordagem da IA"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">{userProfile.companyName || 'Meu Perfil'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'radar'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Radar de Aberturas</span>
            {newLeadsCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                {newLeadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>CRM & Pipeline</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full ml-1 font-semibold">
              {totalLeadsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Mercado & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lookup'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Consulta CNPJ Receita</span>
          </button>
        </div>
      </div>
    </header>
  );
};
