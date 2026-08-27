import React, { useState } from 'react';
import { Settings, User, RefreshCw, Trash2, LogOut, X, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsModal({ isOpen, onClose, currentUser, onUpdateUsername, onOpenOnboarding, onResetApp, onLogout }) {
  const [usernameInput, setUsernameInput] = useState(currentUser?.username || '');
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('fitflex_custom_api_key') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveUsername = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onUpdateUsername(usernameInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('fitflex_custom_api_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('fitflex_custom_api_key');
    }
    setIsApiKeySaved(true);
    setTimeout(() => setIsApiKeySaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-50">Configuración & Cuenta</h2>
            <p className="text-xs text-zinc-400">{currentUser?.email}</p>
          </div>
        </div>

        {/* 1. Edit Username Form */}
        <form onSubmit={handleSaveUsername} className="space-y-2 pt-2 border-t border-zinc-800">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Nombre de Usuario
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center space-x-1"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <span>Guardar</span>}
            </button>
          </div>
        </form>

        {/* 2. Custom API Key (Optional) */}
        <form onSubmit={handleSaveApiKey} className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              API Key Personal de IA (Opcional)
            </label>
            <span className="text-[10px] text-emerald-400 font-semibold">Gratis activo por defecto</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="password"
                placeholder="sk-... (Opcional OpenAI Key)"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-zinc-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center space-x-1"
            >
              {isApiKeySaved ? <Check className="w-3.5 h-3.5" /> : <span>Guardar</span>}
            </button>
          </div>
          <p className="text-[10px] text-zinc-400">
            Si dejas el campo vacío, el Coach usará automáticamente el motor público de la nube gratis.
          </p>
        </form>

        {/* 2. Actions List */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-800">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Opciones del Genoma
          </label>

          <button
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
            className="w-full p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left flex items-center justify-between text-xs text-zinc-200 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold">Reconfigurar Genoma IA</div>
                <div className="text-[11px] text-zinc-400">Modificar objetivo, biometría o lesiones</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de resetear todos tus datos de entrenamiento?')) {
                onClose();
                onResetApp();
              }
            }}
            className="w-full p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-left flex items-center justify-between text-xs text-red-400 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-4 h-4 text-red-400" />
              <div>
                <div className="font-bold">Resetear Datos de la App</div>
                <div className="text-[11px] text-red-400/80">Borrar historial y comenzar desde cero</div>
              </div>
            </div>
          </button>
        </div>

        {/* 3. Logout Footer */}
        <div className="pt-2 border-t border-zinc-800">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-red-400 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
