import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, Calendar, Building, DollarSign } from 'lucide-react';
import { FilterState, ProcessStatus } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
  onResetFilters: () => void;
  currentMunicipio: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalResults,
  onResetFilters,
  currentMunicipio
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={`Buscar por Razão Social, Fantasia, CNPJ, Bairro (Ex: Sanvitto, Lurdes) ou Sócio...`}
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-700 px-1.5 py-0.5 rounded"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filters.periodoDias}
            onChange={(e) => setFilters(prev => ({ ...prev, periodoDias: Number(e.target.value) }))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value={1}>Últimas 24 horas</option>
            <option value={7}>Últimos 7 dias</option>
            <option value={15}>Últimos 15 dias</option>
            <option value={30}>Último mês (30d)</option>
            <option value={90}>Últimos 90 dias</option>
          </select>

          <button
            onClick={onResetFilters}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Resetar todos os filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-800/80">
        
        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Status de Abertura:
          </label>
          <select
            value={filters.statusAbertura}
            onChange={(e) => setFilters(prev => ({ ...prev, statusAbertura: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="EM_PROCESSO">⏳ Em Registro (Junta/REGIN)</option>
            <option value="CNPJ_EMITIDO">✅ CNPJ Emitido Recente</option>
            <option value="ALVARA_PENDENTE">📑 Alvará Pendente</option>
          </select>
        </div>

        {/* Setor / CNAE */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Setor / Ramo:
          </label>
          <select
            value={filters.setor}
            onChange={(e) => setFilters(prev => ({ ...prev, setor: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Setores</option>
            <option value="Serviços">Serviços</option>
            <option value="Indústria">Indústria</option>
            <option value="Comércio">Comércio</option>
            <option value="Alimentação">Alimentação / Gastronomia</option>
            <option value="Tecnologia">Tecnologia & TI</option>
            <option value="Saúde">Saúde & Bem-Estar</option>
            <option value="Construção">Construção & Engenharia</option>
          </select>
        </div>

        {/* Porte / Capital */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Porte da Empresa:
          </label>
          <select
            value={filters.porte}
            onChange={(e) => setFilters(prev => ({ ...prev, porte: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Portes</option>
            <option value="MEI">MEI (Microempreendedor)</option>
            <option value="ME">ME (Microempresa)</option>
            <option value="EPP">EPP (Pequeno Porte)</option>
            <option value="Demais">Médio / Grande Porte</option>
          </select>
        </div>

        {/* Pipeline / CRM */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Status da Prospecção:
          </label>
          <select
            value={filters.pipelineStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, pipelineStatus: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos do Pipeline</option>
            <option value="NOVO">🆕 Não Contatado (Novo)</option>
            <option value="CONTATADO">💬 Em Contato</option>
            <option value="REUNIAO">📅 Reunião Agendada</option>
            <option value="PROPOSTA">📑 Proposta Enviada</option>
            <option value="CLIENTE">🎉 Fechado (Cliente)</option>
          </select>
        </div>

      </div>

      {/* Summary Counter Tag */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          Exibindo <span className="font-bold text-white">{totalResults}</span> empresas identificadas em <span className="text-blue-400 font-semibold">{currentMunicipio}</span>
        </div>
        {(filters.statusAbertura !== 'TODOS' || filters.setor !== 'TODOS' || filters.porte !== 'TODOS' || filters.searchQuery) && (
          <span className="text-blue-400 font-medium">Filtros ativos</span>
        )}
      </div>

    </div>
  );
};
