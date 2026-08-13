import React, { useState } from 'react';
import { Zap, ArrowRight, X, Clock, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export function VibeCheckModal({ isOpen, onClose, onConfirm, defaultSessionTime = 45 }) {
  const [selectedVibe, setSelectedVibe] = useState('Media');
  const [selectedDuration, setSelectedDuration] = useState(defaultSessionTime || 45);

  if (!isOpen) return null;

  const vibes = [
    {
      id: 'Baja',
      title: 'Baja Energía ⚡',
      subtitle: 'Fatiga / Día pesado',
      desc: 'Regula volumen a 2 series por ejercicio para evitar sobreentrenamiento.',
      border: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    },
    {
      id: 'Media',
      title: 'Media / Normal ⚡⚡',
      subtitle: 'Estado óptimo',
      desc: 'Plan equilibrado con descanso estándar y volumen objetivo.',
      border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'Alta',
      title: 'Alta Energía ⚡⚡⚡',
      subtitle: 'Modo Bestia',
      desc: 'Series adicionales y remate para estímulo máximo.',
      border: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
    }
  ];

  const durationOptions = [
    {
      value: 30,
      label: '30 min',
      badge: '⚡ Expres',
      desc: 'Pausas cortas (45s) y alta densidad.'
    },
    {
      value: 45,
      label: '45-60 min',
      badge: '⚖️ Estándar',
      desc: 'Equilibrio base de Genoma IA.'
    },
    {
      value: 90,
      label: '90-120 min',
      badge: '🔥 Extenso',
      desc: 'Volumen máximo e hipertrofia.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <Zap className="w-7 h-7 text-zinc-950 font-bold" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Configuración Pre-Entreno de Hoy</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Ajusta tu nivel de energía y el tiempo del que dispones para esta sesión.
          </p>
        </div>

        {/* 1. Energy Vibe Picker */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
            1. Nivel de Energía Hoy:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {vibes.map(vibe => {
              const isSelected = selectedVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? vibe.border
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-extrabold text-xs text-zinc-100">{vibe.title}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{vibe.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Today's Session Duration Picker */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span>2. Duración Disponible Hoy:</span>
            </span>
            <span className="text-emerald-400 font-bold text-xs">{selectedDuration} min</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map(opt => {
              const isSelected = selectedDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedDuration(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs text-zinc-100 flex items-center justify-between">
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">{opt.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={() => onConfirm(selectedVibe, selectedDuration)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all"
        >
          <span>Iniciar ({selectedDuration} min • Vibe {selectedVibe})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
