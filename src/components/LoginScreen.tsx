import React, { useState, useEffect } from 'react';
import { getStoredPassword, saveStoredPassword } from '../data/mockDatabase';
import { Lock, Unlock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPassword = getStoredPassword();
    if (!savedPassword) {
      setIsFirstAccess(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isFirstAccess) {
      if (password.length < 4) {
        setError('A senha deve ter pelo menos 4 caracteres.');
        return;
      }
      saveStoredPassword(password);
      setIsFirstAccess(false);
      onLoginSuccess();
    } else {
      const savedPassword = getStoredPassword();
      if (password === savedPassword) {
        onLoginSuccess();
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorator blob */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            {isFirstAccess ? (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            ) : (
              <Lock className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white text-center tracking-tight">
            LeadCNPJ Brasil
          </h1>
          <p className="text-sm text-slate-400 text-center mt-2">
            {isFirstAccess
              ? 'Defina uma senha mestre para proteger seus dados locais.'
              : 'Insira sua senha mestre para acessar o sistema.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-slate-300 font-semibold mb-2 text-sm">
              {isFirstAccess ? 'Criar Senha Mestre' : 'Senha de Acesso'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {error && <p className="text-rose-400 text-xs mt-2 font-medium animate-in slide-in-from-top-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isFirstAccess ? 'Salvar Senha & Entrar' : 'Entrar no Sistema'}</span>
            {isFirstAccess ? <ShieldCheck className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
      <p className="text-xs text-slate-500 mt-8 text-center max-w-sm">
        Esta é uma camada de segurança local. Sua senha e dados ficam armazenados apenas no seu navegador.
      </p>
    </div>
  );
};
