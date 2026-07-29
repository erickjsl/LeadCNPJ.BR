import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Send, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { CompanyLead, CRMStatus } from '../types';

interface PipelineCRMProps {
  leads: CompanyLead[];
  onOpenDetail: (company: CompanyLead) => void;
  onGeneratePitch: (company: CompanyLead) => void;
  onStatusChange: (companyId: string, status: CRMStatus) => void;
  currentMunicipio: string;
  currentUf: string;
}

const STAGES: { id: CRMStatus; title: string; color: string; bgColor: string; border: string }[] = [
  { id: 'NOVO', title: '🆕 Novas Identificadas', color: 'text-blue-400', bgColor: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'CONTATADO', title: '💬 Em Contato', color: 'text-amber-400', bgColor: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'REUNIAO', title: '📅 Reunião Agendada', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'PROPOSTA', title: '📑 Proposta Enviada', color: 'text-purple-400', bgColor: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'CLIENTE', title: '🎉 Cliente Fechado', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
];

export const PipelineCRM: React.FC<PipelineCRMProps> = ({
  leads,
  onOpenDetail,
  onGeneratePitch,
  onStatusChange,
  currentMunicipio,
  currentUf
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Export leads to CSV
  const handleExportCSV = () => {
    const headers = ['CNPJ', 'Razao Social', 'Nome Fantasia', 'Cidade', 'UF', 'Bairro', 'Capital Social', 'Socio', 'Telefone', 'Email', 'Status CRM', 'Score'];
    const rows = leads.map(l => [
      `"${l.cnpj}"`,
      `"${l.razaoSocial.replace(/"/g, '""')}"`,
      `"${(l.nomeFantasia || '').replace(/"/g, '""')}"`,
      `"${l.municipio}"`,
      `"${l.uf}"`,
      `"${l.bairro}"`,
      l.capitalSocial,
      `"${l.socioAdministrador.nome}"`,
      `"${l.socioAdministrador.telefone || ''}"`,
      `"${l.socioAdministrador.email || ''}"`,
      l.pipelineStatus,
      l.scoreLead
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_novas_empresas_${currentMunicipio.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Funil de Prospecção B2B</span>
            <span className="text-xs bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full border border-slate-700">
              {currentMunicipio} - {currentUf}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe o andamento das abordagens comerciais a novas empresas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View toggle */}
          <div className="bg-slate-800 p-1 rounded-xl flex space-x-1 border border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabela
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
            title="Exportar relatórios de leads para Excel / CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.pipelineStatus === stage.id);

            return (
              <div
                key={stage.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`p-3 rounded-xl border ${stage.bgColor} ${stage.border} mb-3 flex items-center justify-between`}>
                  <h3 className={`font-bold text-xs ${stage.color} uppercase tracking-wider`}>
                    {stage.title}
                  </h3>
                  <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Nenhum lead nesta etapa
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-xs shadow-sm space-y-2 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-white text-xs line-clamp-1 group-hover:text-blue-400 transition-colors">
                            {lead.nomeFantasia || lead.razaoSocial}
                          </span>
                          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">
                            {lead.scoreLead}pt
                          </span>
                        </div>

                        <div className="text-slate-400 text-[11px] flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{lead.bairro}, {lead.municipio}</span>
                        </div>

                        <div className="text-slate-300 font-medium text-[11px]">
                          Resp: {lead.socioAdministrador.nome}
                        </div>

                        {/* Quick Action Controls inside Card */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                          <button
                            onClick={() => onGeneratePitch(lead)}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[10px] font-bold py-1 px-2 rounded flex items-center space-x-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Pitch IA</span>
                          </button>

                          <button
                            onClick={() => onOpenDetail(lead)}
                            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
                            title="Ver detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Stage Advance */}
                          <select
                            value={lead.pipelineStatus}
                            onChange={(e) => onStatusChange(lead.id, e.target.value as CRMStatus)}
                            className="bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1 py-0.5 focus:outline-none"
                          >
                            <option value="NOVO">Novo</option>
                            <option value="CONTATADO">Contato</option>
                            <option value="REUNIAO">Reunião</option>
                            <option value="PROPOSTA">Proposta</option>
                            <option value="CLIENTE">Cliente</option>
                            <option value="IGNORADO">Ignorar</option>
                          </select>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Empresa / CNPJ</th>
                  <th className="p-3.5">Cidade / Bairro</th>
                  <th className="p-3.5">Ramo / CNAE</th>
                  <th className="p-3.5">Sócio / Contato</th>
                  <th className="p-3.5">Status CRM</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{lead.nomeFantasia || lead.razaoSocial}</div>
                      <div className="text-[11px] text-slate-400 font-mono">CNPJ: {lead.cnpj}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{lead.municipio} - {lead.uf}</div>
                      <div className="text-slate-400">{lead.bairro}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-blue-400">{lead.setor}</div>
                      <div className="text-slate-400 truncate max-w-xs">{lead.cnaeDescricao}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-white">{lead.socioAdministrador.nome}</div>
                      <div className="text-emerald-400 font-mono">{lead.socioAdministrador.telefone || 'Sem tel'}</div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={lead.pipelineStatus}
                        onChange={(e) => onStatusChange(lead.id, e.target.value as CRMStatus)}
                        className="bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="NOVO">🆕 Novo Lead</option>
                        <option value="CONTATADO">💬 Em Contato</option>
                        <option value="REUNIAO">📅 Reunião Agendada</option>
                        <option value="PROPOSTA">📑 Proposta Enviada</option>
                        <option value="CLIENTE">🎉 Cliente Fechado</option>
                        <option value="IGNORADO">❌ Ignorado</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onGeneratePitch(lead)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        Pitch IA
                      </button>
                      <button
                        onClick={() => onOpenDetail(lead)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
