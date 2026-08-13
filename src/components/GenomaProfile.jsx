import React, { useState } from 'react';
import { Sparkles, User, Dumbbell, Clock, ShieldAlert, Calendar, CheckCircle, Play, X, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMuscleSpanishName } from '../data/exerciseDatabase';

export function GenomaProfile({ profile, onSelectSplitDay, completedSplitDays = {} }) {
  const { gender, age, weight, goal, daysPerWeek, sessionTime, equipment, protectedZones, split = [] } = profile;
  const [selectedRestDay, setSelectedRestDay] = useState(null);

  const handleCardClick = (item) => {
    if (item.muscles.length === 0) {
      setSelectedRestDay(item);
    } else {
      onSelectSplitDay(item);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      
      {/* Clean & Balanced Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-50 via-slate-50 to-cyan-50 border border-emerald-500/20 dark:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-950 dark:to-black dark:border-zinc-800 p-6 sm:p-7 overflow-hidden shadow-lg transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Perfil de Entrenamiento & División IA
            </h1>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
              Plan semanal adaptativo estructurado con sobrecarga progresiva y períodos de recuperación muscular.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-500/30 dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Enfoque: <span className="text-emerald-600 dark:text-emerald-400">{goal}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 shadow-sm">
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Biometría</span>
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {weight} <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">kg</span> / {age} <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">años</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{gender}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 shadow-sm">
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>Frecuencia</span>
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {daysPerWeek} <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">días/sem</span>
          </div>
          <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-1 font-medium">Split Adaptativo</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 shadow-sm">
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Duración Límite</span>
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {sessionTime} <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">min/sesión</span>
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">Optimizado</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 shadow-sm">
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
            <Dumbbell className="w-4 h-4 text-purple-500" />
            <span>Equipamiento</span>
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 capitalize">
            {equipment === 'gym' ? 'Gimnasio' : equipment === 'dumbbells' ? 'Mancuernas' : 'Bodyweight'}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">Filtrado Completo</div>
        </div>
      </div>

      {/* Protected Injury Zones */}
      {protectedZones && protectedZones.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400">Protecciones de Lesión Activas: </span>
            <span>El sistema evitará automáticamente ejercicios de alto impacto en {protectedZones.join(', ')}.</span>
          </div>
        </div>
      )}

      {/* Weekly Split Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span>División Semanal Sugerida por la IA</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Toca cualquier tarjeta para generar e iniciar el entrenamiento de ese día en vivo.
            </p>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 hidden sm:inline-block">
            Toca una tarjeta para Entrenar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {split.map((item, idx) => {
            const isCompletedDay = !!completedSplitDays[item.day];
            const isWorkoutDay = item.muscles.length > 0;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(item)}
                className={`p-5 rounded-2xl border flex flex-col justify-between shadow-md cursor-pointer transition-all ${
                  isCompletedDay
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-zinc-900 dark:text-zinc-50 ring-1 ring-emerald-500/30'
                    : isWorkoutDay
                    ? 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
                    : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/60 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="text-zinc-500 dark:text-zinc-400">{item.day}</span>
                    {isCompletedDay ? (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completado</span>
                      </span>
                    ) : isWorkoutDay ? (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                        <Play className="w-2.5 h-2.5 fill-emerald-500 dark:fill-emerald-400" />
                        <span>Iniciar</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px]">
                        Descanso
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    {item.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  {item.muscles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.muscles.map(m => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 uppercase border border-zinc-200 dark:border-zinc-800"
                        >
                          {getMuscleSpanishName(m)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center space-x-1">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Recuperación muscular</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rest Day Modal Info */}
      {selectedRestDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-900 dark:text-zinc-100 space-y-4 relative text-center">
            <button
              onClick={() => setSelectedRestDay(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mx-auto ring-8 ring-cyan-500/10">
              <HeartPulse className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">{selectedRestDay.day}: Recuperación Activa</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              💡 La IA recomienda hoy hidratación adecuada (2.5L de agua), movilidad articular suave (15 min) y descanso profundo para promover la síntesis proteica muscular.
            </p>

            <button
              onClick={() => setSelectedRestDay(null)}
              className="w-full py-3 rounded-2xl bg-cyan-500 text-zinc-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              Entendido, a Descansar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
