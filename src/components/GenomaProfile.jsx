import React, { useState } from 'react';
import { User, Dumbbell, Clock, ShieldAlert, Calendar, CheckCircle, Play, X, HeartPulse, Zap, Flame, Trophy, Activity } from 'lucide-react';
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
      
      {/* High-Energy Athletic Hero Header Banner */}
      <div className="relative rounded-3xl sports-card border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center space-x-2">
              <span className="athletic-badge px-2.5 py-1 rounded text-xs font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 uppercase tracking-widest shadow-md">
                HIGH PERFORMANCE
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                <span>GENOMA IA V3.0</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              CENTRAL DE <span className="text-emerald-500 dark:text-emerald-400">ENTRENAMIENTO</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Estructura semanal inteligente con periodización de cargas, sobrecarga progresiva y ventanas de recuperación biológica.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-3 px-5 py-3 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 border border-emerald-500/40 shadow-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">OBJETIVO CLAVE</span>
              <span className="text-sm font-black text-slate-100 uppercase tracking-tight">{goal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Metric Deck Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl sports-card border border-slate-200 dark:border-slate-800/80 shadow-lg">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Biometría</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {weight} <span className="text-xs text-slate-500 font-bold">KG</span> / {age} <span className="text-xs text-slate-500 font-bold">AÑOS</span>
          </div>
          <div className="text-[11px] text-emerald-500 dark:text-emerald-400 font-extrabold uppercase tracking-wider mt-1">{gender}</div>
        </div>

        <div className="p-4 rounded-2xl sports-card border border-slate-200 dark:border-slate-800/80 shadow-lg">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Frecuencia</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {daysPerWeek} <span className="text-xs text-slate-500 font-bold">DÍAS/SEM</span>
          </div>
          <div className="text-[11px] text-cyan-500 dark:text-cyan-400 font-extrabold uppercase tracking-wider mt-1">Split Adaptativo</div>
        </div>

        <div className="p-4 rounded-2xl sports-card border border-slate-200 dark:border-slate-800/80 shadow-lg">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Duración</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {sessionTime} <span className="text-xs text-slate-500 font-bold">MIN/SESIÓN</span>
          </div>
          <div className="text-[11px] text-amber-500 dark:text-amber-400 font-extrabold uppercase tracking-wider mt-1">Optimizado</div>
        </div>

        <div className="p-4 rounded-2xl sports-card border border-slate-200 dark:border-slate-800/80 shadow-lg">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <Dumbbell className="w-4 h-4 text-purple-400" />
            <span>Equipamiento</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
            {equipment === 'gym' ? 'Gimnasio' : equipment === 'dumbbells' ? 'Mancuernas' : 'Bodyweight'}
          </div>
          <div className="text-[11px] text-purple-500 dark:text-purple-400 font-extrabold uppercase tracking-wider mt-1">Filtro Inteligente</div>
        </div>
      </div>

      {/* Protected Injury Zones Alert */}
      {protectedZones && protectedZones.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center space-x-3 shadow-md">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold uppercase tracking-wider text-amber-500">Zonas Protegidas: </span>
            <span className="font-semibold">Filtro de impacto activo para {protectedZones.join(', ')}.</span>
          </div>
        </div>
      )}

      {/* Weekly Split Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>DIVISIÓN SEMANAL IA</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Selecciona una tarjeta para iniciar la sesión de ese día.
            </p>
          </div>
          <span className="athletic-badge px-3 py-1 rounded text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider hidden sm:inline-block">
            ENTRENAMIENTOS EN VIVO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {split.map((item, idx) => {
            const isCompletedDay = !!completedSplitDays[item.day];
            const isWorkoutDay = item.muscles.length > 0;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(item)}
                className={`p-5 rounded-2xl sports-card flex flex-col justify-between shadow-xl cursor-pointer transition-all ${
                  isCompletedDay
                    ? 'bg-emerald-500/15 border-emerald-500/80 text-slate-900 dark:text-white ring-2 ring-emerald-500/40'
                    : isWorkoutDay
                    ? 'border-slate-800 hover:border-emerald-500/80 hover:shadow-emerald-500/20'
                    : 'border-slate-800/60 hover:border-cyan-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2.5">
                    <span className="text-slate-400">{item.day}</span>
                    {isCompletedDay ? (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                        <CheckCircle className="w-3 h-3" />
                        <span>COMPLETADO</span>
                      </span>
                    ) : isWorkoutDay ? (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                        <Play className="w-2.5 h-2.5 fill-emerald-400" />
                        <span>INICIAR</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black border border-cyan-500/30">
                        DESCANSO
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 font-bold mt-1">
                    {item.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  {item.muscles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.muscles.map(m => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[9px] font-extrabold text-slate-300 uppercase border border-slate-700"
                        >
                          {getMuscleSpanishName(m)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-cyan-400 font-bold flex items-center space-x-1">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Recuperación Muscular</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
          <div className="w-full max-w-md sports-card border border-cyan-500/40 p-6 shadow-2xl text-slate-100 space-y-4 relative text-center">
            <button
              onClick={() => setSelectedRestDay(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto ring-4 ring-cyan-500/20">
              <HeartPulse className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-white">{selectedRestDay.day}: Recuperación Activa</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800 font-medium">
              💡 La IA recomienda hoy hidratación adecuada (2.5L de agua), movilidad articular suave (15 min) y descanso profundo para promover la síntesis proteica muscular.
            </p>

            <button
              onClick={() => setSelectedRestDay(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Entendido, a Descansar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

