import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Sparkles, 
  Send, 
  Eye, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { CompanyLead, CRMStatus } from '../types';

interface CompanyCardProps {
  company: CompanyLead;
  onOpenDetail: (company: CompanyLead) => void;
  onGeneratePitch: (company: CompanyLead) => void;
  onStatusChange: (companyId: string, status: CRMStatus) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onOpenDetail,
  onGeneratePitch,
  onStatusChange
}) => {
  
  // Format currency
  const formattedCapital = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(company.capitalSocial);

  // Status color styles
  const getStatusBadge = () => {
    switch (company.statusAbertura) {
      case 'EM_PROCESSO':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Em Registro na Junta</span>
          </span>
        );
      case 'ALVARA_PENDENTE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <FileText className="w-3.5 h-3.5" />
            <span>Alvará Pendente</span>
          </span>
        );
      case 'CNPJ_EMITIDO':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CNPJ Ativo Recente</span>
          </span>
        );
    }
  };

  const getPipelineStatusBadge = () => {
    switch (company.pipelineStatus) {
      case 'NOVO':
        return <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-medium">Novo Lead</span>;
      case 'CONTATADO':
        return <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-medium">Em Contato</span>;
      case 'REUNIAO':
        return <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded font-medium">Reunião Agendada</span>;
      case 'PROPOSTA':
        return <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded font-medium">Proposta Enviada</span>;
      case 'CLIENTE':
        return <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-medium">Cliente Fechado 🎉</span>;
      case 'IGNORADO':
      default:
        return <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded">Descartado</span>;
    }
  };

  const whatsappPhone = company.socioAdministrador.telefone ? company.socioAdministrador.telefone.replace(/\D/g, '') : '';
  const defaultWhatsAppText = encodeURIComponent(
    `Olá ${company.socioAdministrador.nome}! Vi que vocês estão iniciando as atividades da ${company.nomeFantasia || company.razaoSocial} em ${company.municipio}. Gostaria de apresentar uma oportunidade.`
  );

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative">
      
      <div>
        {/* Card Header: Score, Status & Pipeline */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge()}
            {getPipelineStatusBadge()}
          </div>

          {/* Opportunity Score */}
          <div 
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold"
            title="Score de Oportunidade B2B baseado no porte, capital e setor"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Score: {company.scoreLead}/100</span>
          </div>
        </div>

        {/* Company Titles */}
        <div className="mb-3">
          <h3 
            onClick={() => onOpenDetail(company)}
            className="font-bold text-base text-white group-hover:text-blue-400 transition-colors cursor-pointer leading-snug flex items-center gap-1.5"
          >
            <span>{company.nomeFantasia || company.razaoSocial}</span>
          </h3>
          {company.nomeFantasia && (
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Razão Social: {company.razaoSocial}
            </p>
          )}
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
            <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              CNPJ: {company.cnpj}
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Abertura: {company.dataAbertura}</span>
            </span>
          </div>
        </div>

        {/* CNAE / Sector & Address Info */}
        <div className="space-y-2 text-xs text-slate-300 bg-slate-850/60 p-3 rounded-xl border border-slate-800/80 mb-3">
          <div className="flex items-start space-x-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-white">{company.setor}</span> - {company.cnaeDescricao}
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-medium text-slate-200">
                {company.bairro}, {company.municipio} - {company.uf}
              </span>
            </div>
            <div className="text-slate-300 font-semibold">
              {company.porte} ({formattedCapital})
            </div>
          </div>
        </div>

        {/* Socio & Contact Details */}
        <div className="mb-4 text-xs space-y-1">
          <div className="text-slate-400 font-medium">
            Sócio/Resp: <span className="text-slate-200 font-semibold">{company.socioAdministrador.nome}</span> ({company.socioAdministrador.qualificacao})
          </div>
          {company.socioAdministrador.telefone && (
            <div className="text-slate-400 flex items-center space-x-2">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{company.socioAdministrador.telefone}</span>
            </div>
          )}
        </div>

        {/* Detected Needs / Opportunities */}
        {company.oportunidadesDetectadas && company.oportunidadesDetectadas.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Necessidades Detectadas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {company.oportunidadesDetectadas.map((opp, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700/60"
                >
                  • {opp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
        
        {/* AI Pitch Button */}
        <button
          onClick={() => onGeneratePitch(company)}
          className="w-full sm:w-auto flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Gerar Pitch IA</span>
        </button>

        {/* WhatsApp Direct Button */}
        {whatsappPhone && (
          <a
            href={`https://wa.me/55${whatsappPhone}?text=${defaultWhatsAppText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1 transition-colors"
            title="Abrir conversa direta no WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        )}

        {/* Details Modal Trigger */}
        <button
          onClick={() => onOpenDetail(company)}
          className="w-full sm:w-auto p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
          title="Ver perfil completo e histórico de contatos"
        >
          <Eye className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
