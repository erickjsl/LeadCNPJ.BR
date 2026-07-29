import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  PhoneCall, 
  FileText,
  User,
  AlertCircle,
  Search,
  EyeOff
} from 'lucide-react';
import { CompanyLead, UserProfileService, PitchResult } from '../types';

interface AIPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyLead | null;
  userProfile: UserProfileService;
}

export const AIPitchModal: React.FC<AIPitchModalProps> = ({
  isOpen,
  onClose,
  company,
  userProfile
}) => {
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'call' | 'proposal'>('whatsapp');
  const [tone, setTone] = useState<'consultative' | 'direct' | 'friendly' | 'formal'>('consultative');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [useWebSpy, setUseWebSpy] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PitchResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [editablePitch, setEditablePitch] = useState<string>('');

  useEffect(() => {
    if (isOpen && company) {
      handleGenerate();
    } else {
      setResult(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen, company]);

  if (!isOpen || !company) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.razaoSocial,
          tradeName: company.nomeFantasia,
          cnae: `${company.cnaeCodigo} - ${company.cnaeDescricao}`,
          sector: company.setor,
          city: company.municipio,
          uf: company.uf,
          status: company.statusAbertura,
          capitalSocial: company.capitalSocial,
          porte: company.porte,
          socio: company.socioAdministrador.nome,
          userProfile: userProfile,
          channel: channel,
          tone: tone,
          customNotes: customNotes,
          useWebSpy: useWebSpy
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Falha ao comunicar com a IA');
      }

      const data: PitchResult = await response.json();
      setResult(data);
      setEditablePitch(data.pitch || '');
    } catch (err: any) {
      console.error('Erro ao gerar pitch:', err);
      setError(err.message || 'Ocorreu um erro ao gerar a mensagem com IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editablePitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappPhone = company.socioAdministrador.telefone
    ? company.socioAdministrador.telefone.replace(/\D/g, '')
    : '';

  const whatsappShareUrl = whatsappPhone
    ? `https://wa.me/55${whatsappPhone}?text=${encodeURIComponent(editablePitch)}`
    : `https://wa.me/?text=${encodeURIComponent(editablePitch)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Gerador de Abordagem Comercial com IA</span>
              </h2>
              <p className="text-xs text-slate-400">
                Criando abordagem sob medida para <span className="text-blue-400 font-semibold">{company.nomeFantasia || company.razaoSocial}</span> ({company.municipio} - {company.uf})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Options Toolbar: Channel & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            
            {/* Modo Espião Toggle (Span entire width on mobile, 1 col on desktop) */}
            <div className="sm:col-span-2 flex items-center justify-between bg-slate-900 border border-slate-700/50 p-3 rounded-lg hover:border-slate-600 transition-colors cursor-pointer" onClick={() => setUseWebSpy(!useWebSpy)}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${useWebSpy ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                  {useWebSpy ? <Search className="w-5 h-5 animate-pulse" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white flex items-center">
                    Modo Espião (Pesquisa Web)
                    {useWebSpy && <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-400 rounded">Ativado</span>}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pesquisa na internet sobre a empresa antes de gerar o texto.</p>
                </div>
              </div>
              
              {/* Custom Toggle Switch */}
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useWebSpy ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useWebSpy ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
            
            {/* Channel selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Canal de Abordagem:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    channel === 'email'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-mail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('call')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    channel === 'call'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Ligação / Script</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('proposal')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    channel === 'proposal'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Apresentação</span>
                </button>
              </div>
            </div>

            {/* Tone selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Tom de Voz:
              </label>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
              >
                <option value="consultative">💡 Consultivo (Foco em Ajuda & Solução)</option>
                <option value="direct">🎯 Direto e Objetivo (Foco em Agilidade)</option>
                <option value="friendly">🤝 Amigável e Parceiro (Foco em Conexão)</option>
                <option value="formal">👔 Formal & Executivo (Foco em Institucional)</option>
              </select>
            </div>

          </div>

          {/* User Service Profile Badge Notice */}
          <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl text-xs text-slate-300 border border-slate-700/60">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>
                Personalizando para o seu serviço: <strong className="text-white">{userProfile.serviceType}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                // User can update profile
              }}
              className="text-blue-400 hover:underline text-[11px]"
            >
              Ajustar perfil
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="text-sm font-semibold text-white">
                {useWebSpy ? `Pesquisando ${company.nomeFantasia || company.razaoSocial} na web...` : `Analisando CNAE, setor e localização em ${company.municipio}...`}
              </div>
              <p className="text-xs text-slate-400">A IA está formulando a mensagem de maior conversão...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Aviso de Geração:</strong>
                {error}
              </div>
            </div>
          )}

          {/* Generated Result Output */}
          {!loading && result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {result.subject && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Assunto / Título da Mensagem:
                  </label>
                  <input
                    type="text"
                    value={result.subject}
                    readOnly
                    className="w-full bg-slate-800 border border-slate-700 text-sm font-semibold text-blue-300 rounded-xl px-3.5 py-2"
                  />
                </div>
              )}

              {/* Editable Pitch Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Mensagem de Abordagem Gerada (Editável):
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Sócio: <strong className="text-white">{company.socioAdministrador.nome}</strong>
                  </span>
                </div>
                <textarea
                  value={editablePitch}
                  onChange={(e) => setEditablePitch(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>

              {/* Key Hooks & Benefits */}
              {result.openingHooks && result.openingHooks.length > 0 && (
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Opções de Frases de Abertura ("Hooks"):</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.openingHooks.map((hook, i) => (
                      <li key={i} className="hover:text-white cursor-pointer" onClick={() => setEditablePitch(hook + '\n\n' + editablePitch)}>
                        "{hook}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up tip */}
              {result.followUpTip && (
                <div className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3 rounded-xl">
                  💡 <strong>Dica de Fechamento:</strong> {result.followUpTip}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regerar Abordagem</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              disabled={!editablePitch}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Enviar via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
