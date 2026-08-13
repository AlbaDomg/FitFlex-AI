import React, { useState } from 'react';
import { Dumbbell, User, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginScreen({ onLogin }) {
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput) {
      setErrorMsg('Por favor introduce tu dirección de correo electrónico real.');
      return;
    }

    const res = onLogin(emailInput, usernameInput);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-3">
            <Dumbbell className="w-8 h-8 text-zinc-950 font-black" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
            FitFlex <span className="text-emerald-400">AI</span>
          </h1>

          <p className="text-xs text-zinc-400">
            Portal Privado de Entrenamientos Inteligentes. Escribe tu correo y tu nombre para ingresar.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start space-x-2.5"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Tu Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="tu-correo-real@gmail.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Tu Nombre / Apodo
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ej. Alba / Carlos"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all active:scale-[0.99]"
          >
            <span>INGRESAR A MI CUENTA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="leading-snug">
            El primer correo registrado será asignado automáticamente como <strong>Administrador Principal</strong>.
          </span>
        </div>

      </motion.div>
    </div>
  );
}
