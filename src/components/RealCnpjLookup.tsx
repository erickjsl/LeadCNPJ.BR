import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  DollarSign, 
  User,
  FileText
} from 'lucide-react';
import { CompanyLead } from '../types';
import { formatDateBR } from '../utils/formatters';

interface RealCnpjLookupProps {
  onAddCustomLead: (lead: CompanyLead) => void;
  currentMunicipio: string;
  currentUf: string;
}

export const RealCnpjLookup: React.FC<RealCnpjLookupProps> = ({
  onAddCustomLead,
  currentMunicipio,
  currentUf
}) => {
  const [cnpjInput, setCnpjInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [added, setAdded] = useState<boolean>(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cnpjInput.replace(/\D/g, '');
    if (clean.length !== 14) {
      setError('Por favor, informe um CNPJ válido com 14 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);
    setCompanyData(null);
    setAdded(false);

    try {
      const response = await fetch(`/api/cnpj-lookup/${clean}`);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Não foi possível localizar o CNPJ.');
      }

      const data = await response.json();
      setCompanyData(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar consulta na Receita Federal.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPipeline = () => {
    if (!companyData) return;

    const mainSocio = companyData.qsa && companyData.qsa.length > 0
      ? companyData.qsa[0].nome_socio
      : 'Sócio-Administrador';

    const newLead: CompanyLead = {
      id: `real-${companyData.cnpj}`,
      cnpj: companyData.cnpj || cnpjInput,
      razaoSocial: companyData.razao_social || 'Empresa Consultada',
      nomeFantasia: companyData.nome_fantasia || companyData.razao_social,
      uf: companyData.uf || currentUf,
      municipio: companyData.municipio || currentMunicipio,
      bairro: companyData.bairro || 'Centro',
      logradouro: `${companyData.descricao_tipo_de_logradouro || ''} ${companyData.logradouro || ''}`.trim(),
      numero: companyData.numero || 'S/N',
      cep: companyData.cep || '00000-000',
      dataAbertura: companyData.data_inicio_atividade || new Date().toISOString().split('T')[0],
      statusAbertura: 'CNPJ_EMITIDO',
      cnaeCodigo: companyData.cnae_fiscal ? String(companyData.cnae_fiscal) : '0000-0/00',
      cnaeDescricao: companyData.cnae_fiscal_descricao || 'Atividade Principal Cadastrada',
      setor: 'Serviços',
      capitalSocial: companyData.capital_social || 50000,
      porte: companyData.porte || 'ME',
      socioAdministrador: {
        nome: mainSocio,
        qualificacao: 'Sócio-Administrador',
        telefone: companyData.ddd_telefone_1 || companyData.ddd_telefone_2 || '54999887766',
        email: companyData.email || ''
      },
      scoreLead: 90,
      pipelineStatus: 'NOVO',
      notas: `Lead importado via consulta oficial da Receita Federal em ${new Date().toLocaleDateString('pt-BR')}.`,
      oportunidadesDetectadas: [
        'Atendimento e Assessoria Inicial',
        'Licenciamento e Alvará de Funcionamento',
        'Sistemas e Planejamento Fiscal'
      ]
    };

    onAddCustomLead(newLead);
    setAdded(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span>Consulta Direta de CNPJ na Receita Federal</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Digite o CNPJ de qualquer empresa recém-aberta no Brasil para importar os dados oficiais públicos e iniciar a prospecção imediata.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Digite o CNPJ ex: 58.492.102/0001-88 ou apenas números..."
            value={cnpjInput}
            onChange={(e) => setCnpjInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !cnpjInput.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{loading ? 'Buscando Dados...' : 'Consultar CNPJ'}</span>
        </button>
      </form>

      {/* Sample CNPJs quick click */}
      <div className="text-xs text-slate-400 flex items-center space-x-2">
        <span>Exemplos de CNPJ para testar:</span>
        <button
          onClick={() => setCnpjInput('58492102000188')}
          className="text-blue-400 hover:underline font-mono"
        >
          58.492.102/0001-88
        </button>
        <span>•</span>
        <button
          onClick={() => setCnpjInput('00000000000191')}
          className="text-blue-400 hover:underline font-mono"
        >
          00.000.000/0001-91
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display Card */}
      {companyData && (
        <div className="bg-slate-850 border border-slate-700 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {companyData.descricao_situacao_cadastral || 'ATIVA'}
                </span>
                <span className="text-xs text-slate-400">
                  Abertura em: {formatDateBR(companyData.data_inicio_atividade) || 'Recente'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {companyData.razao_social}
              </h3>
              {companyData.nome_fantasia && (
                <p className="text-xs text-slate-400">Nome Fantasia: {companyData.nome_fantasia}</p>
              )}
            </div>

            <button
              onClick={handleAddToPipeline}
              disabled={added}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow transition-all ${
                added
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
              }`}
            >
              {added ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{added ? 'Adicionado ao Funil!' : 'Importar para o Radar'}</span>
            </button>
            <button
              onClick={() => {
                import('../utils/pdfPrinter').then(m => m.printCompanyPDF(companyData, true));
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow transition-all bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
            >
              <FileText className="w-4 h-4" />
              <span>Salvar em PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block font-semibold">CNAE Principal:</span>
                <span className="text-slate-200 font-mono">{companyData.cnae_fiscal}</span> - {companyData.cnae_fiscal_descricao}
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Porte / Capital Social:</span>
                <span className="text-white font-bold">{companyData.porte || 'ME'}</span> (R$ {companyData.capital_social?.toLocaleString('pt-BR') || '0'})
              </div>
              
              <div>
                <span className="text-slate-400 block font-semibold">Natureza Jurídica:</span>
                <span className="text-slate-200">{companyData.natureza_juridica || 'Não informada'}</span>
              </div>
              
              <div>
                <span className="text-slate-400 block font-semibold">Contato:</span>
                <span className="text-slate-200 block">
                  Telefone: {[companyData.ddd_telefone_1, companyData.ddd_telefone_2].filter(Boolean).join(' / ') || 'Não informado'}
                </span>
                <span className="text-slate-200 block">E-mail: {companyData.email || 'Não informado'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block font-semibold">Endereço Oficial Receita Federal:</span>
                <span className="text-slate-200">
                  {companyData.descricao_tipo_de_logradouro} {companyData.logradouro}, {companyData.numero} - {companyData.bairro}, {companyData.municipio} - {companyData.uf} (CEP: {companyData.cep})
                </span>
              </div>

              {companyData.qsa && companyData.qsa.length > 0 && (
                <div>
                  <span className="text-slate-400 block font-semibold">Quadro de Sócios e Administradores (QSA):</span>
                  <div className="text-slate-200">
                    {companyData.qsa.map((s: any, idx: number) => (
                      <div key={idx} className="font-medium">
                        • {s.nome_socio} ({s.qualificacao_socio})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
