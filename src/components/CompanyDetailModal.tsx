import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  DollarSign, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Save, 
  Send, 
  CheckCircle, 
  Clock, 
  Layers,
  Search
} from 'lucide-react';
import { CompanyLead, CRMStatus } from '../types';
import { formatDateBR } from '../utils/formatters';

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyLead | null;
  onGeneratePitch: (company: CompanyLead) => void;
  onUpdateStatus: (companyId: string, status: CRMStatus, notes?: string) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
  onGeneratePitch,
  onUpdateStatus
}) => {
  if (!isOpen || !company) return null;

  const [notes, setNotes] = useState<string>(company.notas || '');
  const [pipelineStatus, setPipelineStatus] = useState<CRMStatus>(company.pipelineStatus);
  const [savedNotesMessage, setSavedNotesMessage] = useState<boolean>(false);

  const handleSaveNotes = () => {
    onUpdateStatus(company.id, pipelineStatus, notes);
    setSavedNotesMessage(true);
    setTimeout(() => setSavedNotesMessage(false), 2000);
  };

  const handleStatusChange = (newStatus: CRMStatus) => {
    setPipelineStatus(newStatus);
    onUpdateStatus(company.id, newStatus, notes);
  };

  const formattedCapital = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(company.capitalSocial);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${company.logradouro}, ${company.numero}, ${company.bairro}, ${company.municipio} - ${company.uf}`
  )}`;

  const linkedInSearchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
    `${company.socioAdministrador.nome} ${company.municipio}`
  )}`;

  const whatsappPhone = company.socioAdministrador.telefone
    ? company.socioAdministrador.telefone.replace(/\D/g, '')
    : '';

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `"${company.nomeFantasia || company.razaoSocial}" ${company.municipio} ${company.uf} telefone contato`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>{company.nomeFantasia || company.razaoSocial}</span>
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  CNPJ: {company.cnpj}
                </span>
                <span>•</span>
                <span>{company.municipio} - {company.uf}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* CRM Status Bar */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Etapa no Pipeline / CRM:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['NOVO', 'CONTATADO', 'REUNIAO', 'PROPOSTA', 'CLIENTE', 'IGNORADO'] as CRMStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      pipelineStatus === st
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  import('../utils/pdfPrinter').then(m => m.printCompanyPDF(company, false));
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow flex items-center space-x-1.5 transition-colors border border-slate-600"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar PDF</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onGeneratePitch(company);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gerar Pitch IA</span>
              </button>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Datos da Empresa */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>Dados de Registro</span>
              </h3>

              <div>
                <span className="text-slate-400 block">Razão Social:</span>
                <span className="font-semibold text-white">{company.razaoSocial}</span>
              </div>

              {company.nomeFantasia && (
                <div>
                  <span className="text-slate-400 block">Nome Fantasia:</span>
                  <span className="font-semibold text-white">{company.nomeFantasia}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block">Capital Social:</span>
                  <span className="font-semibold text-emerald-400">{formattedCapital}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Porte:</span>
                  <span className="font-semibold text-white">{company.porte}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <span className="text-slate-400 block">Atividade Principal (CNAE):</span>
                <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded inline-block my-0.5">
                  {company.cnaeCodigo}
                </span>
                <p className="text-slate-200 mt-0.5">{company.cnaeDescricao}</p>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <span className="text-slate-400 block">Data do Registro / Abertura:</span>
                <span className="font-semibold text-white">{formatDateBR(company.dataAbertura)}</span>
              </div>
            </div>

            {/* Box 2: Localização e Contato do Sócio */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <h3 className="font-bold text-sm text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Endereço e Contato</span>
              </h3>

              <div>
                <span className="text-slate-400 block">Endereço Cadastrado:</span>
                <span className="font-semibold text-white">
                  {company.logradouro}, {company.numero} - Bairro {company.bairro}
                </span>
                <div className="text-slate-400">
                  {company.municipio} - {company.uf} | CEP: {company.cep}
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-400 hover:underline mt-1 font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ver localização no Google Maps</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block">Sócio / Responsável:</span>
                <span className="font-bold text-white text-sm">{company.socioAdministrador.nome}</span>
                <span className="text-slate-400 block font-medium">
                  {company.socioAdministrador.qualificacao}
                </span>

                <div className="mt-2 space-y-1">
                  {company.socioAdministrador.telefone ? (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{company.socioAdministrador.telefone}</span>
                      </span>
                      {whatsappPhone && (
                        <a
                          href={`https://wa.me/55${whatsappPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-semibold hover:underline text-[11px]"
                        >
                          Abrir WhatsApp
                        </a>
                      )}
                    </div>
                  ) : (
                    <a
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-400 hover:underline pt-1 text-[11px] font-medium"
                    >
                      <Search className="w-3 h-3" />
                      <span>Buscar telefone no Google</span>
                    </a>
                  )}

                  {company.socioAdministrador.email && (
                    <div className="flex items-center space-x-1 text-slate-300">
                      <Mail className="w-3 h-3 text-blue-400" />
                      <span>{company.socioAdministrador.email}</span>
                    </div>
                  )}

                  <a
                    href={linkedInSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sky-400 hover:underline pt-1 text-[11px] font-medium"
                  >
                    <Search className="w-3 h-3" />
                    <span>Buscar perfil no LinkedIn</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Oportunidades Mapeadas */}
          {company.oportunidadesDetectadas && company.oportunidadesDetectadas.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Oportunidades de Serviços B2B Identificadas para este Perfil:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {company.oportunidadesDetectadas.map((opp, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{opp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Notes & History */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Notas do Lead / Histórico de Prospecção:
              </label>
              {savedNotesMessage && (
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Notas Salvas!</span>
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite aqui anotações do contato, data da reunião, respostas do cliente ou próximos passos..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Anotações</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center space-x-2">
            {whatsappPhone && (
              <a
                href={`https://wa.me/55${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Iniciar Conversa no WhatsApp</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
