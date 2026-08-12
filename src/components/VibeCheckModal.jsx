import React, { useState } from 'react';
import { Zap, Flame, Shield, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function VibeCheckModal({ isOpen, onClose, onConfirm }) {
  const [selectedVibe, setSelectedVibe] = useState('Media');

  if (!isOpen) return null;

  const vibes = [
    {
      id: 'Baja',
      title: 'Baja Energía ⚡',
      subtitle: 'Fatiga o día pesado',
      desc: 'El algoritmo ajusta a 2 series por ejercicio con pausas amplias para evitar sobreentrenamiento.',
      color: 'amber',
      border: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    },
    {
      id: 'Media',
      title: 'Media / Normal ⚡⚡',
      subtitle: 'Buen estado general',
      desc: 'Mantendremos el plan base con descanso estándar y volumen objetivo equilibrado.',
      color: 'emerald',
      border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'Alta',
      title: 'Alta Energía ⚡⚡⚡',
      subtitle: 'Modo Bestia / Motivado',
      desc: 'Añadiremos 1 serie extra o remate Drop-Set para maximizar el estímulo de hipertrofia.',
      color: 'cyan',
      border: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <Zap className="w-7 h-7 text-zinc-950 font-bold" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Chequeo de Energía Pre-Entreno</h2>
          <p className="text-xs text-zinc-400 mt-1">
            ¿Cómo te sientes hoy? La IA ajustará instantáneamente la intensidad.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {vibes.map(vibe => {
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => setSelectedVibe(vibe.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? vibe.border
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-100">{vibe.title}</span>
                  <span className="text-xs text-zinc-500 font-medium">{vibe.subtitle}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{vibe.desc}</p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onConfirm(selectedVibe)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all"
        >
          <span>Comenzar Entrenamiento con Vibe {selectedVibe}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
