import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Lock, X, KeyRound, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    adminLogin,
    loginWithGoogle,
    setIsAdminViewOpen,
    currentUser,
    isAdmin
  } = usePharmacy();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(password);
    if (success) {
      setError(false);
      setPassword('');
      setIsAdminLoginOpen(false);
      setIsAdminViewOpen(true);
    } else {
      setError(true);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        setIsAdminLoginOpen(false);
        setIsAdminViewOpen(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdminLoginOpen(false);
            setError(false);
            setPassword('');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Acesso Administrativo
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Área restrita para gestão de produtos, pedidos, QR Code Pix e configurações da farmácia
          </p>
        </div>

        {/* Google One-Click Login */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300 shadow-2xs text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Entrando...' : 'Entrar com Google (Firebase Auth)'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">ou use a senha</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha de Administrador
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            {error && (
              <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            Senha padrão de demonstração: <strong className="text-slate-800 font-mono">admin123</strong>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-sm transition-all cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};
