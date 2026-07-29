import React, { useState } from 'react';
import { X, MapPin, Search, Check, Building2, Sparkles, Navigation } from 'lucide-react';
import { ESTADOS_BRASIL, CIDADES_POR_ESTADO, getCitiesForState } from '../data/cities';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUf: string;
  currentMunicipio: string;
  onSelectCity: (uf: string, municipio: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentUf,
  currentMunicipio,
  onSelectCity
}) => {
  const [selectedUf, setSelectedUf] = useState<string>(currentUf);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCityInput, setCustomCityInput] = useState<string>('');

  if (!isOpen) return null;

  const citiesInUf = getCitiesForState(selectedUf);
  const filteredCities = citiesInUf.filter(c =>
    c.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      onSelectCity(selectedUf, customCityInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Selecione a Cidade do Radar</h2>
              <p className="text-xs text-slate-400">
                Explore empresas em abertura em Caxias do Sul (RS) ou em qualquer município do Brasil.
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

        {/* Quick Featured Buttons */}
        <div className="px-5 py-3 bg-slate-850 border-b border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Atalhos Rápidos de Prospecção:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onSelectCity('RS', 'Caxias do Sul');
                onClose();
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition-all ${
                currentUf === 'RS' && currentMunicipio === 'Caxias do Sul'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>📍 Caxias do Sul (RS)</span>
              <span className="bg-amber-400/20 text-amber-200 text-[10px] px-1 rounded">Região Serra</span>
            </button>

            <button
              onClick={() => {
                onSelectCity('RS', 'Porto Alegre');
                onClose();
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              Porto Alegre (RS)
            </button>

            <button
              onClick={() => {
                onSelectCity('RS', 'Bento Gonçalves');
                onClose();
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              Bento Gonçalves (RS)
            </button>

            <button
              onClick={() => {
                onSelectCity('SP', 'São Paulo');
                onClose();
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              São Paulo (SP)
            </button>

            <button
              onClick={() => {
                onSelectCity('PR', 'Curitiba');
                onClose();
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              Curitiba (PR)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Step 1: Select State UF */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              1. Selecione o Estado (UF):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1.5">
              {ESTADOS_BRASIL.map(est => (
                <button
                  key={est.uf}
                  onClick={() => {
                    setSelectedUf(est.uf);
                    setSearchQuery('');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                    selectedUf === est.uf
                      ? 'bg-blue-600 border-blue-500 text-white shadow'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {est.uf}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: City List & Search */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                2. Cidades do Estado de {ESTADOS_BRASIL.find(e => e.uf === selectedUf)?.nome || selectedUf}:
              </label>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-sm rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = currentUf === selectedUf && currentMunicipio === city.nome;
                return (
                  <button
                    key={city.nome}
                    onClick={() => {
                      onSelectCity(selectedUf, city.nome);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-semibold'
                        : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm">{city.nome}</span>
                        {city.destaque && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 rounded font-bold">
                            Serra Gaúcha
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        ~{city.empresasAbertasMesAtual} novas empresas/mês
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Municipality Input Option */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Não encontrou a cidade na lista? Digite o nome do município ({selectedUf}):
            </label>
            <form onSubmit={handleApplyCustom} className="flex space-x-2">
              <input
                type="text"
                placeholder={`Ex: Farroupilha, Vacaria, Bento Gonçalves...`}
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!customCityInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
