import React, { useState } from 'react';
import { Dumbbell, User, Mail, ArrowRight, AlertCircle, ShieldCheck, Zap, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginScreen({ onLogin }) {
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput) {
      setErrorMsg('Por favor introduce tu dirección de correo electrónico real.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onLogin(emailInput, usernameInput);
      if (res && !res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor de membresías. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] sports-bg-pattern text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md sports-card border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-2xl"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30 transform -rotate-3">
              <Dumbbell className="w-9 h-9 text-slate-950 font-black" />
            </div>
            <div className="absolute -top-1 -right-1">
              <span className="athletic-badge px-2 py-0.5 rounded text-[9px] font-black bg-orange-500 text-slate-950 uppercase tracking-widest shadow-md">
                LIVE
              </span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-brand tracking-wider text-white uppercase">
              FIT<span className="text-emerald-400">FLEX</span> <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest font-heading">
              Sistema de Entrenamiento de Alto Rendimiento
            </p>
          </div>
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
            <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest block mb-2 flex items-center justify-between">
              <span>Tu Correo Electrónico</span>
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="tu-correo-real@gmail.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest block mb-2 flex items-center justify-between">
              <span>Tu Nombre / Atleta</span>
              <User className="w-3.5 h-3.5 text-cyan-400" />
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Alba / Carlos"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'VERIFICANDO ACCESO...' : 'ENTRAR AL PORTAL'}</span>
            <Zap className={`w-4 h-4 text-slate-950 fill-slate-950 ${isSubmitting ? 'animate-spin' : ''}`} />
          </button>
        </form>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="leading-snug">
            El primer correo registrado se asignará automáticamente como <strong>Administrador Principal</strong>.
          </span>
        </div>

      </motion.div>
    </div>
  );
}

