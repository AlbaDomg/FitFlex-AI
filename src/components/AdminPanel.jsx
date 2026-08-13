import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Trash2, Mail, User, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminPanel({ authorizedList, onAddEmail, onRemoveEmail }) {
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!newEmail) {
      setMsg({ type: 'error', text: 'Escribe la dirección de correo a autorizar.' });
      return;
    }

    const success = onAddEmail(newEmail, newUsername);
    if (success) {
      setMsg({ type: 'success', text: `Correo "${newEmail}" añadido a la lista autorizada.` });
      setNewEmail('');
      setNewUsername('');
    } else {
      setMsg({ type: 'error', text: 'Ese correo ya se encuentra en la lista autorizada.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-emerald-500/30 text-zinc-100 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Panel Exclusivo de Administrador</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-50 tracking-tight">
          Gestión de Membresías & Acceso de Usuarios
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Agrega los correos de las personas a las que permites usar FitFlex AI. Solo los correos en esta lista podrán ingresar y cada uno tendrá su cuenta y datos 100% independientes.
        </p>
      </div>

      {/* Add New Authorized Subscriber Card */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <h2 className="text-base font-bold text-zinc-100 flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-emerald-400" />
          <span>Autorizar Nuevo Suscriptor / Cliente</span>
        </h2>

        {msg.text && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {msg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-zinc-400 font-semibold block mb-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="cliente@gmail.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-semibold block mb-1">Nombre / Nombre de Usuario</label>
            <input
              type="text"
              placeholder="Ej. Carlos / María"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all"
            >
              Autorizar Suscriptor
            </button>
          </div>
        </form>
      </div>

      {/* Authorized Users List Table */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100">
            Lista de Suscriptores Autorizados ({authorizedList.length})
          </h2>
          <span className="text-xs text-zinc-400">Control de Acceso</span>
        </div>

        <div className="space-y-2">
          {authorizedList.map(item => (
            <div
              key={item.email}
              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-zinc-100 flex items-center space-x-2">
                    <span>{item.username}</span>
                    {item.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-400 font-medium">{item.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
                  Alta: {item.addedAt || '2026-08-13'}
                </span>

                {item.role !== 'admin' && (
                  <button
                    onClick={() => onRemoveEmail(item.email)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                    title="Revocar Acceso de Suscripción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
