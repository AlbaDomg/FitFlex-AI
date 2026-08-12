import React, { useState } from 'react';
import { TrendingUp, Trophy, Activity, Calendar, Plus, Sparkles, Flame, CheckCircle, Dumbbell, User, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { EXERCISE_DATABASE, getMuscleSpanishName } from '../data/exerciseDatabase';

export function EvolutionAnalytics({ loadLogHooks, profileHooks }) {
  const { logs, getExerciseHistory, getVolumeByMuscle, badges } = loadLogHooks;
  const { streakDays, weightHistory, addWeightLog } = profileHooks;

  const [selectedExerciseId, setSelectedExerciseId] = useState('ex-chest-1');
  const [newWeightInput, setNewWeightInput] = useState('');
  const [showWeightModal, setShowWeightModal] = useState(false);

  const history = getExerciseHistory(selectedExerciseId);
  const volumeData = getVolumeByMuscle();

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (newWeightInput && !isNaN(newWeightInput)) {
      addWeightLog(newWeightInput);
      setNewWeightInput('');
      setShowWeightModal(false);
    }
  };

  // SVG Line Chart Helper for exercise progress
  const chartHeight = 160;
  const chartWidth = 500;
  const weights = history.map(h => h.weight || 0);
  const minW = weights.length ? Math.min(...weights) - 5 : 40;
  const maxW = weights.length ? Math.max(...weights) + 5 : 80;

  const points = history.map((h, index) => {
    const x = (index / Math.max(1, history.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((h.weight - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
    return { x, y, weight: h.weight, date: h.timestamp, isPR: h.isPR };
  });

  const pathD = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Métricas & Gamificación</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Seguimiento de Evolución & Racha
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Visualiza tu sobrecarga progresiva en tiempo real y tus logros desbloqueados.
          </p>
        </div>

        <button
          onClick={() => setShowWeightModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Peso Corporal</span>
        </button>
      </div>

      {/* Progressive Overload Chart Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                Gráfica de Sobrecarga Progresiva
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Historial de peso cargado por ejercicio en el tiempo.
              </p>
            </div>
          </div>

          {/* Exercise Selector */}
          <select
            value={selectedExerciseId}
            onChange={e => setSelectedExerciseId(e.target.value)}
            className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            {EXERCISE_DATABASE.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({getMuscleSpanishName(ex.muscleGroup)})
              </option>
            ))}
          </select>
        </div>

        {/* SVG Progress Graph */}
        <div className="w-full overflow-x-auto p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
          {history.length > 0 ? (
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
              {/* Background horizontal grid lines */}
              <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="rgba(161, 161, 170, 0.15)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="rgba(161, 161, 170, 0.15)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2={chartWidth} y2="120" stroke="rgba(161, 161, 170, 0.15)" strokeDasharray="4 4" />

              {/* Line path */}
              <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />

              {/* Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={p.isPR ? 7 : 5} fill={p.isPR ? '#06b6d4' : '#22c55e'} stroke="#09090b" strokeWidth="2" />
                  <text x={p.x} y={p.y - 12} fill="#a1a1aa" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {p.weight} kg {p.isPR ? '🏆' : ''}
                  </text>
                  <text x={p.x} y={chartHeight - 4} fill="#71717a" fontSize="9" textAnchor="middle">
                    {p.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400">
              No hay registros aún para este ejercicio. ¡Completa una sesión para sincronizar datos!
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Volume Distribution & Body Weight History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Muscle Volume Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <span>Volumen Total por Grupo Muscular</span>
          </h3>

          <div className="space-y-3">
            {volumeData.length > 0 ? (
              volumeData.map(v => (
                <div key={v.muscle} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize text-zinc-700 dark:text-zinc-300">{getMuscleSpanishName(v.muscle)}</span>
                    <span className="text-emerald-500 font-bold">{v.volume} kg</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      style={{ width: `${Math.min(100, (v.volume / 1500) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 py-4">Sincronizando volumen...</div>
            )}
          </div>
        </div>

        {/* Body Weight History Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Línea de Tiempo de Peso Corporal</span>
          </h3>

          <div className="space-y-2">
            {weightHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs"
              >
                <span className="text-zinc-500 font-medium">{item.date}</span>
                <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{item.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Gamification: Badges & Medals Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
            Medallas & Logros Unlocked
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all ${
                b.unlocked
                  ? 'border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/10 text-zinc-900 dark:text-zinc-100'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-400 opacity-50'
              }`}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${b.unlocked ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                <Trophy className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold">{b.title}</h4>
                  {b.unlocked && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{b.desc}</p>
                {b.date && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                    Desbloqueado: {b.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <form onSubmit={handleAddWeight} className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-4">
            <h3 className="text-lg font-bold">Registrar Peso Hoy</h3>
            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Peso en Kilogramos</label>
              <input
                type="number"
                step="0.1"
                placeholder="76.5"
                value={newWeightInput}
                onChange={e => setNewWeightInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-bold text-lg focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWeightModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
