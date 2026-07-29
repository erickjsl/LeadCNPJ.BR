import React, { useState } from 'react';
import { X, UserCheck, Save, Sparkles, Check } from 'lucide-react';
import { UserProfileService } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileService;
  onSaveProfile: (profile: UserProfileService) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UserProfileService>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const SERVICE_PRESETS = [
    {
      title: '💼 Contabilidade & Alvarás',
      serviceType: 'Contabilidade Especializada & Abertura de Alvarás',
      differentials: 'Abertura rápida de inscrições estaduais, planejamento tributário Simples/Lucro Presumido e obtenção de alvarás municipais sem burocracia.'
    },
    {
      title: '💻 TI, Websites & Marketing Digital',
      serviceType: 'Criação de Websites, Redes Sociais e Sistemas de TI',
      differentials: 'Desenvolvimento de site profissional, presença no Google Meu Negócio, e-mail corporativo e infraestrutura de rede para o novo escritório.'
    },
    {
      title: '📑 Advocacia & Assessoria Jurídica',
      serviceType: 'Direito Empresarial, Contratos e Marcas',
      differentials: 'Elaboração do contrato social, proteção de marca no INPI e revisão de contratos de aluguel comercial e fornecedores.'
    },
    {
      title: '🧯 Segurança do Trabalho & PPCI (Bombeiros)',
      serviceType: 'Engenharia de Segurança, PPCI e Licenciamento Ambiental',
      differentials: 'Projetos de prevenção contra incêndio, laudos técnicos para liberação do habite-se e conformidade com eSocial.'
    },
    {
      title: '🏢 Imóveis & Equipamentos Comerciais',
      serviceType: 'Móveis de Escritório, Automação Comercial e PDV',
      differentials: 'Fornecimento de equipamentos de caixa/PDV, móveis planejados para recepção e telefonia corporativa.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configurar Seu Perfil Comercial</h2>
              <p className="text-xs text-slate-400">
                A IA usará estas informações para personalizar os pitches de vendas.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Quick Presets */}
          <div>
            <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Escolha um modelo rápido de serviço:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SERVICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    serviceType: preset.serviceType,
                    differentials: preset.differentials
                  }))}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-left transition-all flex items-center justify-between"
                >
                  <span className="font-bold text-slate-200">{preset.title}</span>
                  <span className="text-[10px] text-blue-400 font-semibold">Usar este</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Seu Nome ou Nome da Sua Empresa:
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Ex: Alfa Contabilidade ou João Silva"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tipo de Serviço Que Você Oferece aos Novos CNPJs:
              </label>
              <input
                type="text"
                value={formData.serviceType}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                placeholder="Ex: Contabilidade, Criação de Sites, Sistemas de TI, PPCI, Mídia..."
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Diferenciais da Sua Proposta (O que te destaca para novas empresas?):
              </label>
              <textarea
                value={formData.differentials}
                onChange={(e) => setFormData(prev => ({ ...prev, differentials: e.target.value }))}
                rows={3}
                placeholder="Ex: Atendimento rápido, consultoria de abertura grátis, foco em empresas de Caxias do Sul e região..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Seu Telefone / WhatsApp para Receber Respostas:
              </label>
              <input
                type="text"
                value={formData.phoneWhatsApp}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneWhatsApp: e.target.value }))}
                placeholder="Ex: 54999887766"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-all flex items-center space-x-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Salvo!' : 'Salvar Perfil'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
