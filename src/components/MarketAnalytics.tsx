import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  PieChart as PieChartIcon, 
  MapPin, 
  Sparkles, 
  Layers, 
  Briefcase,
  Lightbulb
} from 'lucide-react';
import { CompanyLead } from '../types';

interface MarketAnalyticsProps {
  leads: CompanyLead[];
  currentMunicipio: string;
  currentUf: string;
}

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  leads,
  currentMunicipio,
  currentUf
}) => {
  // Sector distribution
  const sectorCounts: Record<string, number> = {};
  leads.forEach(l => {
    sectorCounts[l.setor] = (sectorCounts[l.setor] || 0) + 1;
  });

  const topSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);

  // Bairro distribution
  const bairroCounts: Record<string, number> = {};
  leads.forEach(l => {
    if (l.bairro) {
      bairroCounts[l.bairro] = (bairroCounts[l.bairro] || 0) + 1;
    }
  });

  const topBairros = Object.entries(bairroCounts).sort((a, b) => b[1] - a[1]);

  // Capital Social sum
  const totalCapital = leads.reduce((acc, curr) => acc + curr.capitalSocial, 0);
  const avgCapital = leads.length > 0 ? Math.round(totalCapital / leads.length) : 0;

  const formattedAvgCapital = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(avgCapital);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Análise de Abertura de Empresas: {currentMunicipio} - {currentUf}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Métricas estratégicas para identificar nichos em crescimento e planejar abordagens comerciais.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl text-blue-300 font-medium">
            Média de Aberturas: <strong className="text-white">+340/mês</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total de Empresas Mapeadas</div>
          <div className="text-2xl font-black text-white">{leads.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% em relação ao mês anterior</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Capital Social Médio</div>
          <div className="text-2xl font-black text-emerald-400">{formattedAvgCapital}</div>
          <div className="text-[11px] text-slate-400">Por empresa recém-aberta na cidade</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Setor Líder em Crescimento</div>
          <div className="text-2xl font-black text-blue-400">{topSectors[0] ? topSectors[0][0] : 'Serviços'}</div>
          <div className="text-[11px] text-slate-400">
            {topSectors[0] ? `${topSectors[0][1]} novas unidades identificadas` : ''}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Bairro com Maior Concentração</div>
          <div className="text-2xl font-black text-amber-400">{topBairros[0] ? topBairros[0][0] : 'Centro'}</div>
          <div className="text-[11px] text-slate-400">Polo comercial principal em {currentMunicipio}</div>
        </div>

      </div>

      {/* Sector & Bairro Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Setores */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <PieChartIcon className="w-4 h-4 text-blue-400" />
            <span>Distribuição por Setor Econômico</span>
          </h3>

          <div className="space-y-3">
            {topSectors.map(([sector, count]) => {
              const percentage = Math.round((count / leads.length) * 100) || 0;

              return (
                <div key={sector} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{sector}</span>
                    <span className="text-blue-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bairros */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Pólos de Abertura por Bairro em {currentMunicipio}</span>
          </h3>

          <div className="space-y-3">
            {topBairros.map(([bairro, count]) => {
              const percentage = Math.round((count / leads.length) * 100) || 0;

              return (
                <div key={bairro} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{bairro}</span>
                    <span className="text-rose-400">{count} empresas</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Strategic Insight Box for Sales Prospecting */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-5 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
          <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>Dica de Inteligência B2B para {currentMunicipio} - {currentUf}:</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          Empresas em fase de <strong>"Em Registro na Junta (JUCERS/Juntas Comerciais)"</strong> e <strong>"Alvará Pendente"</strong> têm 4x mais chances de contratar fornecedores de contabilidade, advocacia, sistemas de gestão (ERP/PDV), licenciamento ambiental/PPCI, seguros e marketing digital antes do dia da inauguração! Ofereça ajuda para acelerar a liberação e garanta o contrato primeiro.
        </p>
      </div>

    </div>
  );
};
